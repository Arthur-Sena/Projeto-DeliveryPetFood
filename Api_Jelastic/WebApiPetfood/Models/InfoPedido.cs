using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public partial class InfoPedido
    {
        [Key]
        public int idPedido { get; set; }

        public string codigoDePedido {get;set;}
        public string dataDoPedido {get;set;}
        public string Status {get;set;}
        public float Distancia {get;set;}
        public int idPetshop { get; set; } 
        public int idUsuario { get; set; }
        public int idEndereco { get; set; }
        public decimal PrecoFrete { get; set; }
        public decimal PrecoProduto { get; set; }
        public decimal PrecoTotal { get; set; }
        public int idEntregador { get; set; }
        public string Pagamento { get; set; }

        [JsonIgnore]
        public Endereco IdenderecoNavigation { get; set; }
        [JsonIgnore]
        public Petshop IdpetshopNavigation { get; set; }
        [JsonIgnore]
        public Usuario IdusuarioNavigation { get; set; }
        // [JsonIgnore]
        // public Motoboy IdmotoboyNavigation { get; set; }
    }
}
