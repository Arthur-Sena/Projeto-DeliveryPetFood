using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

#nullable disable

namespace WebApiPetfood.Models
{
    public partial class CadastroUsuario
    {
        [Key]
        public int Idusuario { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public string Nome { get; set; }
        public string Telefone { get; set; }
        public string Cpf { get; set; }
        public decimal? Carteiradigital { get; set; }
        public TermosCondicoes Termos {get;set;}
    }
}
