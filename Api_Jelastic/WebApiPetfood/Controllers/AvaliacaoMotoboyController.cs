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
    public class AvaliacaoMotoboyController : ControllerBase
    {
        AvaliacaoMotoboyRepository AvaliacaoMotoboyRepository = new AvaliacaoMotoboyRepository();
        MotoboyRepository MotoboyRepository = new MotoboyRepository();

#region "Listar Avaliacao do Entregador
        [Authorize]        
        [HttpGet]
        public IActionResult Listar()
        {
            return Ok(AvaliacaoMotoboyRepository.ListarAvaliacao());
        }
#endregion

#region "Cadastrar Avaliacao do Entregador"
        [Authorize]        
        [HttpPost("{id:int}")]
        public IActionResult Cadastrar(int id)
        {
            try
            {
                AvaliacaoMotoboy avaliacao = new AvaliacaoMotoboy();
                avaliacao.idMotoboy = id;
                AvaliacaoMotoboyRepository.CadastrarAvaliacao(avaliacao);
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException.Message);
                return BadRequest(new { mensagem = "Erro ao Cadastrar. Aguarde um momento. " + ex.Message });
            }
        }
#endregion

#region "AVALIAR PETSHOP"
        [Authorize]        
        [HttpPut("{idMotoboy:int}")]
        public IActionResult AtualizarNotaDoPetshop(int idMotoboy, int Nota)
        {
            AvaliacaoMotoboy avaliacao = new AvaliacaoMotoboy();
            avaliacao.idMotoboy = idMotoboy;

            try
            {
                switch (Nota)
                {
                    case 1:
                        AvaliacaoMotoboyRepository.AtualizarAvaliacaoNota1(avaliacao);
                        return Ok();
                    case 2:
                        AvaliacaoMotoboyRepository.AtualizarAvaliacaoNota2(avaliacao);
                        return Ok();
                    case 3:
                        AvaliacaoMotoboyRepository.AtualizarAvaliacaoNota3(avaliacao);
                        return Ok();
                    case 4:
                        AvaliacaoMotoboyRepository.AtualizarAvaliacaoNota4(avaliacao);
                        return Ok();
                    case 5:
                        AvaliacaoMotoboyRepository.AtualizarAvaliacaoNota5(avaliacao);
                        return Ok();
                    default:
                        return NotFound();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro. Aguarde um momento. " + ex.Message });
            }
        }
#endregion
    }
}