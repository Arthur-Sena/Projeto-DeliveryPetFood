using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public partial class Petshop
    {
        [Key]
        public int Idpetshop { get; set; }
        [JsonIgnore]
        public string Email { get; set; }
        [JsonIgnore]
        public string Senha { get; set; }
        public string Nome { get; set; }
        public string Telefone { get; set; }
        public decimal Avaliacao { get; set; }
        public string Endereco { get; set; }
        public string Cep { get; set; }
        public string Cidade { get; set; }
        public string Estado { get; set; }
        public string Longitude { get; set; }
        public string Latitude { get; set; }
        public string Horaabertura { get; set; }
        public string Horafechamento { get; set; }
        public int Idtipousuario { get; set; }
        public bool? Status { get; set; }
        [JsonIgnore]
        public bool deletado {get;set;}
        [JsonIgnore]
        public decimal? Carteiradigital { get; set; }
        public int Logistica { get; set; } 
        public bool RetirarNaLoja { get; set; }

        [JsonIgnore]
        public virtual Tipousuario IdtipousuarioNavigation { get; set; }
        [JsonIgnore]
        public virtual ICollection<Notificacao> Notificacaos { get; set; }

        [JsonIgnore]
        public virtual ICollection<Produto> Produtos { get; set; }
        public virtual ICollection<Imgpetshop> Imgpetshops { get; set; }
        [JsonIgnore]
        public virtual ICollection<Chat> Chats { get; set; }
        [JsonIgnore]
        public virtual ICollection<InfoPedido> InfoPedidos { get; set; }
        [JsonIgnore]
        public virtual ICollection<Avaliacao> Avaliacaos { get; set; }
        [JsonIgnore]
        public virtual ICollection<LogPetshop> LogPetshops { get; set; }
        [JsonIgnore]
        public virtual ICollection<TermosPetshop> TermosPetshop { get; set; }
        [JsonIgnore]
        public virtual LogisticaDoPetshop LogisticaNavigation { get; set; }
    }
}