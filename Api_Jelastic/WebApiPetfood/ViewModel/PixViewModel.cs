using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApiPetfood.ViewModel
{
    public class additional_data{
        public string transactions_id {get;set;}
        public string qr_code {get;set;}
        public string creations_date_qrcode {get;set;}
        public string expiration_date_qrcode {get;set;}
        public string psp_code {get;set;}
    }

    public class PixViewModel
    {
        public string payment_id { get; set; }
        public string status { get; set; }
        public string description { get; set; }
        public additional_data additional_data { get; set; }
    }
}