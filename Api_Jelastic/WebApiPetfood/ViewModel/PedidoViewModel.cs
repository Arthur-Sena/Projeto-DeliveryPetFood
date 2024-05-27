using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using WebApiPetfood.Models;

namespace WebApiPetfood.ViewModel
{
    public class pedidoViewModel
    {
        public CartaoCredito cartao { get; set; }
        public Pedido pedido { get; set; }
    }
}