using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebApiPetfood.Models
{
    public class Login
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Senha { get; set; }
    }
}