using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public partial class CadastroPetshop
    {
        public int idPetshop { get; set; }
        public string? Email { get; set; }
        public string? Senha { get; set; }
        public string Nome { get; set; }
        public string Telefone { get; set; }
        public decimal Avaliacao { get; set; }
        public string Endereco { get; set; }
        public string Cep { get; set; }
        public string Cidade { get; set; }
        public string Estado { get; set; }
        public string Longitude { get; set; }
        public string Latitude { get; set; }
        public string Horaabertura { get; set; }
        public string Horafechamento { get; set; }
        public int Idtipousuario { get; set; }
        public bool? Status { get; set; }
        public int Logistica { get; set; }

        public bool RetirarNaLoja { get; set; }
        [JsonIgnore]
        public decimal? Carteiradigital { get; set; } 
        public virtual Tipousuario IdtipousuarioNavigation { get; set; }
    }
}