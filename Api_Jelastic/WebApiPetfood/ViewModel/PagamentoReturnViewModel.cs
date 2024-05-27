using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace WebApiPetfood.ViewModel
{

    public class credit{
        public bool delayed { get; set; }
        public string authorization_code { get; set; }
        public string authorized_at { get; set; }
        public string reason_code { get; set; }
        public string reason_message { get; set; }
        public string acquirer { get; set; }
        public string soft_descriptor { get; set; }
        public string terminal_nsu { get; set; }
        public string brand { get; set; }
        public string acquirer_transaction_id { get; set; }
        public string transaction_id { get; set; }
    }

    public class PagamentoReturnViewModel
    {
        public string payment_id { get; set; }
        [JsonIgnore]
        public string seller_id { get; set; }
        public int amount { get; set; }
        public string currency { get; set; }
        public string order_id { get; set; }
        public string status { get; set; }
        public string received_at { get; set; }
        public credit card { get; set; }
    }
}