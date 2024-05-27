using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Runtime.Serialization.Json;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WebApiPetfood.Models;
using WebApiPetfood.ViewModel;

namespace WebApiPetfood.Repositories
{
    public class PagamentoRepository
    {
#region "Variaveis Utilizadas Nesse Repositorio"
        db_petfoodContext ctx = new db_petfoodContext();
        HttpWebResponse resposta;
        Stream streamRequisicao;
        Stream streamResposta;
        StreamReader leitor;

        private readonly IMongoCollection<Pedido> _pedidos;

        PedidoRepository PedidoRepository = new PedidoRepository();
        AdministradorRepository AdministradorRepository = new AdministradorRepository();
        LogsRepository LogsRepository = new LogsRepository();
        public PagamentoRepository() 
        {
            var client = new MongoClient("mongodb://admin:nntz32C2i4@10.100.34.181:27017,10.100.34.209:27017,10.100.34.208:27017/?replicaSet=rs0&authSource=admin&readPreference=primary&w=majority");
            var database = client.GetDatabase("petfood");
            _pedidos = database.GetCollection<Pedido>("Pedido");
        }
#endregion

#region "Models (objetos) usado nesse repositorio"
        public class TokenGetNet
        {
            public string access_token { get; set; }
            public string token_type { get; set; }
            public int expires_in { get; set; }
            public string scope { get; set; }
        }

        public class NumeroDoCartao
        {
            public string card_number { get; set; }
        }

        public class NumberToken
        {
            public string number_token { get; set; }
        }

        public class ValidacaoDoCartao
        {
            public string status { get; set; }
            public string verification_id { get; set; }
            public string authorization_code { get; set; }
        }

        public class Order
        {
            public string order_id { get; set; }
            public int sales_tax { get; set; }
            public string product_type { get; set; }
        }

        public class EnderecoParaPagamento
        {
            public string street { get; set; }

            public string number { get; set; }

            public string complement { get; set; }

            public string district { get; set; }

            public string city { get; set; }

            public string state { get; set; }

            public string country { get; set; }

            public string postal_code { get; set; }
        }

        public class Customer
        {
            public string customer_id { get; set; }

            public string first_name { get; set; }

            public string last_name { get; set; }

            public string name { get; set; }

            public string email { get; set; }

            public string document_type { get; set; }

            public string document_number { get; set; }

            public string phone_number { get; set; }

            public EnderecoParaPagamento billing_address { get; set; }
        }

        public class Shippings
        {
            public EnderecoParaPagamento address {get; set;}
            public string email {get; set;}
            public string first_name {get; set;}
            public string name {get; set;}
            public string phone_number {get; set;}
            public int shipping_amount {get; set;}
        }

        public class Device
        {
            public string device_id {get; set;}
            public string ip_address {get; set;}
        }

        public class sub_merchant
        {
            public string address {get;set;}
            public string city {get;set;}
            public string document_number {get;set;}
            public string document_type {get;set;}
            public string identification_code {get;set;}
            public string postal_code {get;set;}
            public string state {get;set;}
        }

        public class Credit
        {
            public bool delayed { get; set; }
            public bool pre_authorization { get; set; }
            public bool save_card_data { get; set; }
            public string transaction_type { get; set; }
            public int number_installments { get; set; }
            public string soft_descriptor { get; set; }
            public int dynamic_mcc { get; set; }
            public CartaoCredito card { get; set; }
        }

        public class Debit
        {
            public string cardholder_mobile { get; set; }
            public string soft_descriptor { get; set; }
            public int dynamic_mcc { get; set; }
            public bool authenticated { get; set; }
            public CartaoCredito card { get; set; }
        }

        public class Compra
        {
            public string seller_id { get; set; }
            public int amount { get; set; }
            public string currency { get; set; }
            public Order order { get; set; }
            public Customer customer { get; set; }
            public Credit credit { get; set; }
            public List<Shippings> shippings { get; set; }
            public Device device { get; set; }
            public sub_merchant sub_merchant { get; set; }
        }

        public class CompraDebito
        {
            public string seller_id { get; set; }

            public int amount { get; set; }

            public string currency { get; set; }

            public Order order { get; set; }

            public Customer customer { get; set; }

            public Debit debit { get; set; }
            public List<Shippings> shippings { get; set; }
            public Device device { get; set; }
            public sub_merchant sub_merchant { get; set; }
        }

        public class Pix
        {
            public int amount { get; set; }
            public string currency { get; set; }
            public string order_id { get; set; }
            public string customer_id { get; set; }
        }
        
        public class ReturnPayPix
        {
            public string payment_id { get; set; }
            public string status { get; set; }
            public string description { get; set; }
            public additional_dataPix additional_data { get; set; }
        }
        public class additional_dataPix
        {
            public string transactions_id { get; set; }
            public string qr_code { get; set; }
            public string creations_date_qrcode { get; set; }
            public string expiration_date_qrcode { get; set; }
            public string psp_code { get; set; }
        }
         
        public class post_data
        {
            public string issuer_payment_id { get; set; }
            public string payer_authentication_request { get; set; }
        }
        public class PagamentoDebitoReturno
        {
            public string payment_id { get; set; }
            public string seller_id { get; set; }
            public string redirect_url { get; set; }
            public post_data post_data { get; set; }
        }

        public class ConfirmDebito
        {
            public string payer_authentication_response { get; set; }
        }
#endregion

#region "Pagamento PIX- api getnet, para essa api funcionar a loja precisa ter uma conta santander e pedir autorizacao na getnet"
        public object PayPix(string idPedido)
        {
            try{
                string seller_idGetNet = AdministradorRepository.ListarCredencial();

                string bearerToken = CreateTokenGetNet().access_token;
                string url = ("https://api.getnet.com.br/v1/payments/qrcode/pix");

                var pedido = _pedidos.Find(x => x.Id == idPedido).ToList();
                int precoDoPedido = (Decimal.ToInt32(pedido[0].preco * 100));

                var pix = new Pix {
                        amount = (Decimal.ToInt32(pedido[0].preco * 100)),
                        currency = "BRL",
                        order_id = pedido[0].Id,
                        customer_id = pedido[0].idUsuario.ToString(),
                    };

                string jsonString = JsonConvert.SerializeObject(pix);

                try
                {
                    WebRequest request = WebRequest.Create(url);
                    request.Headers.Add("seller_id", seller_idGetNet);
                    request.Headers.Add("Authorization", "Bearer " + bearerToken);
                    request.ContentType = "application/json; charset=utf-8";
                    request.Method = "POST";

                    using( var streamWriter = new StreamWriter(request.GetRequestStream()) ){
                        streamWriter.Write(JObject.Parse(jsonString));
                        streamWriter.Flush();
                    }

                    var httpResponse = (HttpWebResponse)request.GetResponse();
                    streamResposta = httpResponse.GetResponseStream();
                    leitor = new StreamReader(streamResposta);
                    var objResponse = leitor.ReadToEnd();
                    var post = JObject.Parse(objResponse);
                    var data = JsonConvert.DeserializeObject<PixViewModel>(post.ToString());

                    PagamentoPixReturnViewModel p = new PagamentoPixReturnViewModel();
                    p.payment_id = data.payment_id;
                    p.amount = (Decimal.ToInt32(pedido[0].preco * 100));
                    p.currency = "BRL";
                    p.order_id = idPedido;
                    p.status = data.status;
                    p.received_at = data.additional_data.creations_date_qrcode;
                    p.pix = data;
    
                    PedidoRepository.Atualizar_PedidoStatus(idPedido, "Aguardando Pagamento");
                    PedidoRepository.Atualizar_PedidoDepoisDoPagamento(idPedido ,p , data.status, data.payment_id); 
    
                    return data;            
                }
                catch (WebException ex)
                {
                    using (WebResponse response = ex.Response)
                    {

                        using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                        {
                            string text = reader.ReadToEnd();
                            var post = JObject.Parse(text);
                            var dataError = JsonConvert.DeserializeObject<PagamentoErradoViewModel>(post.ToString());

                            LogsRepository.PostLog($"API ErroPix: {post}" , pedido[0].idUsuario, "0.000.000"); 
                            PedidoRepository.Atualizar_PedidoStatus(idPedido, "Não Autorizada");                    
                            PedidoRepository.Atualizar_PedidoDepoisDoPagamento(idPedido, dataError , "Não Autorizada", "Não Autorizada");
                        }
                    }

                    return ("Transação Não Autorizada");
                }
            } catch (Exception ex){
                return PayPixManual(idPedido);
            }

        }  
        
        public object PayPixManual(string idPedido){
            var pedido = _pedidos.Find(x => x.Id == idPedido).ToList();

            additional_data additional_dataJson = new additional_data();
            additional_dataJson.transactions_id = idPedido;
            additional_dataJson.qr_code = "contato@deliverypetfood.com.br";
            additional_dataJson.creations_date_qrcode = "Aguardando Pagamento";
            additional_dataJson.expiration_date_qrcode = "Sem Expiração";
            additional_dataJson.psp_code = "Pix Manual";           

            var pix = new PixViewModel {
                    payment_id = idPedido,
                    status = "Aguardando Pagamento",
                    description = "Aguardando Pagamento",
                    additional_data = additional_dataJson,
                };

            string jsonString = JsonConvert.SerializeObject(pix);

            PagamentoPixReturnViewModel p = new PagamentoPixReturnViewModel();
            p.payment_id = "Pix Manual,";
            p.amount = (Decimal.ToInt32(pedido[0].preco * 100));
            p.currency = "BRL";
            p.order_id = idPedido;
            p.status = "Aguardando Pagamento";
            p.received_at = null;
            p.pix = JsonConvert.DeserializeObject<PixViewModel>(jsonString.ToString());

            var data = JsonConvert.DeserializeObject<PixViewModel>(jsonString.ToString());
            
            PedidoRepository.Atualizar_PedidoStatus(idPedido, "Aguardando Pagamento");
            PedidoRepository.Atualizar_PedidoDepoisDoPagamento(idPedido ,p , data.status, data.payment_id);    
            
            return data;
        }

#endregion

#region "Confirma se Pagamento PIX foi efetuado- api getnet, para essa api funcionar a loja precisa ter uma conta santander e pedir autorizacao na getnet"
        public object VerificarPagamentoPix(string payment_id)
        {
            string seller_idGetNet = AdministradorRepository.ListarCredencial();
            string bearerToken = CreateTokenGetNet().access_token;
            string url = ("https://api.getnet.com.br/v1/payments/qrcode/" + payment_id);
            
                WebRequest request = WebRequest.Create(url);
                request.Headers.Add("seller_id", seller_idGetNet);
                request.Headers.Add("Authorization", "Bearer " + bearerToken);
                request.Method = "GET";

                using (var resposta = request.GetResponse())
                {
                    var streamDados = resposta.GetResponseStream();
                    StreamReader reader = new StreamReader(streamDados);
                    var objResponse = reader.ReadToEnd();
                    var post = JObject.Parse(objResponse);
                    var data = JsonConvert.DeserializeObject(post.ToString());
                    streamDados.Close();
                    resposta.Close();
                    return data;
                }
        }  
#endregion

#region "Cancelar Pagamento - api getnet"
        public string CancelarPagamento(string idPedido)
        {
            var pedido = _pedidos.Find(x => x.Id == idPedido).ToList();
            switch (pedido[0].pagamento.Tipo)
            {
                case "Débito":
                case "Crédito":
                    var payment_id = pedido[0].pagamento.payment_id;

                    string url;
                    if (pedido[0].pagamento.Tipo == "Crédito"){
                        url = ("https://api.getnet.com.br/v1/payments/credit/" + payment_id + "/cancel");
                    } else {
                        url = ( "https://api.getnet.com.br/v1/payments/debit/" + payment_id + "/cancel" );
                    }
                    string bearerToken = CreateTokenGetNet().access_token;
                    try
                    {
                        WebRequest request = WebRequest.Create(url);
                        request.Headers.Add("Authorization", "Bearer " + bearerToken);
                        request.ContentType = "application/json; charset=utf-8";
                        request.Method = "POST";

                        streamRequisicao = request.GetRequestStream();
                        streamRequisicao.Close();
                        resposta = (HttpWebResponse) request.GetResponse();
                        streamResposta = resposta.GetResponseStream();
                        leitor = new StreamReader(streamResposta);
                        object objResponse = leitor.ReadToEnd();
                        var post = JsonConvert.DeserializeObject(objResponse.ToString());

                        return "Pagamento Cancelado";
                    }
                    catch (WebException ex)
                    {
                        Console.WriteLine(ex.Message);
                        return "Erro";
                    }
                case "Pix":
                case "pix":
                    int idUsuario = pedido[0].idUsuario;
                    decimal Preco = pedido[0].preco;

                    Usuario user = ctx.Usuarios.Find(idUsuario);
                    user.Carteiradigital = Math.Round(user.Carteiradigital + Preco, 2);
                    ctx.Update (user);
                    ctx.SaveChanges();
                    return "Pagamento Cancelado";
                default:
                    return "Error";
            }
        }
#endregion

#region "Cria token getnet, como se fosse um login na api getnet, gera um 'token' de acesso"
        public TokenGetNet CreateTokenGetNet()
        {
            string dados = "scope=oob&grant_type=client_credentials";

            WebRequest request = WebRequest.Create("https://api.getnet.com.br/auth/oauth/v2/token");

            //- - - HEADER DA REQUISICAO ---------------------------------------------
            request.ContentType = "application/x-www-form-urlencoded";
            request.Headers.Add("Authorization", "Basic " + "ZTE0MTliZTAtYTZiZi00YWU5LWI0ZmEtYzVlYzQ3N2ZlZTY5OjM1OTllNTcyLTJmNmQtNDFkNC04ZWU4LTQxODcyOWVlNzBjMA==");

            request.Method = "POST";
            request.ContentLength = dados.Length;

            streamRequisicao = request.GetRequestStream();
            streamRequisicao.Write(Encoding.ASCII.GetBytes(dados), 0, dados.Length);
            streamRequisicao.Close();
            resposta = (HttpWebResponse) request.GetResponse();
            streamResposta = resposta.GetResponseStream();
            leitor = new StreamReader(streamResposta);
            object objResponse = leitor.ReadToEnd();
            var post = JsonConvert.DeserializeObject<TokenGetNet>(objResponse.ToString());
            return post;
        }
#endregion

#region "Api de Tokenizacao de um cartão GetNet, criptografa o numero do cartão para maior segurança da transação"
        public NumberToken TokenizacaoGetNet(string CardNumber)
        {
            string bearerToken = CreateTokenGetNet().access_token;
            string url = ("https://api.getnet.com.br/v1/tokens/card");

            NumeroDoCartao jsonV2 = new NumeroDoCartao();
            jsonV2.card_number = CardNumber;
            string json = JsonConvert.SerializeObject(jsonV2);

            try
            {
                var request = WebRequest.CreateHttp(url);
                request.Headers.Add("Authorization", "Bearer " + bearerToken);
                request.ContentType = "application/json; charset=utf-8";
                request.Method = "POST";
                request.Headers.Add("Accept", "application/json, text/plain, */*");
                request.Headers.Add(HttpRequestHeader.AcceptEncoding, "gzip, deflate");
                request.AutomaticDecompression = DecompressionMethods.Deflate | DecompressionMethods.GZip;

                using (
                    var streamWriter =
                        new StreamWriter(request.GetRequestStream())
                )
                {
                    streamWriter.Write(JObject.Parse(json));
                    streamWriter.Flush();
                }
                var httpResponse = (HttpWebResponse) request.GetResponse();
                using (
                    var streamReader =
                        new StreamReader(httpResponse.GetResponseStream())
                )
                {
                    var responseText = streamReader.ReadToEnd();
                    var post = JObject.Parse(responseText);
                    var data =
                        JsonConvert
                            .DeserializeObject<NumberToken>(post.ToString());

                    return data;
                }
            }
            catch (WebException ex)
            {
                NumberToken e = new NumberToken();
                e.number_token = ex.Message;
                return (e);
            }
        }
#endregion

#region "Api de Verificacao de um cartão GetNet"
        public ValidacaoDoCartao VerificacaoDoCartao(CartaoCredito Cartao)
        {
            string url =
                ("https://api.getnet.com.br/v1/cards/verification");
            string bearerToken = CreateTokenGetNet().access_token;

            string cartaoToken =
                TokenizacaoGetNet(Cartao.number_token).number_token;

            CartaoCredito cartaoDeCredito = new CartaoCredito();
            cartaoDeCredito.number_token = cartaoToken;
            cartaoDeCredito.cardholder_name = Cartao.cardholder_name;
            cartaoDeCredito.expiration_month = Cartao.expiration_month;
            cartaoDeCredito.expiration_year = Cartao.expiration_year;
            cartaoDeCredito.security_code = Cartao.security_code;

            string jsonString = JsonConvert.SerializeObject(cartaoDeCredito);
            try
            {
                WebRequest request = WebRequest.Create(url);
                request.Headers.Add("Authorization", "Bearer " + bearerToken);
                request.ContentType = "application/json; charset=utf-8";
                request.Method = "POST";

                using (
                    var streamWriter =
                        new StreamWriter(request.GetRequestStream())
                )
                {
                    streamWriter.Write(JObject.Parse(jsonString));
                    streamWriter.Flush();
                }
                resposta = (HttpWebResponse) request.GetResponse();
                streamResposta = resposta.GetResponseStream();
                leitor = new StreamReader(streamResposta);
                var objResponse = leitor.ReadToEnd();
                var post = JObject.Parse(objResponse);
                var data = JsonConvert.DeserializeObject<ValidacaoDoCartao>(post.ToString());
                return data;
            }
            catch (WebException ex)
            {
                ValidacaoDoCartao e = new ValidacaoDoCartao();
                e.status = ex.Message;
                return (e);
            }
        }
#endregion

#region "Api de Pagamento Crédito GetNet"
        public string PayCredito(pagamentoViewModel pagamento)
        {
            string seller_idGetNet = AdministradorRepository.ListarCredencial(); 

            var pedido = _pedidos.Find(x => x.Id == pagamento.idPedido).ToList();
            var EnderecoBuscado = ctx.Enderecos.Find(pedido[0].idEndereco);
            string cep = EnderecoBuscado.Cep;
            cep = string.Join("", cep.Split('-', ',', '.'));

            var user = ctx.Usuarios.Find(pedido[0].idUsuario);

            string url = ("https://api.getnet.com.br/v1/payments/credit");
            string bearerToken = CreateTokenGetNet().access_token;
            string cartaoToken = TokenizacaoGetNet(pagamento.cartao.number_token).number_token;

            string[] nomeSeparado = user.Nome.Split(' ');

            #region "Objetos Usado Para requisicao na api da GETNET"
            var adress =
                new EnderecoParaPagamento {
                    street = EnderecoBuscado.enderecoRua,
                    complement = EnderecoBuscado.Complemento != null ? EnderecoBuscado.Complemento : "Casa",
                    district = EnderecoBuscado.Bairro,
                    number = EnderecoBuscado.numero,
                    city = EnderecoBuscado.Cidade,
                    state = EnderecoBuscado.Estado,
                    country = "Brasil",
                    postal_code = cep
                };

            var shippings =
                new Shippings {
                    address = adress,
                    email = user.Email,
                    first_name = nomeSeparado[0],
                    name = user.Nome,
                    phone_number = user.Telefone,
                    shipping_amount = (Decimal.ToInt32(pedido[0].preco * 100))
                };

            var orderDados =
                new Order {
                    order_id = pedido[0].Id,
                    sales_tax = 0,
                    product_type = "physical_goods"
                };

            var customerDados =
                new Customer {
                    customer_id = user.Idusuario.ToString(),
                    first_name = nomeSeparado[0],
                    last_name = nomeSeparado[nomeSeparado.Length - 1],
                    name = user.Nome,
                    email = user.Email,
                    document_type = "CPF",
                    document_number = user.Cpf,
                    phone_number = user.Telefone,
                    billing_address = adress
                };

            var sub_merchant = 
                new sub_merchant {
                    address = "Rua Manoel Alves Garcia 185",
                    city = "Jandira",
                    document_number = "37835291000148",
                    document_type = "CNPJ",
                    identification_code = "06618010",
                    postal_code = "06618010",
                    state = "SP",
                }; 

            CartaoCredito credito = new CartaoCredito();
            credito.number_token = cartaoToken;
            credito.cardholder_name = pagamento.cartao.cardholder_name;
            credito.security_code = pagamento.cartao.security_code;
            credito.expiration_month = pagamento.cartao.expiration_month;
            credito.expiration_year = pagamento.cartao.expiration_year;

            var credit =
                new Credit {
                    delayed = false,
                    pre_authorization = false,
                    save_card_data = false,
                    transaction_type = "FULL",
                    number_installments = 1,
                    // soft_descriptor = "PETFOOD*DELIVERY*AGENCIA*DE*PET*SHOPS*ONLINE*LTDA",
                    soft_descriptor = "PETFOOD*DELIVERY*LTDA",
                    dynamic_mcc = 1799,
                    card = credito
                };

            var device = 
                new Device {
                    device_id  = pedido[0].device.device_id,
                    ip_address = pedido[0].device.ip_address
                };

            List<Shippings> listShippings = new List<Shippings>();
            listShippings.Add(shippings);

            var compra =
                new Compra {
                    seller_id = seller_idGetNet,
                    amount = (Decimal.ToInt32(pedido[0].preco * 100)),
                    currency = "BRL",
                    order = orderDados,
                    customer = customerDados,
                    shippings = listShippings,
                    device = device,
                    sub_merchant = sub_merchant,
                    credit = credit
                };

            #endregion
            
            string jsonString = JsonConvert.SerializeObject(compra);

            #region "Fazendo Requisição"
            var request = WebRequest.CreateHttp(url);
            request.Headers.Add("Authorization", "Bearer " + bearerToken);
            request.Headers.Add("Accept", "application/json, text/plain, */*");
            request.ContentType = "application/json; charset=utf-8";
            request.Method = "POST";
            request.Headers.Add(HttpRequestHeader.AcceptEncoding, "gzip, deflate");
            request.AutomaticDecompression = DecompressionMethods.Deflate | DecompressionMethods.GZip;
                
            string retorno;
            #endregion
                
            #region "Salvando Retorno da Requisição"
            try
            {
                using( var streamWriter = new StreamWriter(request.GetRequestStream()) ){
                    streamWriter.Write(JObject.Parse(jsonString));
                    streamWriter.Flush();
                    streamWriter.Close();
                }

                var httpResponse = (HttpWebResponse) request.GetResponse();
                
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    retorno = streamReader.ReadToEnd();
                    LogsRepository.PostLog($"API CRÉDITO: {JObject.Parse(retorno)}" , user.Idusuario, "0.000.000"); 
                }
                var data = JsonConvert.DeserializeObject<PagamentoReturnViewModel>(retorno);

                PedidoRepository.Atualizar_PedidoStatus(pagamento.idPedido, "Em Analise");
                PedidoRepository.Atualizar_PedidoDepoisDoPagamento(pagamento.idPedido,data, data.status, data.payment_id);                
                return "Pagamento Efetuado";
            }
            catch (WebException ex)
            {
                using (WebResponse response = ex.Response)
                {
                    using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                    {
                        string text = reader.ReadToEnd();
                        var post = JObject.Parse(text);
                        var dataError = JsonConvert.DeserializeObject<PagamentoErradoViewModel>(post.ToString());
                        LogsRepository.PostLog($"API ErroCRÉDITO: {post}" , user.Idusuario, "0.000.000"); 
                        PedidoRepository.Atualizar_PedidoStatus(pagamento.idPedido, "Não Autorizada");
                        PedidoRepository.Atualizar_PedidoDepoisDoPagamento(pagamento.idPedido, dataError , "Não Autorizada", "Não Autorizada");
                    }
                }
                return ("Transação Não Autorizada");
            } 
            #endregion
        }
#endregion

#region "Api de Pagamento Débito GetNet"
        public string PayDebito(pagamentoViewModel pagamento)
        {
            string seller_idGetNet = AdministradorRepository.ListarCredencial();
            string url = ("https://api.getnet.com.br/v1/payments/debit");
            string bearerToken = CreateTokenGetNet().access_token;
            string cartaoToken = TokenizacaoGetNet(pagamento.cartao.number_token).number_token;

            var pedido = _pedidos.Find(x => x.Id == pagamento.idPedido).ToList();

            var EnderecoBuscado = ctx.Enderecos.Find(pedido[0].idEndereco);
            string cep = EnderecoBuscado.Cep;
            cep = string.Join("", cep.Split('-', ',', '.'));

            var user = ctx.Usuarios.Find(pedido[0].idUsuario);
            string[] nomeSeparado = user.Nome.Split(' ');

    #region "Models usado para requisicao de debito"
            var adress =
                new EnderecoParaPagamento {
                    street = EnderecoBuscado.enderecoRua,
                    complement = EnderecoBuscado.Complemento != null ? EnderecoBuscado.Complemento : "Casa",
                    district = EnderecoBuscado.Bairro,
                    number = EnderecoBuscado.numero,
                    city = EnderecoBuscado.Cidade,
                    state = EnderecoBuscado.Estado,
                    country = "Brasil",
                    postal_code = cep
                };

            var shippings =
                new Shippings {
                    address = adress,
                    email = user.Email,
                    first_name = nomeSeparado[0],
                    name = user.Nome,
                    phone_number = user.Telefone,
                    shipping_amount = (Decimal.ToInt32(pedido[0].preco * 100))
                };


            var orderDados =
                new Order {
                    order_id = pedido[0].Id,
                    sales_tax = 0,
                    product_type = "physical_goods"
                };

            var customerDados =
                new Customer {
                    customer_id = user.Idusuario.ToString(),
                    first_name = user.Nome,
                    last_name = user.Nome,
                    name = user.Nome,
                    email = user.Email,
                    document_type = "CPF",
                    document_number = user.Cpf,
                    phone_number = user.Telefone,
                    billing_address = adress
                };

            CartaoCredito cartao = new CartaoCredito();
            cartao.number_token = cartaoToken;
            cartao.cardholder_name = pagamento.cartao.cardholder_name;
            cartao.security_code = pagamento.cartao.security_code;
            cartao.expiration_month = pagamento.cartao.expiration_month;
            cartao.expiration_year = pagamento.cartao.expiration_year;

            var sub_merchant = 
                new sub_merchant {
                    address = "Rua Manoel Alves Garcia 185",
                    city = "Jandira",
                    document_number = "37835291000148",
                    document_type = "CNPJ",
                    identification_code = "06618010",
                    postal_code = "06618010",
                    state = "SP",
                }; 


            var debit =
                new Debit {
                    cardholder_mobile = user.Telefone,
                    soft_descriptor = "PETFOOD*DELIVERY*LTDA",
                    // soft_descriptor = "PETFOOD*DELIVERY*AGENCIA*DE*PET*SHOPS*ONLINE*LTDA",
                    dynamic_mcc = 0,
                    card = cartao
                };
            
                var device = 
                new Device {
                    device_id  = pedido[0].device.device_id,
                    ip_address = pedido[0].device.ip_address
                };

            List<Shippings> listShippings = new List<Shippings>();
            listShippings.Add(shippings);

            var compra =
                new CompraDebito {
                    seller_id = seller_idGetNet,
                    amount = (Decimal.ToInt32(pedido[0].preco * 100)),
                    currency = "BRL",
                    order = orderDados,
                    customer = customerDados,
                    shippings = listShippings,
                    device = device,
                    sub_merchant = sub_merchant,
                    debit = debit
                };
#endregion
            string jsonString = JsonConvert.SerializeObject(compra);

    #region "Escrevendo Header e Url da Requisição GetNet"
            var request = WebRequest.CreateHttp(url);
            request.Headers.Add("Authorization", "Bearer " + bearerToken);
            request.Headers.Add("Accept", "application/json, text/plain, */*");
            request.ContentType = "application/json; charset=utf-8";
            request.Method = "POST";
            request.Headers.Add(HttpRequestHeader.AcceptEncoding, "gzip, deflate");
            request.AutomaticDecompression = DecompressionMethods.Deflate | DecompressionMethods.GZip;
#endregion
            string retorno;
            try
            {
                #region "Primeira requisiçao para o pagamento de debito"
                using (var streamWriter = new StreamWriter(request.GetRequestStream()) )
                {
                    streamWriter.Write(JObject.Parse(jsonString));
                    streamWriter.Flush();
                    streamWriter.Close();
                }
                var httpResponse = (HttpWebResponse) request.GetResponse();

                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    retorno = streamReader.ReadToEnd();
                    Console.WriteLine($"retorno :{JObject.Parse(retorno)}");
                    LogsRepository.PostLog($"Verificando cartão de DÉBITO: {JObject.Parse(retorno)}" , user.Idusuario, "0.000.000"); 
                }
                var data = JsonConvert.DeserializeObject<PagamentoDebitoReturno>(retorno);

                #endregion

                #region "Requisicao de confirmação de pagamento - Débito"
                string secondBearerToken = CreateTokenGetNet().access_token;

                var secondRequest = WebRequest.CreateHttp("https://api.getnet.com.br/v1/payments/debit/" + data.payment_id + "/authenticated/finalize");
                secondRequest.Headers.Add("Authorization", "Bearer " + secondBearerToken);
                secondRequest.Headers.Add("Accept", "application/json, text/plain, */*");
                secondRequest.ContentType = "application/json; charset=utf-8";
                secondRequest.Method = "POST";
                secondRequest.Headers.Add(HttpRequestHeader.AcceptEncoding, "gzip, deflate");
                secondRequest.AutomaticDecompression = DecompressionMethods.Deflate | DecompressionMethods.GZip;

                string secondRetorno;
                string payer_authentication_response = data.post_data.payer_authentication_request;                
                var secondJson = new ConfirmDebito {
                    payer_authentication_response  = data.post_data.payer_authentication_request
                };
                string secondJsonString = JsonConvert.SerializeObject(secondJson);

                try{
                    using (var secondStreamWriter = new StreamWriter(secondRequest.GetRequestStream()) )
                    {
                        secondStreamWriter.Write(JObject.Parse(secondJsonString));
                        secondStreamWriter.Flush();
                        secondStreamWriter.Close();
                    }
                    
                    var secondHttpResponse = (HttpWebResponse)secondRequest.GetResponse();
                
                    using (var secondStreamReader = new StreamReader(secondHttpResponse.GetResponseStream()))
                    {
                        secondRetorno = secondStreamReader.ReadToEnd();
                        LogsRepository.PostLog($"PAGAMENTO DÉBITO: {JObject.Parse(secondRetorno)}" , user.Idusuario, "0.000.000"); 
                    }
                    var secondData = JsonConvert.DeserializeObject<PagamentoDebitoReturnViewModel>(secondRetorno);                    
                    PedidoRepository.Atualizar_PedidoStatus(pagamento.idPedido, "Em Analise");
                    PedidoRepository.Atualizar_PedidoDepoisDoPagamento(pagamento.idPedido, secondData,"Pagamento Efetuado", secondData.payment_id);

                    return "Pagamento Efetuado";
                }catch (WebException e){
                    using (WebResponse response1 = e.Response)
                    {
                        using (StreamReader reader = new StreamReader(response1.GetResponseStream()))
                        {
                            string text = reader.ReadToEnd();
                            var post = JObject.Parse(text);
                            var dataError = JsonConvert.DeserializeObject<PagamentoErradoViewModel>(post.ToString());
                            LogsRepository.PostLog($"API ErroDÉBITO: {post}" , user.Idusuario, "0.000.000"); 
                            PedidoRepository.Atualizar_PedidoStatus(pagamento.idPedido, "Não Autorizada");
                            PedidoRepository.Atualizar_PedidoDepoisDoPagamento(pagamento.idPedido, dataError , "Não Autorizada", "Não Autorizada");
                        }
                    }
                    return ("Transação Não Autorizada");
                }
                #endregion
            }
            catch (WebException ex)
            {
                PagamentoReturnViewModel data = new PagamentoReturnViewModel();
                data.status = "Não Autorizada";

                PedidoRepository.Atualizar_PedidoDepoisDoPagamento(pagamento.idPedido, data,"Não Autorizada","Não Autorizada");
                PedidoRepository.Atualizar_PedidoStatus(pagamento.idPedido, "Cancelado");

                return ("Transação Não Autorizada");
            }
        }
    }
#endregion
}
