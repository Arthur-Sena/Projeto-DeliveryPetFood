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
    public class ChatMotoboyUsuarioController : ControllerBase
    {

        ChatMotoboyUsuarioRepository ChatMotoboyUsuarioRepository = new ChatMotoboyUsuarioRepository();

#region "Listar Mensagens do Chat"
        [HttpGet]
        public IActionResult Listar(int idEntregador, int idUsuario)
        {
            return Ok(ChatMotoboyUsuarioRepository.ListarMensagens(idEntregador, idUsuario));
        }
        #endregion
#region "Listar Mensagens não visualizadas (1- todas não visualizadas, 2- não visuakizadas pelo Cliente, 3- não visualizadas pelo entregador)"
        [HttpGet("N")]
        public IActionResult ListarMensagensNãoVisualizadas(int idEntregador, int idUsuario)
        {
            return Ok(ChatMotoboyUsuarioRepository.ListarMensagensNãoVisualizadas(idEntregador, idUsuario));
        }
        #endregion
#region "Quantidade de Mensagens não Visualizadas (Pelo Entregador e Pelo Cliente)
        [HttpGet("countC")]
        public IActionResult ListarMensagensNãoVisualizadasPeloCliente(int idEntregador, int idUsuario)
        {
            return Ok(ChatMotoboyUsuarioRepository.ListarMensagensNãoVisualizadasPeloCliente(idEntregador, idUsuario).Count());
        }
        
        [HttpGet("countP")]
        public IActionResult ListarMensagensNãoVisualizadasPeloEntregador(int idEntregador, int idUsuario)
        {
            return Ok(ChatMotoboyUsuarioRepository.ListarMensagensNãoVisualizadasPeloEntregador(idEntregador, idUsuario).Count());
        }
        #endregion
#region "Quantidade de Mensagens não Visualizadas e Quantidade de Mensagens (Pelo Cliente)        
        [HttpGet("NovasMensagens")]
        public IActionResult ListaDeMensagensNaoVistasPeloEntregador(int idEntregador)
        {
            return Ok(ChatMotoboyUsuarioRepository.ListarQuantidadeDeMensagensNaoVistasPeloEntregador(idEntregador));
        }
        
        [HttpGet("NovasMensagens/Count")]
        public IActionResult ListarQuantidadeDeMensagensNaoVistasPeloEntregador(int idEntregador)
        {
            return Ok(ChatMotoboyUsuarioRepository.ListarQuantidadeDeMensagensNaoVistasPeloEntregador(idEntregador).Count());
        }
        #endregion
#region "Quantidade de Mensagens não Visualizadas e Quantidade de Mensagens (Pelo Cliente)        
        [HttpGet("NCliente")]
        public IActionResult ListaDeMensagensNaoVistasPeloCliente(int idUsuario)
        {
            return Ok(ChatMotoboyUsuarioRepository.ListarQuantidadeDeMensagensNaoVistasPeloCliente(idUsuario));
        }
        
        [HttpGet("NCliente/Count")]
        public IActionResult ListarQuantidadeDeMensagensNaoVistasPeloCliente(int idUsuario)
        {
            return Ok(ChatMotoboyUsuarioRepository.ListarQuantidadeDeMensagensNaoVistasPeloCliente(idUsuario).Count());
        }
        #endregion
#region "Enviar mensagem no chat"
        [HttpPost]
        public IActionResult Cadastrar(ChatEntregadorUsuario chat)
        {
            try
            {
                ChatMotoboyUsuarioRepository.EnviarMensagem(chat);
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException.Message);
                return BadRequest(new { mensagem = "Erro ao Enviar mensagem. Aguarde um momento. " + ex.Message });
            }
        }
        #endregion
#region "Mensagem visualizada"
        [HttpPut]
        public IActionResult Atualizar(int idEntregador, int idUsuario)
        {
            try
            {
                ChatMotoboyUsuarioRepository.Atualizar_MensagemVisualizada(idEntregador,idUsuario);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro. Aguarde um momento. " + ex.Message });
            }
        }
        #endregion
#region "Atualizar Mensagens - Cliente ou Entregador"
        [HttpPut("cliente/{id:int}")]
        public IActionResult AtualizarMensagemDoClientePorId(int id)
        {
            try
            {
                ChatMotoboyUsuarioRepository.Atualizar_MensagemDoClientePorID(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro. Aguarde um momento. " + ex.Message });
            }
        }
        [HttpPut("motoboy/{id:int}")]
        public IActionResult Atualizar_MensagemDoEntregadorPorID(int id)
        {
            try
            {
                ChatMotoboyUsuarioRepository.Atualizar_MensagemDoEntregadorPorID(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro. Aguarde um momento. " + ex.Message });
            }
        }
        #endregion
#region "Deletar Mensagens do chat entre Entregador e Usuario"
        [HttpDelete]
        public IActionResult Deletar(int idEntregador, int idUsuario)
        {
            ChatMotoboyUsuarioRepository.DeletarChat(idEntregador, idUsuario);
            return Ok();
        }
        #endregion
    }
}