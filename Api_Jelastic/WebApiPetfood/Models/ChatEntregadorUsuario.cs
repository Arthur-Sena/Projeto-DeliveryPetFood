using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public partial class ChatEntregadorUsuario
    {
        [Key]
        public int idChat { get; set; }
        public int idUsuario { get; set; }
        public int idEntregador { get; set; }
        public string Mensagem { get; set; }
        public int Emissor { get; set; }
        public bool VisualizadoCliente { get; set; }
        public bool VisualizadoEntregador { get; set; }
        [JsonIgnore]
        public Tipousuario IdtipousuarioNavigation { get; set; }
        [JsonIgnore]
        public Motoboy IdmotoboyNavigation { get; set; }
        [JsonIgnore]
        public Usuario IdusuarioNavigation { get; set; }
    }
}