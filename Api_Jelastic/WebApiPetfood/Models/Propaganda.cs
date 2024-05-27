using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebApiPetfood.Models
{
    public partial class Propaganda
    {
        [Key]
        public int idPropaganda { get; set; }
        public string Imagem { get; set; }
        public string Titulo { get; set; }
        public string urlRedirecionamento { get; set; }
        public string Descricao { get; set; }
        public bool Ativa { get; set; }
    }
}
