using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebApiPetfood.Models
{
    public partial class FreteGratis
    {
        [Key]
        public int id { get; set; }
        public float Preco { get; set; }
    }
}
