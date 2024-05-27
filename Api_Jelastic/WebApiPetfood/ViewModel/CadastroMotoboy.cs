using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;


#nullable disable

namespace WebApiPetfood.Models
{
    public partial class CadastroMotoboy
    {
        [Key]
        public int Idmotoboy { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public string Nome { get; set; }
        public int Idtipousuario { get; set; }
        public decimal? Avaliacao { get; set; }
        public string Telefone { get; set; }
        public string Cpf { get; set; }
        public decimal? Carteiradigital { get; set; }
        public ImgMotoboy Foto {get;set;}
        public TermosMotoboy Termos {get;set;}

    }
}
