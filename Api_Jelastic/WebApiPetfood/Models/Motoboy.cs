using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;


#nullable disable

namespace WebApiPetfood.Models
{
    public partial class Motoboy
    {
        [Key]
        public int Idmotoboy { get; set; }
        public string Email { get; set; }
        [JsonIgnore]
        public string Senha { get; set; }
        public string Nome { get; set; }
        public int Idtipousuario { get; set; }
        public decimal? Avaliacao { get; set; }
        public string Telefone { get; set; }
        public string Cpf { get; set; }
        public decimal? Carteiradigital { get; set; }
        [JsonIgnore]
        public bool Aprovado { get; set; }

        public virtual Tipousuario IdtipousuarioNavigation { get; set; }

        [JsonIgnore]
        public virtual ICollection<AvaliacaoMotoboy> AvaliacaoMotoboys { get; set; }
        [JsonIgnore]
        public virtual ICollection<TermosMotoboy> TermosMotoboy { get; set; }
        [JsonIgnore]
        public virtual ICollection<LogMotoboy> LogMotoboys { get; set; }
        [JsonIgnore]
        public virtual ICollection<LocalizacaoMotoboy> LocalizacaoMotoboys { get; set; }
        [JsonIgnore]
        public virtual ICollection<FirebaseEntregador> FirebaseEntregadors { get; set; }
        public virtual ICollection<ImgMotoboy> Imgmotoboy { get; set; }
        [JsonIgnore]
        public virtual ICollection<ChatEntregadorUsuario> ChatEntregadorUsuarios { get; set; }

    }
}
