using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using WebApiPetfood.Models;
using WebApiPetfood.Repositories;

namespace WebApiPetfood.Controllers
{
    [ApiController]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class NotifyController : ControllerBase
    {
        MotoboyRepository MotoboyRepository = new MotoboyRepository();

        [HttpGet("{id:int}")]
        public IActionResult Notificando(int id)
        {
            return Ok(MotoboyRepository.NotificarCasoTenhaPedidosProximos(id)  );
        }
    }
}
