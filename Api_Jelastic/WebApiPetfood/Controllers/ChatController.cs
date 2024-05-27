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
    public class ChatController : ControllerBase
    {

        ChatRepository ChatRepository = new ChatRepository();

        // -------------------------------LISTA DE MENSAGENS----------------------------------\\
        [HttpGet]
        public IActionResult Listar(int idPetshop, int idUsuario)
        {
            return Ok(ChatRepository.ListarMensagens(idPetshop, idUsuario));
        }
        
        [HttpGet("N")]
        public IActionResult ListarMensagensNãoVisualizadas(int idPetshop, int idUsuario)
        {
            return Ok(ChatRepository.ListarMensagensNãoVisualizadas(idPetshop, idUsuario));
        }
        
        [HttpGet("countC")]
        public IActionResult ListarMensagensNãoVisualizadasPeloCliente(int idPetshop, int idUsuario)
        {
            return Ok(ChatRepository.ListarMensagensNãoVisualizadasPeloCliente(idPetshop, idUsuario).Count());
        }
        
        [HttpGet("countP")]
        public IActionResult ListarMensagensNãoVisualizadasPeloPetshop(int idPetshop, int idUsuario)
        {
            return Ok(ChatRepository.ListarMensagensNãoVisualizadasPeloPetshop(idPetshop, idUsuario).Count());
        }
        
        [HttpGet("NovasMensagens")]
        public IActionResult ListaDeMensagensNaoVistasPeloPetshop(int idPetshop)
        {
            return Ok(ChatRepository.ListarQuantidadeDeMensagensNaoVistasPeloPetshop(idPetshop));
        }
        
        [HttpGet("NovasMensagens/Count")]
        public IActionResult ListarQuantidadeDeMensagensNaoVistasPeloPetshop(int idPetshop)
        {
            return Ok(ChatRepository.ListarQuantidadeDeMensagensNaoVistasPeloPetshop(idPetshop).Count());
        }
        
        [HttpGet("NCliente")]
        public IActionResult ListaDeMensagensNaoVistasPeloCliente(int idUsuario)
        {
            return Ok(ChatRepository.ListarQuantidadeDeMensagensNaoVistasPeloCliente(idUsuario));
        }
        
        [HttpGet("NCliente/Count")]
        public IActionResult ListarQuantidadeDeMensagensNaoVistasPeloCliente(int idUsuario)
        {
            return Ok(ChatRepository.ListarQuantidadeDeMensagensNaoVistasPeloCliente(idUsuario).Count());
        }
        
        // -------------------------------ENVIAR MENSAGEM--------------------------------\\
        [HttpPost]
        public IActionResult Cadastrar(Chat chat)
        {
            try
            {
                ChatRepository.EnviarMensagem(chat);
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException.Message);
                return BadRequest(new { mensagem = "Erro ao Enviar mensagem. Aguarde um momento. " + ex.Message });
            }
        }
        
        // -------------------------------ATUALIZAR CHAT------------------------------\\
        [HttpPut]
        public IActionResult Atualizar(int idPetshop, int idUsuario)
        {
            try
            {
                ChatRepository.Atualizar_MensagemVisualizada(idPetshop,idUsuario);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro. Aguarde um momento. " + ex.Message });
            }
        }
        // -------------------------------ATUALIZAR CHAT POR ID------------------------------\\
        [HttpPut("cliente/{id:int}")]
        public IActionResult AtualizarMensagemDoClientePorId(int id)
        {
            try
            {
                ChatRepository.Atualizar_MensagemDoClientePorID(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro. Aguarde um momento. " + ex.Message });
            }
        }
        [HttpPut("petshop/{id:int}")]
        public IActionResult Atualizar_MensagemDoPetshopPorID(int id)
        {
            try
            {
                ChatRepository.Atualizar_MensagemDoPetshopPorID(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro. Aguarde um momento. " + ex.Message });
            }
        }
        // -------------------------------DELETAR CHAT------------------------------\\
        [HttpDelete]
        public IActionResult Deletar(int idPetshop, int idUsuario)
        {
            ChatRepository.DeletarChat(idPetshop, idUsuario);
            return Ok();
        }
        
    }
}