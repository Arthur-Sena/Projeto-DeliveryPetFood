using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using WebApiPetfood.Models;

namespace WebApiPetfood.ViewModel
{
    public class UltimaLocalizacaoMotoboy
    {
        public Motoboy Motoboy { get; set; }
        public LocalizacaoMotoboy UltimaLocalizacao { get; set; }
        public string UltimaVezVisto {get; set;}
    }
}