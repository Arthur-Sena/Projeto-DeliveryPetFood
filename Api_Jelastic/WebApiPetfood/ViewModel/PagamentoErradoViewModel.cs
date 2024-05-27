using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace WebApiPetfood.ViewModel
{

     public class Error{
        public string status {get;set;}
        public string error_code {get;set;}
        public string description {get;set;}
        public string description_detail {get;set;}
    }
    
    public class PagamentoErradoViewModel
    {
        public string message { get; set; }
        public string name { get; set; }
        public int status_code { get; set; }
        public List<Error> details { get; set; }
    }
}