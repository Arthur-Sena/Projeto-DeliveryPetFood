using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebApiPetfood.Models
{
    public class Notificacao
    {
        [Key] 
        public int idNotificacao { get; set; }
        public string Tipo { get; set; }
        public int idPetshop { get; set; }

        [Required]
        public bool Visualizado { get; set; }

        [JsonIgnore]
        public Petshop IdpetshopNavigation { get; set; }

    }
}