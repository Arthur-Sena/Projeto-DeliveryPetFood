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
    public class EnderecoController : ControllerBase
    {
        EnderecoRepository EnderecoRepository = new EnderecoRepository();
        LogsRepository LogsRepository = new LogsRepository();

// ------------------------------LISTA DE ENDERECOS---------------------------------------------\\
        [Authorize(Roles="Administrador,Diretor")]
        [HttpGet]
        public IActionResult Listar()
        {
            return Ok(EnderecoRepository.ListarEndereco()); 
        }
// ------------------------------BUSCAR ENDECOS PELO ID DO USUARIO-----------------------------------------\\       
        [Authorize]
        [HttpGet("Usuario/{id:int}")]
        public IActionResult EnderecosDoUsuario(int id)
        {
            return Ok(EnderecoRepository.EnderecosDoUsuario(id));
        }
// ------------------------------BUSCAR ENDECO POR ID-----------------------------------------------------\\       
        [Authorize]
        [HttpGet("{id:int}")]
        public IActionResult BuscarEnderecoPorId(int id)
        {           
            return Ok(EnderecoRepository.BuscarEnderecoPorId(id));
        }
// ------------------------------CADASTRAR ENDERECO---------------------------------------------\\
        [HttpPost]
        public IActionResult Cadastrar(Endereco endereco)
        {
            var ip_usuario = Request.Headers["ip_usuario"];
            try
            {
                EnderecoRepository.CadastrarEndereco(endereco);
                LogsRepository.PostLog($"Endereço (ID: {endereco.Idendereco}) Cadastrado Pelo Usuario", endereco.Idusuario , ip_usuario); 

                return Ok(endereco.Idendereco);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro ao Cadastrar. Aguarde um momento. " + ex.Message });
            }
        }

// ------------------------------ATUALIZAR ENDERECO----------------------------------------------\\
        [Authorize(Roles="Administrador,Cliente,Diretor")]
        [HttpPut]
        public IActionResult Atualizar(Endereco endereco)
        {
            var ip_usuario = Request.Headers["ip_usuario"];
            try
            {
                if (endereco == null)
                {
                    return NotFound();
                }
                EnderecoRepository.AtualizarEndereco(endereco, ip_usuario);                
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro ao cadastrar " + ex.Message });
            }
        } 
// ------------------------------DELETAR ENDERECO------------------------------------------------\\
        [Authorize(Roles="Administrador,Cliente,Diretor")]
        [HttpDelete("{id}")]
        public IActionResult Deletar(int id)
        {
            EnderecoRepository.DeletarEndereco(id);
            return Ok();
        }
    }
}