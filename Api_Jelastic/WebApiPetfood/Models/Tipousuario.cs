using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

#nullable disable

namespace WebApiPetfood.Models
{
    public partial class Tipousuario
    {
        public Tipousuario()
        {
            Administradors = new HashSet<Administrador>();
            Motoboys = new HashSet<Motoboy>();
            Petshops = new HashSet<Petshop>();
            Usuarios = new HashSet<Usuario>();
        }

        [Key]
        public int Idtipousuario { get; set; }
        public string Tipo { get; set; }

        public virtual ICollection<Administrador> Administradors { get; set; }
        public virtual ICollection<Motoboy> Motoboys { get; set; }
        public virtual ICollection<Petshop> Petshops { get; set; }
        public virtual ICollection<Usuario> Usuarios { get; set; }
        public virtual ICollection<Chat> Chats { get; set; }
        public virtual ICollection<ChatEntregadorUsuario> ChatEntregadorUsuarios { get; set; }
    }
}