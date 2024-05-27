using MongoDB.Bson.Serialization.Attributes;
using System.Runtime.Serialization;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public partial class Imgproduto
    {
        [Key]
        public int Idimg { get; set; }
        public int Idproduto { get; set; }
        public string Img { get; set; }

        public virtual Produto IdprodutoNavigation { get; set; }
    }
}
