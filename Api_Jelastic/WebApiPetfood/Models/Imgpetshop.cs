using MongoDB.Bson.Serialization.Attributes;
using System.Runtime.Serialization;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public partial class Imgpetshop
    {
        [Key]
        public int Idimgpetshop { get; set; }
        public int Idpetshop { get; set; }
        public string Img { get; set; }

        public virtual Petshop IdpetshopNavigation { get; set; }
    }
}
