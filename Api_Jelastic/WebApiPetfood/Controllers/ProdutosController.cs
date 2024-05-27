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
using Microsoft.AspNetCore.Cors;

namespace WebApiPetfood.Controllers
{
    [ApiController]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class ProdutosController : ControllerBase
    {
        ProdutoRepository ProdutoRepository = new ProdutoRepository();
        LogsRepository LogRepository = new LogsRepository();
 
        // ------------------------------LISTA DE PRODUTOS---------------------------------------------\\
        [Authorize(Roles="Administrador,Diretor")]
        [HttpGet]
        public IActionResult Listar()
        {
            return Ok(ProdutoRepository.ListarProdutos()); 
        }
        
        // -------------------------LISTA DE PRODUTOS DOS PETSHOPS PROXIMOS-----------------------------\\
        [AllowAnonymous]
        [HttpGet("PetshopsNumRaioDe3Km,lat:{lat},lng:{lng}")]
        public IActionResult ListarProdutosDosPetshopsNumRaioDe3km(decimal lat, decimal lng)
        {
            return Ok(ProdutoRepository.ListarProdutosDePetshopsRaio3km(lat, lng)); 
        }
        
        [AllowAnonymous]
        [HttpGet("20PetshopsNumRaioDe3Km,lat:{lat},lng:{lng}")]
        public IActionResult Listar20ProdutosDosPetshopsNumRaioDe3km(decimal lat, decimal lng)
        {
            return Ok(ProdutoRepository.Listar20ProdutosDosPetshopsNumRaioDe3km(lat, lng)); 
        }

        [AllowAnonymous]
        [HttpGet("PetshopsNumRaioDe7.5Km,lat:{lat},lng:{lng}")]
        public IActionResult ListarProdutosDosPetshopsNumRaioDe7_5km(decimal lat, decimal lng)
        {
            return Ok(ProdutoRepository.ListarProdutosDePetshopsRaio7_5km(lat, lng)); 
        }
        
        [AllowAnonymous]
        [HttpGet("20PetshopsNumRaioDe7.5Km,lat:{lat},lng:{lng}")]
        public IActionResult Listar20ProdutosDosPetshopsNumRaioDe7_5km(decimal lat, decimal lng)
        {
            return Ok(ProdutoRepository.Listar20ProdutosDosPetshopsNumRaioDe7_5km(lat, lng)); 
        }
        
        [AllowAnonymous]
        [HttpGet("PetshopsNumRaioDe10Km,lat:{lat},lng:{lng}")]
        public IActionResult ListarProdutosDosPetshopsNumRaioDe10km(decimal lat, decimal lng)
        {
            return Ok(ProdutoRepository.ListarProdutosDePetshopsRaio10km(lat, lng)); 
        }
        
        [AllowAnonymous]        
        [HttpGet("20PetshopsNumRaioDe10Km,lat:{lat},lng:{lng}")]
        public IActionResult Listar20ProdutosDosPetshopsNumRaioDe10km(decimal lat, decimal lng)
        {
            return Ok(ProdutoRepository.Listar20ProdutosDosPetshopsNumRaioDe10km(lat, lng)); 
        }

        
        [AllowAnonymous] 
        [HttpGet("PetshopsNumRaioDe15Km,lat:{lat},lng:{lng}")]
        public IActionResult ListarProdutosDosPetshopsNumRaioDe15km(decimal lat, decimal lng)
        {
            return Ok(ProdutoRepository.ListarProdutosDePetshopsRaio15km(lat, lng)); 
        }
        
        [AllowAnonymous]
        [HttpGet("20PetshopsNumRaioDe15Km,lat:{lat},lng:{lng}")]
        public IActionResult Listar20ProdutosDosPetshopsNumRaioDe15km(decimal lat, decimal lng)
        {
            return Ok(ProdutoRepository.Listar20ProdutosDosPetshopsNumRaioDe15km(lat, lng)); 
        }

        [AllowAnonymous]
        [HttpGet("buscar/lat:{lat},lng:{lng},buscar:{pesquisa}")]
        public IActionResult PesquisarProduto(decimal lat, decimal lng, string pesquisa)
        {
            return Ok(ProdutoRepository.BuscarPeloNome(lat, lng, pesquisa)); 
        }
        // ------------------------------QUANTIDADE DE PRODUTOS----------------------------------------\\
        [HttpGet("count")]
        public IActionResult QuantidadeDeProdutos()
        {
            return Ok(ProdutoRepository.ListarProdutos().Count());
        }
        //----------------------LISTA DAS IMAGENS DOS PRODUTOS-----------------------------------------\\
        [Authorize]
        [HttpGet("img")]
        public IActionResult ListarImg()
        {
            return Ok(ProdutoRepository.ListarImgDoProduto());
        }
        //----------------------BUSCAR IMAGEM DE UM PRODUTO----------------------------------\\
        [Authorize]
        [HttpGet("imgproduto/{id:int}")]
        public IActionResult BuscarImg(int id)
        {
            return Ok(ProdutoRepository.ImgDoProduto(id));
        }

        // ------------------------------BUSCAR PRODUTO POR ID-----------------------------------------\\
        [Authorize]
        [HttpGet("{id:int}")]
        public IActionResult BuscarProdutoPorId(int id)
        {
            return Ok(ProdutoRepository.BuscarProdutoPorId(id));
        }
        // ------------------------------LISTA DE PRODUTOS POR PETSHOP---------------------------------\\
        [AllowAnonymous]
        [HttpGet("petshop/{id:int}")]
        public IActionResult ProdutosDoPetshop(int id)
        {
            return Ok(ProdutoRepository.ProdutosDoPetshop(id));
        }

        [Authorize(Roles="Administrador,Petshop,Diretor")]
        [HttpGet("petshop/estoque/{id:int}")]
        public IActionResult EstoqueDoPetshop(int id)
        {
            return Ok(ProdutoRepository.EstoqueDoPetshop(id));
        }
        //-------------------------------QUANTIDADE DE PRODUTOS-----------------------------------------\\
        [HttpGet("petshop/{id:int}/count")]
        public IActionResult QuantidadeDeProdutosDoPetshop(int id)
        {
            return Ok(ProdutoRepository.ProdutosDoPetshop(id).Count());
        }
        // ------------------------------CADASTRAR PRODUTOS---------------------------------------------\\
        [Authorize(Roles="Administrador,Petshop,Diretor")]
        [HttpPost]
        public IActionResult Cadastrar(Produto produto)
        {
            try
            {        
                ProdutoRepository.CadastrarProduto(produto);
                var ip = Request.Headers["ip_usuario"];
                LogRepository.PostLogPethop($"Petshop Cadastrou Novo Produto (id:{produto.Idproduto})", produto.Idpetshop , ip); 
                return Ok(produto.Idproduto);
            }
            catch (NullReferenceException ex)
            {                
                return BadRequest(new { mensagem = ex.Message});
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro ao Cadastrar." + ex.InnerException.Message});
            }
        }
        // ------------------------------CADASTRAR IMG DO PRODUTOS------------------------------------\\
        [Authorize(Roles="Administrador,Petshop,Diretor")]
        [HttpPost("img")]
        public IActionResult Cadastrar(Imgproduto img)
        {
            try
            {
                ProdutoRepository.CadastrarImg(img);
                return Ok();
            }
            catch (Exception ex)
            {
                var ip = Request.Headers["ip_usuario"];
                ProdutoRepository.DeletarProduto(img.Idproduto, ip);
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
        // ------------------------------ATUALIZAR PRODUTO----------------------------------------------\\
        [Authorize(Roles="Administrador,Petshop,Diretor")]
        [HttpPut]
        public IActionResult Atualizar(Produto produto)
        {
            try
            {
                if (produto == null)
                {
                    return NotFound();
                }
                var ip = Request.Headers["ip_usuario"];
                LogRepository.PostLogPethop($"Petshop Atualizou o Produto de I d:{produto.Idproduto}", produto.Idpetshop , ip); 
                
                ProdutoRepository.AtualizarProduto(produto);
                return Ok();
            }
            catch (NullReferenceException ex)
            {                
                return BadRequest(new { mensagem = ex.Message});
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro ao cadastrar " + ex.Message });
            }
        }
        
        // ------------------------------ATUALIZAR IMG-------------------------------------------------\\
        [Authorize(Roles="Administrador,Petshop,Diretor")]
        [HttpPut("img")]
        public IActionResult Atualizar(Imgproduto imgproduto)
        {            
            try
            {
                if (imgproduto == null)
                {
                    return NotFound();
                }
                ProdutoRepository.AtualizarImg(imgproduto);
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
                if (imgproduto.Img.Length >= 150000){
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
        // ----------------------------INDISPONIBILIZAR PRODUTO----------------------------------------------\\
        [Authorize(Roles="Administrador,Petshop,Diretor")]
        [HttpPut("disponibilidade")]
        public IActionResult IndisponibilizarProduto(Produto produto)
        {
            Console.WriteLine($"ID: {produto.Idproduto}");

            var ip = Request.Headers["ip_usuario"];                
            ProdutoRepository.ProdutoIndisponivel(produto.Idproduto, ip);
            return Ok();
        }
       
       // ------------------------------DELETAR PRODUTO------------------------------------------------\\
        [Authorize(Roles="Administrador,Petshop,Diretor")]
        [HttpDelete("excluir/{id}")]
        public IActionResult ExcluirProduto(int id)
        {
            var ip = Request.Headers["ip_usuario"];                
            ProdutoRepository.ExcluirProduto(id, ip);
            return Ok();
        }

        [Authorize(Roles="Administrador,Diretor")]
        [HttpDelete("{id}")]
        public IActionResult Deletar(int id)
        {
            var ip = Request.Headers["ip_usuario"];                
            ProdutoRepository.DeletarProduto(id, ip);
            return Ok();
        }
        
        [Authorize(Roles="Administrador,Diretor")]
        [HttpDelete("img/{id}")]
        public IActionResult DeletarImg(int id)
        {
            ProdutoRepository.DeletarImg(id);
            return Ok();
        }
        // ------------------------------LISTAR CATEGORIAS---------------------------------------------\\
        [HttpGet("categoria")]
        public IActionResult ListarCategorias()
        {
            return Ok(ProdutoRepository.ListarCategoria()); 
        }

        // ------------------------------ATUALIZAR CATEGORIAS------------------------------------------------\\
        [Authorize(Roles="Administrador,Diretor")]
        [HttpPut("categoria")]
        public IActionResult AtualizarCategoria(Categoria categoria)
        {
            try
            {
                if (categoria == null)
                {
                    return NotFound();
                }
                ProdutoRepository.AtualizarCategoria(categoria);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro ao atualizar " + ex.Message });
            }
        }
       
       // ------------------------------CADASTRAR PRODUTOS---------------------------------------------\\
        [Authorize(Roles="Administrador,Diretor")]        
        [HttpPost("categoria")]
        public IActionResult CadastrarCategoria(Categoria categoria)
        {
            try
            {
                ProdutoRepository.CadastrarCategoria(categoria);
                return Ok(categoria.idCategoria);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro ao Cadastrar. Aguarde um momento. " + ex.Message });
            }
        }

        // ------------------------------DELETAR CATEGORIAS------------------------------------------------\\
        [Authorize(Roles="Administrador,Diretor")]        
        [HttpDelete("categoria/{id}")]
        public IActionResult DeletarCategoria(int id)
        {
            ProdutoRepository.DeletarCategoria(id);
            return Ok();
        }
    }
}