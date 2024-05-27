using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public partial class AvaliacaoMotoboy
    {
        [Key] 
        public int idAvaliacao { get; set; }
        public int nota1 { get; set; }
        public int nota2 { get; set; }
        public int nota3 { get; set; }
        public int nota4 { get; set; }
        public int nota5 { get; set; }
        public int idMotoboy { get; set; }
        [JsonIgnore]
        public Motoboy IdmotoboyNavigation { get; set; }
    }
}