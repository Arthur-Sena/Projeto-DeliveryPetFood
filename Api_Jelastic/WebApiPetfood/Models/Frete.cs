using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebApiPetfood.Models
{
    public partial class Frete
    {
        [Key]
        public int idFrete { get; set; }
        public double Distancia { get; set; }
        public float Preco { get; set; }
    }
}
