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
    public class PropagandaController : ControllerBase
    {
        PropagandaRepository PropagandaRepository = new PropagandaRepository();

        [Authorize(Roles="Administrador,Diretor")]
        [HttpGet]
        public IActionResult ListarPropagandas_Promocoes()
        {
            return Ok(PropagandaRepository.ListarPropagandas_Promocoes());
        }
       
        [HttpGet("count")]
        public IActionResult ListarQuantidadeDePropagandas_Promocoes()
        {
            return Ok(PropagandaRepository.ListarPropagandas_Promocoes().Count());
        }

        [Authorize]
        [HttpGet("ativas")]
        public IActionResult ListarPropagandas_PromocoesAtivas()
        {
            int qntPropagandasAtivas = PropagandaRepository.ListarPropagandas_PromocoesAtivas().Count();
            if (qntPropagandasAtivas != 0)
            {
                return Ok(PropagandaRepository.ListarPropagandas_PromocoesAtivas());
            }
            else
            {
                return Ok();
            }
        }

        [HttpGet("countA")]
        public IActionResult ListarQuantidadeDePropagandas_PromocoesAtivas()
        {
            return Ok(PropagandaRepository.ListarPropagandas_PromocoesAtivas().Count());
        }

        [Authorize(Roles="Administrador,Diretor")]
        [HttpPost]
        public IActionResult Cadastrar(Propaganda propaganda)
        {
            try
            {
                PropagandaRepository.CadastrarPropaganda(propaganda);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro ao Cadastrar. Aguarde um momento. " + ex.Message });
            }
        }

        [Authorize(Roles="Administrador,Diretor")]
        [HttpPut]
        public IActionResult AtualizarStatusDaPropaganda(Propaganda p)
        {
            try
            {
                PropagandaRepository.AtualizarStatusDaPropaganda(p.idPropaganda);
                return Ok();
            }
            catch (Exception ex)
            {                
                System.Console.WriteLine(ex.Message);
                return BadRequest(new { mensagem = "Erro ao Cadastrar. Aguarde um momento. " + ex.Message });
            }
        }

        [Authorize(Roles="Administrador,Diretor")]
        [HttpDelete]
        public IActionResult DeletarPropaganda(int idPropaganda)
        {
            PropagandaRepository.DeletarPropaganda(idPropaganda);
            return Ok();
        }

    }
}