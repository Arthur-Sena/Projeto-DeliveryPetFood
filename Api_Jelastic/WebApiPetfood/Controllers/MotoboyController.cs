using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApiPetfood.Models;
using WebApiPetfood.Repositories;
using Microsoft.EntityFrameworkCore;

namespace WebApiPetfood.Controllers
{
    [ApiController]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class MotoboyController : ControllerBase
    {
        MotoboyRepository MotoboyRepository = new MotoboyRepository();
        EmailRepository EmailRepository = new EmailRepository();
        AvaliacaoMotoboyRepository AvaliacaoMotoboyRepository = new AvaliacaoMotoboyRepository();
        LogsRepository LogsRepository = new LogsRepository();
        CodificarStringRepository CodificarRepository = new CodificarStringRepository();

        // -------------------------------LISTA DE ENTREGADORES----------------------------------\\
        [Authorize( Roles = "Administrador,Diretor")]
        [HttpGet]
        public IActionResult Listar()
        {
            return Ok(MotoboyRepository.ListarMotoboy());
        }
        // [Authorize( Roles = "Administrador,Diretor")]
        [HttpGet("Localizacao")]
        public IActionResult ListarUltimaLocalizacaoDoMotoboy()
        {
            return Ok(MotoboyRepository.BuscarUltimaLocalizacaoDoMotoboy());
        }
        // -------------------------------CADASTRO DE ENTREGADOR--------------------------------\\
        [HttpPost("PostLocalizacao")]
        public IActionResult CadastrarUltimaLocalizacao(LocalizacaoMotoboy l)
        {
            try 
            {
                string latitude = l.Latitude;
                string longitude = l.Longitude;
                int idMotoboy = l.idMotoboy;
                MotoboyRepository.CadastrarUltimaLocalizacao(latitude, longitude, idMotoboy);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.InnerException.Message.Contains("23505: duplicate key")){
                    string[] campoDuplicado = ex.InnerException.Message.Split("_");
                    return BadRequest(new { mensagem = $"{campoDuplicado[1]} já cadastrado para outro usuario!"});
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
        [HttpPost]
        public IActionResult Cadastrar(CadastroMotoboy moto)
        {
            try
            {
                Motoboy motoboy = new Motoboy();
                motoboy.Nome  = moto.Nome ;
                motoboy.Email = moto.Email;
                motoboy.Senha = CodificarRepository.Encrypt(moto.Senha);
                motoboy.Cpf   = moto.Cpf;
                motoboy.Telefone = moto.Telefone;
                MotoboyRepository.CadastrarMotoboy(motoboy);

                AvaliacaoMotoboy avaliacao = new AvaliacaoMotoboy();
                avaliacao.idMotoboy = motoboy.Idmotoboy;
                AvaliacaoMotoboyRepository.CadastrarAvaliacao(avaliacao);
                
                ImgMotoboy foto = new ImgMotoboy();
                foto.Img = moto.Foto.Img;
                foto.idMotoboy = motoboy.Idmotoboy;
                MotoboyRepository.CadastrarFotoMotoboy(foto);

                LogsRepository.PostLogMotoboy("Cadastro Motoboy", motoboy.Idmotoboy, moto.Termos.ipDoMotoboy); 

                TermosMotoboy termos = new TermosMotoboy();
                termos.data = moto.Termos.data;
                termos.ipDoMotoboy = moto.Termos.ipDoMotoboy;
                termos.navegadorDoMotoboy = moto.Termos.navegadorDoMotoboy;
                termos.idMotoboy = motoboy.Idmotoboy;
                MotoboyRepository.TermosDeUsoMotoboy(termos);

                return Ok("Cadastrado Com Sucesso");
            }
            catch (Exception ex)
            {
                if (ex.InnerException.Message.Contains("23505: duplicate key")){
                    string[] campoDuplicado = ex.InnerException.Message.Split("_");
                    return BadRequest(new { mensagem = $"{campoDuplicado[1]} já cadastrado para outro usuario!"});
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
        // -------------------------------BUSCAR USUARIO POR ID------------------------------\\
        [Authorize]
        [HttpGet("{id:int}")]
        public IActionResult BuscarMotoboyPorId(int id)
        {
            return Ok(MotoboyRepository.BuscarMotoboyPorId(id));
        }
        // -------------------------------ATUALIZAR USUARIO----------------------------------\\
        [Authorize( Roles = "Administrador,Motoboy,Diretor")]
        [HttpPut]
        public IActionResult Atualizar(Motoboy moto, string senha,string SenhaAntiga)
        {
            try
            {
                if (moto == null)
                {
                    return NotFound();
                }
                MotoboyRepository.AtualizarMoto(moto, senha, SenhaAntiga);
                LogsRepository.PostLogMotoboy("Motoboy Atualizou Perfil", moto.Idmotoboy, Request.Headers["ip_usuario"]); 

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro. Aguarde um momento. " + ex.Message });
            }
        }
        // -------------------------------DELETAR USUARIO------------------------------\\
        [Authorize( Roles = "Administrador,Diretor")]
        [HttpDelete("{id}")]
        public IActionResult Deletar(int id)
        {
            MotoboyRepository.DeletarMoto(id);
            return Ok();
        }

        // -------------------------------RECUPERAR SENHA------------------------------\\
        [HttpPut("RecuperarSenha/cpf:{cpf},email:{email}")]
        public IActionResult RecuperarSenhaParte2(string cpf, string email)
        {
            string emailRetornado = MotoboyRepository.RecuperarSenha(cpf);
            if (emailRetornado == email)
            {
                string NovaSenha = MotoboyRepository.RecuperarSenhaParte2(emailRetornado, cpf);
                EmailRepository.EnviarEmailComNovaSenha (email, NovaSenha);
                return Ok("Uma nova senha foi enviada para o seu email");
            } else {
                return Ok("O email inserido não é valido para esse CPF");
            }
        }
    }
}