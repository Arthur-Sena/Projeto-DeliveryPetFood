using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using WebApiPetfood.Models;
using WebApiPetfood.Repositories;

namespace WebApiPetfood.Controllers
{
    [ApiController]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class FirebaseController : ControllerBase
    {
        FirebaseRepository FirebaseRepository = new FirebaseRepository();

        [HttpPost]
        public IActionResult PostFirebaseEntregador(FirebaseEntregador f)
        {
            try {
                FirebaseRepository.PostTokenEntregador(f);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.InnerException.Message.Contains("23505: duplicate key")){
                    string[] campoDuplicado = ex.InnerException.Message.Split("_");
                    return BadRequest(new { mensagem = $"{campoDuplicado[1]} já cadastrado para outro usuario!"});
                }
                if (ex.InnerException.Message.Contains("22001: value too long")){
                    return BadRequest(new { mensagem = "Erro ao Cadastrar, campo preenchido com valor muito grande." });
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

        [HttpGet("LocalizacaoComToken")]
        public IActionResult EntregadoresASeremNotificados()
        {
            return Ok(FirebaseRepository.UltimaLocalizacaoComToken());
        }
        [HttpGet("localizar")]
        public IActionResult NotificarEntregadores()
        {
            FirebaseRepository.NotificarEntregadoresProximos(Convert.ToDecimal(-23.6211114), Convert.ToDecimal(-46.6269772) );
            return Ok("Notificados");
        }
    }
}
