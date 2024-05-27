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
    public class NotificacaoController : ControllerBase
    {
        NotificacaoRepository NotificacaoRepository = new NotificacaoRepository();

        [HttpGet("petshop/{id:int}")]
        public IActionResult ListarNotificacoesDoPetshop(int id)
        {
            return Ok(NotificacaoRepository.ListarNotificacoesDoPetshop(id));
        }

        // [HttpGet("Usuario/{id:int}")]
        // public IActionResult ListarNotificacoesDoUsuario(int id)
        // {
        //     return Ok(NotificacaoRepository.ListarNotificacoesDoUsuario(id));
        // }

        // [HttpGet("Motoboy/{id:int}")]
        // public IActionResult ListarNotificacoesDoMotoboy(int id)
        // {
        //     return Ok(NotificacaoRepository.ListarNotificacoesDoMotoboy(id));
        // }

        // -------------------------------ATUALIZAR Notificacao----------------------------------\\
        [HttpPut]
        public IActionResult Atualizar(Notificacao notificacao)
        {
            try
            {
                if (notificacao == null)
                {
                    return NotFound();
                }
                NotificacaoRepository.Atualizar_NotificacaoVisualizada(notificacao);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro. Aguarde um momento. " + ex.Message });
            }
        }

        // -------------------------------CADASTRAR Notificacao----------------------------------\\
        [HttpPost]
        public IActionResult Cadastrar(Notificacao notificacao)
        {
            try
            {
                NotificacaoRepository.CadastrarNotificacaoDoPetshop(notificacao);
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException.Message);
                return BadRequest(new { mensagem = "Erro. Aguarde um momento. " + ex.Message });
            }
        }

        // -------------------------------DELETAR NOTIFICACAO----------------------------------\\
        [HttpDelete("{id}")]
        public IActionResult Deletar(int id)
        {
            NotificacaoRepository.DeletarNotificacao(id);
            return Ok();
        }
    }
}