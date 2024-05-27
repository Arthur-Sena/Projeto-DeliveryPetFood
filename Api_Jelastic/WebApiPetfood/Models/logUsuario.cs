using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public partial class LogUsuario
    {
        [Key]
        public int idLog { get; set; }
        public string descricao { get; set; }
        public string ipUsuario { get; set; }
        public string data { get; set; }
        public int idUsuario { get; set; }

        [JsonIgnore]
        public virtual Usuario IdusuarioNavigation { get; set; }
        

    }
}