using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public partial class LogMotoboy
    {
        [Key]
        public int idLog { get; set; }
        public string descricao { get; set; }
        public string ipMotoboy { get; set; }
        public string data { get; set; }
        public int idMotoboy { get; set; }

        [JsonIgnore]
        public virtual Motoboy IdmotoboyNavigation { get; set; }
    }
}