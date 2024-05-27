using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public partial class Avaliacao
    {
        [Key] 
        public int idAvaliacao { get; set; }
        public int nota1 { get; set; }
        public int nota2 { get; set; }
        public int nota3 { get; set; }
        public int nota4 { get; set; }
        public int nota5 { get; set; }
        public int idPetshop { get; set; }
        [JsonIgnore]
        public Petshop IdpetshopNavigation { get; set; }
    }
}