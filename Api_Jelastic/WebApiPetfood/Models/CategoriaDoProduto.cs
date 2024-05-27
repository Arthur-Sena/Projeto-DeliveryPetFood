using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebApiPetfood.Models
{
    public partial class Categoria
    {
        [Key]
        public int idCategoria { get; set; }
        public string icone { get; set; }
        public string categoria { get; set; }

        public virtual ICollection<Produto> Produtos { get; set; }

    }
}
