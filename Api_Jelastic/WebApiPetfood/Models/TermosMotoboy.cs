using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public partial class TermosMotoboy
    {
        [Key]
        public int Id { get; set; }
        public string data { get; set; }
        public string ipDoMotoboy { get; set; }
        public string navegadorDoMotoboy { get; set; }
        public int idMotoboy { get; set; }
        [JsonIgnore]
        public Motoboy IdmotoboyNavigation { get; set; }
    }
}
