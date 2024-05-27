using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public class FirebaseEntregador
    {
        [Key]
        public int id { get; set; }
        [Required]
        public int idMotoboy { get; set; }
        [Required]
        public string tokenFirebase { get; set; }
        public string hora { get; set; }
        [Required]
        public string ipEntregador { get; set; }
        [JsonIgnore]
        public Motoboy IdmotoboyNavigation { get; set; }
    }
}