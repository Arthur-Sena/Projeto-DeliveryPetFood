using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public partial class LogisticaDoPetshop
    {
        [Key]
        public int Id { get; set; }
        public string TipoFrete { get; set; }
        [JsonIgnore]
        public virtual ICollection<Petshop> Petshops { get; set; }
    }
}