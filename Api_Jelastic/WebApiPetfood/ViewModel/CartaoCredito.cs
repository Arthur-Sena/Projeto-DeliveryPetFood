using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;


namespace WebApiPetfood.ViewModel
{
    public class CartaoCredito
    {

        public string number_token { get; set; }
        public string cardholder_name { get; set; }
        public string expiration_month { get; set; }
        public string expiration_year { get; set; }
        public string security_code { get; set; }
    }
}