using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApiPetfood.ViewModels
{
    public class ProdutoViewModel
    {        
        public decimal PrecoFrete { get; set; }
        public decimal PrecoProduto { get; set; }
        public decimal PrecoTotal { get; set; }
    }
}