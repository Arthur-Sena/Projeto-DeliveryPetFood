using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public partial class LogPetshop
    {
        [Key]
        public int idLog { get; set; }
        public string descricao { get; set; }
        public string ipPetshop { get; set; }
        public string data { get; set; }
        public int idPetshop { get; set; }

        [JsonIgnore]
        public virtual Petshop IdpetshopNavigation { get; set; }
        

    }
}