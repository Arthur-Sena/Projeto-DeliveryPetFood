using System;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Net;
using System.IO;
using Newtonsoft.Json;
using WebApiPetfood.Repositories;
using WebApiPetfood.ViewModel;
using WebApiPetfood.Models;
using Microsoft.AspNetCore.Authorization;

namespace WebApiPetfood.Controllers
{
    [ApiController]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class PagamentoController : ControllerBase
    {
        PagamentoRepository PagamentoRepository = new PagamentoRepository();
        PedidoRepository PedidoRepository = new PedidoRepository();
        EmailRepository EmailRepository = new EmailRepository();
        DashboardRepository DashboardRepository = new DashboardRepository();
        LogsRepository LogsRepository = new LogsRepository();

        //----Autenticacao GetNet---------------------------------
        [HttpGet("GetNet/Token")]
        public IActionResult TokenGetNet()
        {            
            var token = PagamentoRepository.CreateTokenGetNet();
            // return Ok(token.access_token);
            return Ok(token);
        }

        //----Tokenizacao GET---------------------------------
        [HttpGet("GetNet/CardTokenizacao/Card:{CardNumber}")]
        public IActionResult TokenizacaoDoCartaoGetNet(string CardNumber)
        {   
            var token = PagamentoRepository.TokenizacaoGetNet(CardNumber);
            return Ok(token);
        }

        //----Verificacao Do Cartao---------------------------------
        [HttpGet("GetNet/VerificacaoDoCartao")]
        public IActionResult VerificacaoDoCartao(CartaoCredito Card)
        {            
            return Ok(PagamentoRepository.VerificacaoDoCartao(Card));
        }
        
        //----PAGAMENTO GETNET - (CREDITO)---------------------------------
        [Authorize]
        [HttpGet("GetNet/Credito")]
        public IActionResult PaymentCredito(pagamentoViewModel pagamento)
        {            
            return Ok(PagamentoRepository.PayCredito(pagamento));
        }
        
        //----PAGAMENTO GETNET - (Debito)---------------------------------
        [Authorize]
        [HttpGet("GetNet/Debito")]
        public IActionResult PaymentDebito(pagamentoViewModel pagamento)
        {            
            return Ok(PagamentoRepository.PayDebito(pagamento));
        }

        [HttpPost("GetNet/CancelarPagamento:{idPedido}")]
        public IActionResult CancelarPagamento(string idPedido)
        {
            string PayReturn = PagamentoRepository.CancelarPagamento(idPedido);

            if(PayReturn == "Pagamento Cancelado"){
                PedidoRepository.Atualizar_PedidoDepoisDoPagamentoSerCancelado(idPedido, "Não Autorizada");
                EmailRepository.EnviaEmailAposAtualizarPedido("Cancelado", idPedido);
            }
            
            return Ok();
        }

        [HttpPost("GetNet/Pix")]
        public IActionResult PayPix(string idPedido)
        {
            return Ok(PagamentoRepository.PayPix(idPedido));
        }

        [HttpGet("GetNet/VerificarPix")]
        public IActionResult VerificarPagamentoPix(string payment_id)
        {
            return Ok(PagamentoRepository.VerificarPagamentoPix(payment_id));
        }   
        [HttpPost("GetNet/NotifyPix")]
        public IActionResult ConfirmarPagamentoPix(string? payment_type, string? customer_id ,string? order_id,string? payment_id,int? amount, string? status, string? transaction_id,string? transaction_timestamp, string? receiver_psp_name, string? receiver_psp_code, string? receiver_name, string? receiver_cnpj, string? receiver_cpf, string? terminal_nsu, string? description_detail)
        {
            var ip_usuario = "Servidor GetNet";
            var pedido = PedidoRepository.BuscarPorId(order_id);

            switch(status){
                case "APPROVED":
                    EmailRepository.EnviaEmail(pedido[0].idUsuario);
                    EmailRepository.EnviaEmailParaPetshop(pedido[0].idPetshop);
                    PedidoRepository.Atualizar_PedidoStatus(order_id,"Em Analise");
                    DashboardRepository.AtualizarStatusDoPedido(order_id,"Enviado");
                    LogsRepository.PostLog($"Pagamento pix da Compra de Id {pedido[0].Id}, foi Confirmado", pedido[0].idUsuario, ip_usuario);                    
                    return Ok();
                case "DENIED":
                case "ERROR":
                    EmailRepository.EnviaEmailAposAtualizarPedido("Cancelado",pedido[0].Id);
                    PedidoRepository.Atualizar_PedidoStatus(pedido[0].Id, "Cancelado");
                    DashboardRepository.AtualizarStatusDoPedido(order_id,"Cancelado");
                    return Ok();
                default:
                    return Ok();
            }

        }
        
        [HttpGet("GetNet/NotifyPix")]
        public IActionResult ConfirmarPagamentoPixGet(string? payment_type, string? customer_id ,string? order_id,string? payment_id,int? amount, string? status, string? transaction_id,string? transaction_timestamp, string? receiver_psp_name, string? receiver_psp_code, string? receiver_name, string? receiver_cnpj, string? receiver_cpf, string? terminal_nsu, string? description_detail)
        {   
            var ip_usuario = "Servidor GetNet";
            var pedido = PedidoRepository.BuscarPorId(order_id);

            switch(status){
                case "APPROVED":
                    EmailRepository.EnviaEmail(pedido[0].idUsuario);
                    EmailRepository.EnviaEmailParaPetshop(pedido[0].idPetshop);
                    PedidoRepository.Atualizar_PedidoStatus(order_id,"Em Analise");
                    DashboardRepository.AtualizarStatusDoPedido(order_id,"Enviado");
                    LogsRepository.PostLog($"Pagamento pix da Compra de Id {pedido[0].Id}, foi Confirmado", pedido[0].idUsuario, ip_usuario);                    
                    return Ok();
                case "DENIED":
                case "ERROR":
                    EmailRepository.EnviaEmailAposAtualizarPedido("Cancelado",pedido[0].Id);
                    PedidoRepository.Atualizar_PedidoStatus(pedido[0].Id, "Cancelado");
                    DashboardRepository.AtualizarStatusDoPedido(order_id,"Cancelado");
                    return Ok();
                default:
                    return Ok();
            }

        }
        [HttpGet("GetNet/AprovarPixManualmente")]
        public IActionResult AprovarPixManualmente(string pedidoId)
        {
            var ip_usuario = "Pagina de ADM";
            var pedido = PedidoRepository.BuscarPorId(pedidoId);

            PedidoRepository.Atualizar_PedidoStatus(pedidoId,"Em Analise");
            LogsRepository.PostLog($"Compra de Id {pedido[0].Id}, foi Efetuado No Pix", pedido[0].idUsuario, ip_usuario);                    
            EmailRepository.EnviaEmail(pedido[0].idUsuario); 
            EmailRepository.EnviaEmailParaPetshop(pedido[0].idPetshop);
            return Ok();
        }
    }
}