using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using WebApiPetfood.Repositories;

namespace WebApiPetfood.Controllers
{
    [ApiController]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class LocalizacaoController : ControllerBase
    {
        PetshopRepository PetshopRepository = new PetshopRepository();
        string key = "AIzaSyAYbmt_9tZAxJYQ-kBoLb3-nLaUpVY-IuQ";

        [HttpGet]
        public IActionResult Localizador(int numero, string endereco, string bairro, string cidade, string estado, string cep)
        {
            string sURL = ("https://maps.googleapis.com/maps/api/geocode/json?address=" + endereco + ",%20" + numero + "%20-%20" + bairro + ",%20" + cidade + "%20-%20" + estado + ",%20" + cep + ",%20Brazil&key=" + key ).Replace(" ", "%2B");

            WebRequest wrGETURL = WebRequest.Create(sURL);
            Stream objStream;
            objStream = wrGETURL.GetResponse().GetResponseStream();

            return Ok(objStream);
        }

        [HttpGet("Reverse")]
        public IActionResult LocalizarCoordenada(string lat, string lng)
        {
            string sURL = ("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng +"&result_type=street_address&key=" + key );

            WebRequest wrGETURL = WebRequest.Create(sURL);
            Stream objStream;
            objStream = wrGETURL.GetResponse().GetResponseStream();

            return Ok(objStream);
        }
    }
}
