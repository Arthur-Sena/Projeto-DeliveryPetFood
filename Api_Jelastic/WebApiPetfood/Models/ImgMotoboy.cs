using MongoDB.Bson.Serialization.Attributes;
using System.Runtime.Serialization;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public partial class ImgMotoboy
    {
        [Key]
        public int Id { get; set; }
        public int idMotoboy { get; set; }
        public string Img { get; set; }

        public virtual Motoboy IdmotoboyNavigation { get; set; }
    }
}
