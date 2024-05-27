using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using WebApiPetfood.Models;

namespace WebApiPetfood.ViewModel
{
    public class NotificarEntregadorViewModel
    {
        public FirebaseEntregador FirebaseEntregador {get; set;}
        public LocalizacaoMotoboy UltimaLocalizacao { get; set; }
    }
}