using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace WebApiPetfood.ViewModel
{
    public class PagamentoPixReturnViewModel
    {
        public string payment_id { get; set; } 
        [JsonIgnore]
        public string seller_id { get; set; }
        public int amount { get; set; }
        public string order_id { get; set; }
        public string currency { get; set; }
        public string status { get; set; }
        public string received_at { get; set; }
        public PixViewModel pix { get; set; }
    }
}