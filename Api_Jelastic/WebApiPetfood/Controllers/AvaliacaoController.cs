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
    public class AvaliacaoController : ControllerBase
    {
        AvaliacaoRepository AvaliacaoRepository = new AvaliacaoRepository();
        PetshopRepository PetshopRepository = new PetshopRepository();

#region "Listar Avaliacao"
        [Authorize]        
        [HttpGet]
        public IActionResult Listar()
        {
            return Ok(AvaliacaoRepository.ListarAvaliacao());
        }
#endregion
#region "Cadastrar Avaliacao de Petshop"
        [Authorize]        
        [HttpPost("{id:int}")]
        public IActionResult Cadastrar(int id)
        {
            try
            {
                Avaliacao avaliacao = new Avaliacao();
                avaliacao.idPetshop = id;
                AvaliacaoRepository.CadastrarAvaliacao(avaliacao);
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException.Message);
                return BadRequest(new { mensagem = "Erro ao Cadastrar. Aguarde um momento. " + ex.Message });
            }
        }
#endregion
#region "Avaliar Petshop"
        [Authorize]        
        [HttpPut("{idPetshop:int}")]
        public IActionResult AtualizarNotaDoPetshop(int idPetshop, int Nota)
        {
            Avaliacao avaliacao = new Avaliacao();
            avaliacao.idPetshop = idPetshop;

            try
            {
                switch (Nota)
                {
                    case 1:
                        AvaliacaoRepository.AtualizarAvaliacaoNota1(avaliacao);
                        return Ok();
                    case 2:
                        AvaliacaoRepository.AtualizarAvaliacaoNota2(avaliacao);
                        return Ok();
                    case 3:
                        AvaliacaoRepository.AtualizarAvaliacaoNota3(avaliacao);
                        return Ok();
                    case 4:
                        AvaliacaoRepository.AtualizarAvaliacaoNota4(avaliacao);
                        return Ok();
                    case 5:
                        AvaliacaoRepository.AtualizarAvaliacaoNota5(avaliacao);
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