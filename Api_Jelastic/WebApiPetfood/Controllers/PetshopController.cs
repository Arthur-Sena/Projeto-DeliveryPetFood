using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiPetfood.Models;
using WebApiPetfood.Repositories;

namespace WebApiPetfood.Controllers
{
    [ApiController]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class PetshopController : ControllerBase
    {
        PetshopRepository PetshopRepository = new PetshopRepository();
        AvaliacaoRepository AvaliacaoRepository = new AvaliacaoRepository();
        EmailRepository EmailRepository = new EmailRepository();
        CodificarStringRepository CodificarRepository = new CodificarStringRepository();

        // ----------------------------------LISTA DE PETSHOP---------------------------------------\\
        [Authorize(Roles="Administrador, Diretor")]
        [HttpGet]
        public IActionResult Listar()
        {
            return Ok(PetshopRepository.ListarPetshops());
        }

        [Authorize(Roles="Administrador, Diretor")]
        [HttpGet("Count")]
        public IActionResult ListarQuantidade()
        {
            return Ok(PetshopRepository.ListarPetshops().Count());
        }

        [Authorize]
        [HttpGet("status={id:int}")]
        public IActionResult VerificarStatus(int id)
        {
            return Ok(PetshopRepository.VerificarStatusDoPetshops(id));
        }

        //----------------------------------LISTA DE PETSHOP PROXIMOS---------------------------------\\
        [AllowAnonymous]
        [HttpGet("Raio=3km,lat:{lat},lng:{lng}")]
        public IActionResult ListarPetshopRaioDe3km(decimal lat, decimal lng)
        {
            return Ok(PetshopRepository.ListarPetshopsRaio3km(lat, lng));
        }

        [AllowAnonymous]
        [HttpGet("Raio=7.5km,lat:{lat},lng:{lng}")]
        public IActionResult ListarPetshopRaioDe7_5km(decimal lat, decimal lng)
        {
            return Ok(PetshopRepository.ListarPetshopsRaio7_5km(lat, lng));
        }

        [AllowAnonymous]
        [HttpGet("Raio=10km,lat:{lat},lng:{lng}")]
        public IActionResult ListarPetshopRaioDe10km(decimal lat, decimal lng)
        {
            return Ok(PetshopRepository.ListarPetshopsRaio10km(lat, lng));
        }
        
        [AllowAnonymous]
        [HttpGet("Raio=15km,lat:{lat},lng:{lng}")]
        public IActionResult ListarPetshopRaioDe15km(decimal lat, decimal lng)
        {
            return Ok(PetshopRepository.ListarPetshopsRaio15km(lat, lng));
        }

        // ------------------------------BUSCAR PETSHOP POR ID---------------------------------------\\
        [AllowAnonymous]
        [HttpGet("{id:int}")]
        public IActionResult ListarPetshopsPorId(int id)
        {
            return Ok(PetshopRepository.ListarPetshopsPorId(id));
        }

        // ------------------------------CADASTRAR PETSHOP---------------------------------------\\
        [Authorize(Roles="Administrador,Diretor")]
        [HttpPost]
        public IActionResult CadastrarPetshop(CadastroPetshop petshop)
        {
            try
            {
                Petshop pet = new Petshop();
                pet.Email = petshop.Email;
                pet.Senha = CodificarRepository.Encrypt(petshop.Senha);
                pet.Nome  = petshop.Nome;
                pet.Cep   = petshop.Cep;
                pet.Endereco = petshop.Endereco;
                pet.Cidade   = petshop.Cidade;
                pet.Estado   = petshop.Estado;
                pet.Longitude= petshop.Longitude;
                pet.Latitude = petshop.Latitude;
                pet.Telefone = petshop.Telefone;
                pet.Status = false;
                pet.Avaliacao = 3;
                pet.Idtipousuario  = 4;
                pet.Horaabertura   = petshop.Horaabertura;
                pet.Horafechamento = petshop.Horafechamento;
                pet.Carteiradigital = 0;
                pet.deletado = false;
                pet.Logistica = petshop.Logistica;
                pet.RetirarNaLoja = false;
                PetshopRepository.CadastrarPetshop(pet);

                Avaliacao avaliacao = new Avaliacao();
                avaliacao.idPetshop = pet.Idpetshop;
                AvaliacaoRepository.CadastrarAvaliacao (avaliacao);
                return Ok(pet.Idpetshop);
            }
            catch (Exception ex)
            {
                if (ex.InnerException.Message.Contains("23505: duplicate key")){
                    string[] campoDuplicado = ex.InnerException.Message.Split("_");
                    return BadRequest(new { mensagem = $"{campoDuplicado[1]} já cadastrado para outro petshop!"});
                }
                if (ex.InnerException.Message.Contains("22001: value too long")){
                    return BadRequest(new { mensagem = "Erro ao Cadastrar, campo preenchido com valor muito grande." });
                }
                if (ex.InnerException.Message.Contains("23502: null value in column")){
                    string[] campoNulo = ex.InnerException.Message.Split(" ");
                    return BadRequest(new { mensagem = $"Erro ao Cadastrar, {campoNulo[5]} esta vazio." });
                }
                else{ 
                    return BadRequest(new { mensagem = "Erro ao Cadastrar." });
                }
            }
        }

        // ------------------------------CADASTRAR IMG DO PETSHOP------------------------------------\\
        [Authorize(Roles="Administrador,Diretor")]
        [HttpPost("img")]
        public IActionResult CadastrarImagem(Imgpetshop img)
        {
            try
            {
                PetshopRepository.CadastrarImg(img);
                return Ok();
            }
            catch (Exception ex)
            {
                PetshopRepository.DeletarPetshop(img.Idpetshop);
                if (ex.InnerException.Message.Contains("23505: duplicate key")){
                    string[] campoDuplicado = ex.InnerException.Message.Split("_");
                    return BadRequest(new { mensagem = $"{campoDuplicado[1]} já cadastrado para outro usuario!"});
                }
                if (ex.InnerException.Message.Contains("22001: value too long")){
                    return BadRequest(new { mensagem = "Erro ao Cadastrar, imagem muito grande." });
                }
                if (ex.InnerException.Message.Contains("23502: null value in column")){
                    string[] campoNulo = ex.InnerException.Message.Split(" ");
                    return BadRequest(new { mensagem = $"Erro ao Cadastrar, {campoNulo[5]} esta vazio." });
                }
                else{ 
                    return BadRequest(new { mensagem = "Erro ao Cadastrar." });
                }
            }
        }
        
        [HttpPost("CadastrarTermosDeUso")]
        public IActionResult CadastrarConcordanciaComTermosDeUso(TermosPetshop termos)
        {
            try
            {
                PetshopRepository.CadastrarConcordanciaComTermosDeUso(termos);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro" });
            }
        }

        // ------------------------------ATUALIZAR PETSHOP---------------------------------------\\
        [Authorize(Roles="Administrador,Petshop,Diretor")]
        [HttpPut]
        public IActionResult Atualizar(CadastroPetshop petshop)
        {
            try
            {
                if (petshop == null)
                {
                    return NotFound();
                }                
                PetshopRepository.AtualizarPetshop(petshop);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new {
                    mensagem = "Erro. Aguarde um momento. " + ex.Message
                });
            }
        }

// -OLHAR AUTORIZACAO AQUI -----------!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        [Authorize]
        [HttpPut("Avaliacao")]
        public IActionResult AtualizarAvaliacaoDoPetshop(Petshop petshop)
        {
            try
            {
                if (petshop == null)
                {
                    return NotFound();
                }
                PetshopRepository.AtualizarAvaliacaoDoPetshop (petshop);
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException.Message);
                return BadRequest(new {
                    mensagem = "Erro. Aguarde um momento. " + ex.Message
                });
            }
        }
         [Authorize(Roles="Administrador,Diretor")]
        [HttpPut("RetirarNaLoja")]
        public IActionResult AtualizarAvaliacaoStatus(int idPetshop)
        {
            try
            {
                PetshopRepository.DisponibilizarRetiradaDeProdutoNaLoja(idPetshop);
                return Ok();
            }
            catch (Exception ex)
            {
                return Ok("Petshop Não Encontrado");
            }
        }

        [Authorize(Roles="Administrador,Petshop,Diretor")]
        [HttpPut("Status")]
        public IActionResult AtualizarAvaliacaoStatus(Petshop petshop)
        {
            try
            {
                if (petshop == null)
                {
                    return NotFound();
                }
                PetshopRepository.AtualizarAvaliacaoStatus(petshop);
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException.Message);
                return BadRequest(new {
                    mensagem = "Erro. Aguarde um momento. " + ex.Message
                });
            }
        }

        // ------------------------------ATUALIZAR IMG-------------------------------------------------\\
        [Authorize(Roles="Administrador,Petshop,Diretor")]
        [HttpPut("img")]
        public IActionResult Atualizar(Imgpetshop imgpetshop)
        {
            try
            {
                if (imgpetshop == null)
                {
                    return NotFound();
                }
                PetshopRepository.AtualizarImg (imgpetshop);
                return Ok();
            }
            catch (NullReferenceException ex)
            {                
                return BadRequest(new { mensagem = ex.Message});
            }
            catch (InvalidOperationException ex)
            {                
                return BadRequest(new { mensagem = ex.Message});
            }
            catch (Exception ex)
            {                
                if (imgpetshop.Img.Length >= 150000){
                    return BadRequest(new { mensagem = "Erro ao Atualizar, imagem muito grande." });
                }
                if (ex.InnerException.Message.Contains("22001: value too long")){
                    return BadRequest(new { mensagem = "Erro ao Atualizar, imagem muito grande." });
                }
                if (ex.InnerException.Message.Contains("23502: null value in column")){
                    string[] campoNulo = ex.InnerException.Message.Split(" ");
                    return BadRequest(new { mensagem = $"Erro ao Atualizar, {campoNulo[5]} esta vazio." });
                }
                else{                     
                    return BadRequest(new { mensagem = "Erro ao Atualizar" });
                }
            }
        }

        // ------------------------------DELETAR PETSHOP---------------------------------------\\
        [Authorize(Roles="Administrador,Diretor")]
        [HttpDelete("{id}")]
        public IActionResult Deletar(int id)
        {
            PetshopRepository.DeletarPetshop(id);
            return Ok();
        }    

        //-------------------------------RECUPERAR SENHA DO PETSHOP----------------------------------\\
        [HttpPut("RecuperarSenha/email:{email}")]
        public IActionResult RecuperarSenhaParte2(string email)
        {
            string emailRetornado = PetshopRepository.RecuperarSenha(email);
            if (emailRetornado == email)
            {
                string NovaSenha = PetshopRepository.RecuperarSenhaParte2(emailRetornado);
                EmailRepository.EnviarEmailComNovaSenha(email, NovaSenha);
                return Ok("Uma nova senha foi enviada para o seu email");
            } else {
                return Ok("O email inserido não é valido para esse CPF");
            }
        }
    }
}
