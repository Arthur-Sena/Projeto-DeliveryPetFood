using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApiPetfood.Models
{
    public partial class Produto
    {

        [Key]
        public int Idproduto { get; set; }
        public string Titulo { get; set; }
        public decimal Preco { get; set; }
        public string Descricao { get; set; }
        public int Idpetshop { get; set; }
        public int idCategoria { get; set; }
        public bool disponivel {get;set;}
        public bool deletado {get;set;}
        public virtual Petshop IdpetshopNavigation { get; set; }
        public virtual Categoria IdcategoriaNavigation { get; set; }
        public virtual ICollection<Imgproduto> Imgprodutos { get; set; }
    }
}
