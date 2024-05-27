using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public partial class Getnet
    {
        [Key]
        public int Id { get; set; }
        public string Credencial { get; set; }        
    }
}
