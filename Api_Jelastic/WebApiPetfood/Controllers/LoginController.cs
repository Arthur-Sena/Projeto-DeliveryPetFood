using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApiPetfood.Models;
using WebApiPetfood.Repositories;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Cors;

namespace WebApiPetfood.Controllers
{
    [ApiController]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
#region "Repositorios"
        LoginRepository LoginRepository = new LoginRepository();
        LogsRepository LogsRepository = new LogsRepository();
        PetshopRepository PetshopRepository = new PetshopRepository();
        CodificarStringRepository CodificarRepository = new CodificarStringRepository();
#endregion
#region "Login De Usuario    - HttpPost"
        [HttpPost]
        public IActionResult Login(Login login)
        { 
            try
            {
                var ip_usuario = Request.Headers["ip_usuario"];
                               
                Usuario Usuarios = LoginRepository.BuscarUserPorEmailESenha(login);
                if (Usuarios == null)
                {
                    return NotFound(new { mensagem = "Email ou senha inválidos." });
                }

                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Email, Usuarios.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Usuarios.Idusuario.ToString()),
                    new Claim("Username", Usuarios.Nome),
                    new Claim("Permissao", Usuarios.IdtipousuarioNavigation.Tipo),
                    new Claim("TipoUser", "Cliente"),
                    new Claim(ClaimTypes.Role, Usuarios.IdtipousuarioNavigation.Tipo)
                };

                var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("PetFood-autenticacao"));

                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: "WebApiPetfood",
                    audience: "WebApiPetfood",
                    claims: claims,
                    expires: DateTime.Now.AddDays(30),
                    signingCredentials: creds);

                LogsRepository.PostLog($"Login Efetuado", Usuarios.Idusuario, ip_usuario); 

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token)
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro." + ex.InnerException.Message });
            }
        }
#endregion
#region "Login De Adm        - HttpPost"
        [EnableCors("CorsPolicy")]
        [HttpPost("adm")]
        public IActionResult LoginAdm(Login login)
        {
            try
            {
                Administrador Administradors = LoginRepository.BuscarAdmPorEmailESenha(login);
                if (Administradors == null)
                {
                    return NotFound(new { mensagem = "Email ou senha inválidos." });
                }

                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Email, Administradors.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Administradors.Idadministrador.ToString()),
                    new Claim("Username", Administradors.Nome),
                    new Claim("Permissao", Administradors.IdtipousuarioNavigation.Tipo),
                    new Claim("TipoUser", "Administrador"),
                    new Claim(ClaimTypes.Role, Administradors.IdtipousuarioNavigation.Tipo)
                };

                var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("PetFood-autenticacao"));

                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: "WebApiPetfood",
                    audience: "WebApiPetfood",
                    claims: claims,
                    expires: DateTime.Now.AddDays(30),
                    signingCredentials: creds);

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token)
                });

            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro." + ex.Message });
            }
        }
#endregion
#region "Login De Entregador - HttpPost"
        [EnableCors("CorsPolicy")]
        [HttpPost("motoboy")]
        public IActionResult LoginMotoboy(Login login)
        {
            try
            {
                Motoboy Motoboys = LoginRepository.BuscarMotoboyPorEmailESenha(login);
                if (Motoboys == null)
                {
                    return NotFound(new { mensagem = "Email ou senha inválidos." });
                }
                if (Motoboys.Aprovado == false){
                    return Ok(new { mensagem = "Usuario Aguardando Aprovação" });
                }

                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Email, Motoboys.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Motoboys.Idmotoboy.ToString()),
                    new Claim("Username", Motoboys.Nome),
                    new Claim("Permissao", Motoboys.IdtipousuarioNavigation.Tipo),
                    new Claim("TipoUser", "Motoboy"),
                    new Claim(ClaimTypes.Role, Motoboys.IdtipousuarioNavigation.Tipo)
                };

                var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("PetFood-autenticacao"));

                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: "WebApiPetfood",
                    audience: "WebApiPetfood",
                    claims: claims,
                    expires: DateTime.Now.AddDays(30),
                    signingCredentials: creds);

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token)
                });

            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro." + ex.Message });
            }
        }
#endregion
#region "Login De Petshop    - HttpPost"
        [EnableCors("CorsPolicy")]
        [HttpPost("petshop")]
        public IActionResult LoginPetshop(Login login)
        {
            try
            {
                var ip_petshop = Request.Headers["ip_usuario"];

                Petshop Petshops = LoginRepository.BuscarPetPorEmailESenha(login);
                var verificacaoDePrimeiroLogin = PetshopRepository.VerificarAceitacaoDosTermos(Petshops.Idpetshop);

                if (Petshops == null)
                {
                    return NotFound(new { mensagem = "Email ou senha inválidos." });
                }

                if (Petshops.deletado == true)
                {
                    return NotFound(new { mensagem = "Petshop Não Cadastrado" });
                }

                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Email, Petshops.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Petshops.Idpetshop.ToString()),
                    new Claim("Username", Petshops.Nome),
                    new Claim("Permissao", Petshops.IdtipousuarioNavigation.Tipo),
                    new Claim("TipoUser", "Petshop"),
                    new Claim(ClaimTypes.Role, Petshops.IdtipousuarioNavigation.Tipo)
                };

                var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("PetFood-autenticacao"));

                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: "WebApiPetfood",
                    audience: "WebApiPetfood",
                    claims: claims,
                    expires: DateTime.Now.AddDays(30),
                    signingCredentials: creds);

                if(verificacaoDePrimeiroLogin == true){

                    LogsRepository.PostLogPethop($"Login Efetuado", Petshops.Idpetshop, ip_petshop); 
                    return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
                } else {
                    return Ok(new { token = false, idPetshop = Petshops.Idpetshop});
                }

            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = "Erro." + ex.Message });
            }
        }
#endregion
    }
}