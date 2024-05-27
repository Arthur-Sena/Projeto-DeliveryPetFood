using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


#nullable disable

namespace WebApiPetfood.Models
{
    public partial class Administrador
    {
        [Key]
        public int Idadministrador { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public string Nome { get; set; }
        public int Idtipousuario { get; set; }

        public virtual Tipousuario IdtipousuarioNavigation { get; set; }
    }
}
