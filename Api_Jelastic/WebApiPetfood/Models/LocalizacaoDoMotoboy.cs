using MongoDB.Bson.Serialization.Attributes;
using System.Runtime.Serialization;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public partial class LocalizacaoMotoboy
    {
        [Key]
        public int Id { get; set; }
        public string Data { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public int idMotoboy { get; set; }
        [JsonIgnore]
        public virtual Motoboy IdmotoboyNavigation { get; set; }
    }
}
