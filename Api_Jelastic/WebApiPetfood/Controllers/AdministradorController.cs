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
using WebApiPetfood.ViewModel;

namespace WebApiPetfood.Controllers
{

    [ApiController]
    [Produces("application/json")] 
    [Route("api/[controller]")]
    public class AdministradorController : ControllerBase
    {

    AdministradorRepository AdministradorRepository = new AdministradorRepository();

#region "Listar Adm"
        [Authorize( Roles = "Administrador, Diretor")]
        [HttpGet]
        public IActionResult Listar()
        {
            return Ok(AdministradorRepository.ListarAdm());
        }
#endregion

#region "Listar & Atualizar Credencial"  
        [Authorize( Roles = "Diretor")]
        [HttpGet("Credencial")]
        public IActionResult ListarCredencial()
        {
            return Ok(AdministradorRepository.ListarCredencial());
        }

        [Authorize( Roles = "Diretor")]
        [HttpPut("Credencial")]
        public IActionResult AtualizarCredencial(CredencialGetNet Codigo)
        {
            try
            {                
                AdministradorRepository.AtualizarCredencial(Codigo);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro ao atualizar"});
            }
        } 
#endregion

#region "Buscar Adm por Id"
        [Authorize( Roles = "Administrador, Diretor")]
        [HttpGet("{id:int}")]
        public IActionResult BuscarAdmPorId(int id)
        {
            return Ok(AdministradorRepository.BuscarAdmPorId(id));
        }
#endregion

#region "Cadastro de Adm"
        [Authorize( Roles = "Administrador, Diretor")]
        [HttpPost]
        public IActionResult Cadastrar(Administrador adm)
        {
            try
            { 
                AdministradorRepository.CadastrarAdm(adm);
                return Ok(adm.Idadministrador);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro ao Cadastrar. Aguarde um momento. " + ex.Message });
            }
        }
#endregion

#region "Atualizar ADM"
        [Authorize( Roles = "Administrador, Diretor")]
        [HttpPut]
        public IActionResult Atualizar(Administrador adm)
        {
            try
            {
                if (adm == null)
                {
                    return NotFound();
                }
                AdministradorRepository.AtualizarAdm(adm);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro. Aguarde um momento. " + ex.Message });
            }
        } 
#endregion

#region "Deletar Usuario"
        [Authorize( Roles = "Administrador, Diretor")]
        [HttpDelete("{id}")]
        public IActionResult Deletar(int id)
        {
            AdministradorRepository.DeletarAdm(id);
            return Ok();
        }     
#endregion

#region "Listar Entregadores Sem Aprovacao"
        [Authorize( Roles = "Administrador, Diretor")]
        [HttpGet("EntregadorSemAprovacao")]
        public IActionResult ListarEntregadores()
        {
            return Ok(AdministradorRepository.ListarEntregadoresSemAprovacao() );
        } 
#endregion
#region "Aprovar - Reprovar Entregador"
        [Authorize( Roles = "Administrador, Diretor")]
        [HttpGet("AprovarEntregador/{id}")]
        public IActionResult AprovarEntregador(int id)
        {
            AdministradorRepository.AprovarEntregador(id);
            return Ok();
        } 

        [Authorize( Roles = "Administrador, Diretor")]
        [HttpGet("ReprovarEntregador/{id}")]
        public IActionResult ReprovarEntregador(int id)
        {
            AdministradorRepository.ReprovarEntregador(id);
            return Ok();
        } 
#endregion
    }
}