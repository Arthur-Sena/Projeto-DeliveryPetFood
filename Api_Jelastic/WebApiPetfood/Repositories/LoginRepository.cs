using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApiPetfood.Models;

namespace WebApiPetfood.Repositories
{
    public class LoginRepository
    {
        db_petfoodContext ctx = new db_petfoodContext();
        CodificarStringRepository CodificarRepository = new CodificarStringRepository();

// -----------------------------LOGIN DE USUARIO-------------------------------\\
        public Usuario BuscarUserPorEmailESenha(Login login)
        {
            return ctx.Usuarios.Include(x => x.IdtipousuarioNavigation).FirstOrDefault(x => x.Email == login.Email && x.Senha == CodificarRepository.Encrypt(login.Senha));
        }
// -----------------------------LOGIN DE ADM-------------------------------\\
        public Administrador BuscarAdmPorEmailESenha(Login login)
        {
            return ctx.Administradors.Include(x => x.IdtipousuarioNavigation).FirstOrDefault(x => x.Email == login.Email && x.Senha == CodificarRepository.Encrypt(login.Senha));
        }
// -----------------------------LOGIN DE MOTOBOY-------------------------------\\
        public Motoboy BuscarMotoboyPorEmailESenha(Login login)
        {
            return ctx.Motoboys.Include(x => x.IdtipousuarioNavigation).FirstOrDefault(x => x.Email == login.Email && x.Senha == CodificarRepository.Encrypt(login.Senha));
        }
// -----------------------------LOGIN DE PETSHOP-------------------------------\\
        public Petshop BuscarPetPorEmailESenha(Login login)
        {
            return ctx.Petshops.Include(x => x.IdtipousuarioNavigation).FirstOrDefault(x => x.Email == login.Email && x.Senha == CodificarRepository.Encrypt(login.Senha));
        }
    }
}
