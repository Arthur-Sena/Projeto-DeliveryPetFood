using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public partial class TermosCondicoes
    {

        [Key]
        public int Id { get; set; }
        public string data { get; set; }
        public string ipDoUsuario { get; set; }
        public string navegadorDoUsuario { get; set; }
        public int idUsuario { get; set; }
        [JsonIgnore]
        public Usuario IdusuarioNavigation { get; set; }

    }
}
