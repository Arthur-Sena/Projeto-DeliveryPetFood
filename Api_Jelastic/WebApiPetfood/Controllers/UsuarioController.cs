using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiPetfood.Models;
using WebApiPetfood.Repositories;

namespace WebApiPetfood.Controllers
{
    [ApiController]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        UsuarioRepository UsuarioRepository = new UsuarioRepository();
        LogsRepository LogsRepository = new LogsRepository();
        EmailRepository EmailRepository = new EmailRepository();
        CodificarStringRepository CodificarRepository = new CodificarStringRepository();

        // -------------------------------LISTA DE USUARIOS----------------------------------\\
        [Authorize( Roles = "Administrador,Diretor")]
        [HttpGet]
        public IActionResult Listar()
        {
            return Ok(UsuarioRepository.ListarUsuario());
        }

        [Authorize( Roles = "Administrador,Diretor")]
        [HttpGet("Count")]
        public IActionResult ListarQnt()
        {
            return Ok(UsuarioRepository.ListarUsuario().Count());
        }

        [Authorize( Roles = "Administrador,Diretor,Petshop")]
        [HttpGet("CPF")]
        public IActionResult BuscarUsuarioPeloCpf(string cpf)
        {
            return Ok(UsuarioRepository.BuscarUsuarioPeloCpf(cpf));
        }

        // -------------------------------CADASTRO DE USUARIO--------------------------------\\
        [HttpPost]
        public IActionResult Cadastrar(CadastroUsuario user)
        {
            try
            {   
                var ip_usuario = Request.Headers["ip_usuario"];

                Usuario usuario = new Usuario();
                usuario.Email = user.Email;
                usuario.Senha = CodificarRepository.Encrypt(user.Senha);
                usuario.Nome = user.Nome;
                usuario.Telefone = user.Telefone;
                usuario.Cpf = user.Cpf;
                usuario.Carteiradigital = 0;
                UsuarioRepository.CadastrarUsuario(usuario);
                // usuario.Cpf = CodificarRepository.Encrypt(user.Cpf);

                LogsRepository.PostLog("Cadastro Usuario", usuario.Idusuario, ip_usuario); 

                TermosCondicoes termos = new TermosCondicoes();
                termos.data = user.Termos.data;
                termos.ipDoUsuario = user.Termos.ipDoUsuario;
                termos.navegadorDoUsuario = user.Termos.navegadorDoUsuario;
                termos.idUsuario = usuario.Idusuario;
                UsuarioRepository.TermosDeUsoUsuario(termos);

                return Ok(usuario.Idusuario);
            }
            catch (Exception ex)
            {
                if (ex.InnerException.Message.Contains("23505: duplicate key")){
                    string[] campoDuplicado = ex.InnerException.Message.Split("_");
                    return BadRequest($"{campoDuplicado[1]} já cadastrado para outro usuario!");
                }
                if (ex.InnerException.Message.Contains("22001: value too long")){
                    return BadRequest("Erro ao Cadastrar, campo preenchido com valor muito grande.");
                }
                if (ex.InnerException.Message.Contains("23502: null value in column")){
                    string[] campoNulo = ex.InnerException.Message.Split(" ");
                    return BadRequest($"Erro ao Cadastrar, {campoNulo[5]} esta vazio." );
                } 
                else{ 
                    return BadRequest("Erro ao Cadastrar.");
                }
            }
        }

        // -------------------------------BUSCAR USUARIO POR ID------------------------------\\
        [Authorize]
        [HttpGet("{id:int}")]
        public IActionResult BuscarUsuarioPorId(int id)
        { 
            return Ok(UsuarioRepository.ListarUsuarioPorId(id));
        }

        // -------------------------------ATUALIZAR USUARIO----------------------------------\\
        [Authorize]
        [HttpPut]
        public IActionResult Atualizar(Usuario usuario, string senhaantiga, string novasenha)
        {
            try
            {
                var ip_usuario = Request.Headers["ip_usuario"];

                if (usuario == null)
                {
                    return NotFound();
                }
                UsuarioRepository.AtualizarUsuario(usuario, senhaantiga, novasenha);
                LogsRepository.PostLog("Usuario Atualizou Informações de Perfil", usuario.Idusuario, ip_usuario); 

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new {
                    mensagem = "Erro. Aguarde um momento. " + ex.InnerException.Message
                });
            }
        }

        // -------------------------------DELETAR USUARIO------------------------------\\
        [Authorize( Roles = "Administrador,Diretor")]
        [HttpDelete("{id}")]
        public IActionResult Deletar(int id)
        {
            UsuarioRepository.DeletarUsuario (id);
            return Ok();
        }

        // -------------------------------RECUPERAR SENHA DO USUARIO------------------------------\\
        [HttpPut("RecuperarSenha/cpf:{cpf},email:{email}")]
        public IActionResult RecuperarSenhaParte2(string cpf, string email)
        {
            var ip_usuario = Request.Headers["ip_usuario"];
            string emailRetornado = UsuarioRepository.RecuperarSenha(cpf);
            if (emailRetornado == email)
            {
                string NovaSenha = UsuarioRepository.RecuperarSenhaParte2(emailRetornado, cpf, ip_usuario);
                EmailRepository.EnviarEmailComNovaSenha (email, NovaSenha);
                return Ok("Uma nova senha foi enviada para o seu email");
            } else {
                return Ok("O email inserido não é valido para esse CPF");
            }
        }
    }
}
