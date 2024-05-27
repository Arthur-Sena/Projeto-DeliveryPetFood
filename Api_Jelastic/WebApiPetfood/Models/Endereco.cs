using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public class Endereco
    {
        [Key]
        public int Idendereco { get; set; }
        [Required]
        public string enderecoRua { get; set; }
        [Required]
        public string Bairro { get; set; }
        [Required]
        public string Cep { get; set; }
        [Required]
        public string Cidade { get; set; }
        [Required]
        public string Estado { get; set; }
        public string Complemento { get; set; }
        [Required]
        public string numero { get; set; }
        public string latitude { get; set; }
        public string longitude { get; set; }
        [Required]
        public int Idusuario { get; set; }
        
        [JsonIgnore]
        public Usuario IdusuarioNavigation { get; set; }
        [JsonIgnore]
        public virtual ICollection<InfoPedido> InfoPedidos { get; set; }
    }
}
