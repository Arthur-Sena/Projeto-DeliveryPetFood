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
    public class DashboardController : ControllerBase
    {
        DashboardRepository DashboardRepository = new DashboardRepository();
        PedidoRepository PedidoRepository = new PedidoRepository();

        [Authorize(Roles="Administrador, Diretor")]
        [HttpGet]
        public IActionResult InformacoesDosPedidos()
        {
            return Ok(DashboardRepository.InformacoesDosPedidos());
        }
        
        [Authorize]        
        [HttpGet("freteGratis")]
        public IActionResult APartirDessePrecoOFreteEGratuito()
        {
            return Ok(DashboardRepository.APartirDessePrecoOFreteEGratuito());
        }
        
        [Authorize(Roles="Administrador, Diretor")]
        [HttpPut("freteGratis")]
        public IActionResult AtualizarFreteGratis(float preco)
        {
            DashboardRepository.APartirDesseNovoPrecoOFreteEGratuito(preco);
            return Ok();
        }

        [Authorize]        
        [HttpGet("frete")]
        public IActionResult InformacoesDoFrete()
        {
            return Ok(DashboardRepository.listarFrete());
        }

        [Authorize]        
        [HttpGet("logistica")]
        public IActionResult TiposDeEntregaPossiveis()
        {
            return Ok(DashboardRepository.TiposDeEntregaPossiveis());
        }

        [Authorize(Roles="Administrador, Diretor")]
        [HttpPost("frete")]
        public IActionResult Cadastrar(Frete frete)
        {
            try
            {
                DashboardRepository.CadastrarFrete(frete);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro ao Cadastrar. Aguarde um momento. " + ex.Message });
            }
        }

        [Authorize(Roles="Administrador, Diretor")]
        [HttpPut("frete")]
        public IActionResult Atualizar(Frete frete)
        {
            try
            {
                if (frete == null)
                {
                    return NotFound();
                }
                DashboardRepository.AtualizarFrete(frete);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro ao cadastrar " + ex.Message });
            }
        } 
   
        [Authorize(Roles="Administrador, Diretor")]
        [HttpDelete("frete/{id}")]
        public IActionResult Deletar(int id)
        {
            DashboardRepository.DeletarFrete(id);
            return Ok();
        }

        [Authorize(Roles="Administrador, Diretor")]
        [HttpGet("Valores")]
        public IActionResult CalcularFaturamento()
        {
            return Ok(DashboardRepository.RetornarValores());
        }
        
        [Authorize(Roles="Administrador, Diretor")]
        [HttpGet("FaturamentoDoPetFood")]
        public IActionResult FaturamentoDetalhadoDoPetFood()
        {
            return Ok(DashboardRepository.FaturamentoDetalhadoPetfood());
        }

        [Authorize(Roles="Administrador, Diretor")]
        [HttpGet("FaturamentoMensalDoPetFood")]
        public IActionResult FaturamentoMensalDoPetFood(string year, int idPetshop) 
        {
            if(year == "" || year == null){
                year = DateTime.Now.Year.ToString();
            }
            return Ok(DashboardRepository.FaturamentoMensalPetfood(year, idPetshop));
        }

        [Authorize(Roles="Administrador,Diretor")]
        [HttpGet("FaturamentoDoPetshop")]
        public IActionResult FaturamentoDetalhadoDoPetshop(int idPetshop)
        {
            return Ok(DashboardRepository.FaturamentoDetalhadoDoPetshop(idPetshop));
        }

        [Authorize(Roles="Administrador,Diretor")]  
        [HttpGet("Faturamento")]
        public IActionResult CalcularFaturamentoTotal()
        {
            return Ok(DashboardRepository.CalcularFaturamentoTotal());
        } 

        [Authorize(Roles="Administrador,Diretor")]
        [HttpGet("LucroPetFood")]
        public IActionResult FaturamentoPetFood()
        {
            return Ok(DashboardRepository.FaturamentoPetFood());
        }

        [Authorize(Roles="Administrador,Petshop,Diretor")]
        [HttpGet("LucroPetshop")]
        public IActionResult LucroPetshop(int idPetshop)
        {
            return Ok(DashboardRepository.FaturamentoDoPetshop(idPetshop));
        }

        [Authorize(Roles="Administrador,Motoboy,Diretor")]
        [HttpGet("FaturamentoMotoboy")]
        public IActionResult LucroMotoboy(int idMotoboy)
        {
            return Ok(DashboardRepository.FaturamentoDoMotoboy(idMotoboy));
        }
    
        [HttpGet("FaturamentoQuinzenal")]
        public IActionResult FaturamentoQuinzenalPetfood(int mes ,int year ,int idPetshop)
        {
            if(idPetshop != 0){
                return Ok(DashboardRepository.FaturamentoQuinzenalDoPetshop(mes, year, idPetshop));
            } else {
                return Ok(DashboardRepository.FaturamentoQuinzenalPetfood(mes, year));
            }
        }

        [HttpGet("ListarPedidosDoMes")]
        public IActionResult PedidosDoMesPetfood(string  mes, string year, int idPetshop)
        {
            return Ok(PedidoRepository.ListarPedidosDoMes(mes, year, idPetshop));
        }
    }
}