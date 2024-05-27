using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public partial class TermosPetshop
    {
        [Key]
        public int Id { get; set; }
        public string data { get; set; }
        public string ipDoPetshop { get; set; }
        public string navegadorDoPetshop { get; set; }
        public int idPetshop { get; set; }
        [JsonIgnore]
        public Petshop IdpetshopNavigation { get; set; }
    }
}
