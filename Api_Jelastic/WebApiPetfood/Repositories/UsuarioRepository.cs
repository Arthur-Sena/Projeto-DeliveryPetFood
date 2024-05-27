using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApiPetfood.Models;

namespace WebApiPetfood.Repositories
{
    public class UsuarioRepository
    {
        db_petfoodContext ctx = new db_petfoodContext();
        LogsRepository LogsRepository = new LogsRepository();
        CodificarStringRepository CodificarRepository = new CodificarStringRepository();
        
        public List<Usuario> ListarUsuario()
        {
            return ctx.Usuarios.ToList();
        }

        public List<Usuario> ListarUsuarioPorId(int id)
        {
            var usuario = ctx.Usuarios
            .Where(x => x.Idusuario == id)
            .ToList();
            return usuario;
        }

        public Usuario BuscarUsuarioPeloCpf(string cpf)
        {
            return ctx.Usuarios.FirstOrDefault(x => x.Cpf == cpf);
        }

        public void CadastrarUsuario(Usuario usuario)
        {
            usuario.Idtipousuario = 2;
            ctx.Usuarios.Add(usuario);
            ctx.SaveChanges();
        } 

        public void TermosDeUsoUsuario(TermosCondicoes t){
            ctx.Termos.Add(t);
            ctx.SaveChanges();
        }

        public void AtualizarUsuario(Usuario usuario, string SenhaAntiga, string NovaSenha)
        {
            Usuario UsuarioBuscado = ctx.Usuarios.FirstOrDefault(x => x.Idusuario == usuario.Idusuario);
            if (SenhaAntiga == CodificarRepository.Decrypt(UsuarioBuscado.Senha) )
            {
                UsuarioBuscado.Email = usuario.Email;
                UsuarioBuscado.Senha = CodificarRepository.Encrypt(NovaSenha);
                UsuarioBuscado.Nome = usuario.Nome;
                UsuarioBuscado.Telefone = usuario.Telefone;
                UsuarioBuscado.Cpf = usuario.Cpf;
                ctx.Update (UsuarioBuscado);
                ctx.SaveChanges();
            }
        }

        public void DeletarUsuario(int id)
        {
            var quantidade =
                ctx.Enderecos.Where(x => x.Idusuario == id).ToList().Count();
            if (quantidade != 0)
            {
                for (int i = 0; i < quantidade; i = i + 1)
                {
                    Endereco endereco = ctx.Enderecos.Where(x => x.Idusuario == id).FirstOrDefault();
                    ctx.Enderecos.Remove (endereco);
                }
            }

            Usuario usuario = ctx.Usuarios.Find(id);
            ctx.Usuarios.Remove (usuario);
            ctx.SaveChanges();
        }

        public string RecuperarSenha(string cpf)
        {
            var usuario = ctx.Usuarios.Where(x => x.Cpf == cpf).FirstOrDefault();
            return usuario.Email;
        }

        public string RecuperarSenhaParte2(string email, string cpf, string ip)
        {
            string[] matrizCaracteres =
            {
                "a",
                "b",
                "c",
                "d",
                "e",
                "f",
                "g",
                "h",
                "i",
                "j",
                "k",
                "l",
                "m",
                "n",
                "o",
                "p",
                "q",
                "r",
                "s",
                "t",
                "u",
                "v",
                "w",
                "x",
                "y",
                "z",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "0"
            };
            
            Random r = new Random();

            string SenhaGerada = "";
            for (int i = 0; i <= 9; i++)
            {
                SenhaGerada =
                    SenhaGerada +
                    matrizCaracteres[r.Next(matrizCaracteres.GetLength(0))];
            }


            Usuario UsuarioBuscado = ctx.Usuarios.FirstOrDefault(x => x.Email == email && x.Cpf == cpf);
            LogsRepository.PostLog("Usuario Recuperou a Senha", UsuarioBuscado.Idusuario, ip); 
            UsuarioBuscado.Senha = CodificarRepository.Encrypt(SenhaGerada); 
            ctx.Update (UsuarioBuscado);
            ctx.SaveChanges();

            return SenhaGerada;
        }
    }
}
