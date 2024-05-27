using MongoDB.Bson.Serialization.Attributes;
using System.Runtime.Serialization;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using WebApiPetfood.ViewModel;

namespace WebApiPetfood.Models
{
    public class listProdutos{
        public int IdProduto{get;set;}
        public int quantidade{get;set;}
        public decimal preco{get;set;}
    }
    public class Origem{
        public string Endereco {get;set;}
        public string Petshop {get;set;}
        public decimal Latitude {get;set;}
        public decimal Longitude {get;set;}
    }
    public class Destino{
        public string Endereco {get;set;}
        public string Complemento {get;set;}
        public decimal Latitude {get;set;}
        public decimal Longitude {get;set;}
    }
    public class CaminhoDaEntrega {
        public Origem From {get;set;}
        public Destino To {get;set;}
    }
    public class horaDeEntrega_Retirada {
        public string HorarioDoPedido {get;set;}
        public string HorarioEmQueFoiAceito {get;set;}
        public string HorarioEmQueFoiAceitoPeloEntregador {get;set;}
        public string HorarioDaRetirada {get;set;}
        public string HorarioDaEntrega {get;set;}
    }
    public class Pagamento{
        public string Tipo {get;set;}
        public string Status {get;set;}
        public string Data {get;set;}
        public string payment_id {get;set;}
        public object informacoes {get;set;}

    }
    
    public class Device {
        public string ip_address {get;set;}
        public string device_id {get;set;}
    }
    
    public class Cliente {
        public string nome {get;set;}
        public string telefone {get;set;}
        public string email {get;set;}
    }
    public class Pedido
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }
        public List<listProdutos> listaProdutos {get;set;}
        public Cliente cliente {get;set;}
        public CaminhoDaEntrega CaminhoDaEntrega {get;set;}
        public horaDeEntrega_Retirada horaDeEntrega_Retirada {get;set;}
        public Pagamento pagamento {get;set;}
        public Device device {get;set;}
        public string dataPedido { get; set; }
        public string status { get; set; }
        public int idPetshop { get; set; }
        public int idUsuario { get; set; }
        public int idEndereco { get; set;}
        public int IdMotoboy { get; set;}
        public int idLogistica {get;set;}
        public decimal Distancia { get; set;}
        public decimal Frete { get; set; }
        public decimal PrecoDoProduto { get; set; }
        public decimal preco { get; set; }
        public bool RetirarNaLoja { get; set; }

        [JsonIgnore]
        public Produto IdprodutoNavigation { get; set; }
        [JsonIgnore]
        public Endereco IdenderecoNavigation { get; set; }
        [JsonIgnore]
        public Petshop IdpetshopNavigation { get; set; }
        [JsonIgnore]
        public Usuario IdusuarioNavigation { get; set; }
    }
}