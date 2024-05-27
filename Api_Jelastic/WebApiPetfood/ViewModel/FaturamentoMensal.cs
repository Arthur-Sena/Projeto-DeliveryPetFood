using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApiPetfood.ViewModels
{
    public class FaturamentoMensal
    {        
        public string Mes { get; set; }
        public decimal faturamento { get; set; }
        public decimal frete { get; set; }
        public decimal lucroPetshop { get; set; }
        public decimal lucroPetFood { get; set; }

    }
}