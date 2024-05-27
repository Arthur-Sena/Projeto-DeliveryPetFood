using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

#nullable disable

namespace WebApiPetfood.Models
{
    public partial class Usuario
    {
        [Key]
        public int Idusuario { get; set; }
        public string Email { get; set; }
        [JsonIgnore]
        public string Senha { get; set; }
        public string Nome { get; set; }
        public string Telefone { get; set; }
        public string Cpf { get; set; }
        public decimal Carteiradigital { get; set; }
        [JsonIgnore]
        public int Idtipousuario { get; set; }

        [JsonIgnore]
        public virtual Tipousuario IdtipousuarioNavigation { get; set; }
        public virtual ICollection<Endereco> Enderecos { get; set; }
        [JsonIgnore]
        public virtual ICollection<Chat> Chats { get; set; }
        [JsonIgnore]
        public virtual ICollection<ChatEntregadorUsuario> ChatEntregadorUsuarios { get; set; }
        [JsonIgnore]
        public virtual ICollection<InfoPedido> InfoPedidos { get; set; }
        [JsonIgnore]
        public virtual ICollection<TermosCondicoes> Termos { get; set; }
        [JsonIgnore]
        public virtual ICollection<LogUsuario> LogUsuarios { get; set; }
    }
}
