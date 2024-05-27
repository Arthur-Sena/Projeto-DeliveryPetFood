using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using WebApiPetfood.Models;
using WebApiPetfood.Repositories;
using WebApiPetfood.ViewModel;

namespace WebApiPetfood.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class PedidosController : ControllerBase
    {
        PedidoRepository PedidoRepository = new PedidoRepository();
        NotificacaoRepository  NotificacaoRepository = new NotificacaoRepository();
        DashboardRepository DashboardRepository = new DashboardRepository();
        EmailRepository EmailRepository = new EmailRepository();
        PagamentoRepository PagamentoRepository = new PagamentoRepository();
        LogsRepository LogsRepository = new LogsRepository();
        FirebaseRepository FirebaseRepository = new FirebaseRepository();

#region "= = = = = = = = = = = REQUISIÇÕES GET = = = = = = = = = = ="

    #region "Listar Pedido                                          - (HttpGet - /)"
        [Authorize( Roles = "Administrador,Diretor")]
        [HttpGet]
        public IActionResult Listar()
        {
            return Ok(PedidoRepository.Listar());
        }
    #endregion
    #region "Buscar Pedido Por Id                                   - (HttpGet - /{id})"
        [Authorize]
        [HttpGet("{id}")]
        public IActionResult BuscarPorId(string id)
        {
            try
            {
                return Ok(PedidoRepository.BuscarPorId(id));
            }
            catch (Exception e)
            {
                return BadRequest(new { mensagem = e.Message });
            }
        }
    #endregion
    #region "Listar Pedido De Um Usuario                            - (HttpGet - /usuario/{id})"
        [Authorize( Roles = "Cliente,Administrador,Diretor")]
        [HttpGet("usuario/{id:int}")]
        public IActionResult ListarPedidoDoUsuario(int id)
        {
            return Ok(PedidoRepository.ListarPedidosDoUsuario(id));
        }
    #endregion
    #region "Listar Historico De Pedidos Recebidos Por Um Petshop   - (HttpGet - /petshop/{id})"
        [Authorize( Roles = "Petshop,Administrador,Diretor")]
        [HttpGet("petshop/{id:int}")]
        public IActionResult PedidosDoPetshop(int id)
        {
            return Ok(PedidoRepository.HistoricoDePedidosDoPetshop(id));
        }
    #endregion
    #region "Listar Todos os Pedidos Em Andamento                   - (HttpGet - /ADM)"
        [Authorize( Roles = "Administrador,Diretor")]
        [HttpGet("ADM")]
        public IActionResult TodosPedidosEmAndamento()
        {
            return Ok(PedidoRepository.TodosPedidosEmAndamento());
        }
    #endregion
    #region "Listar Pedidos Recebidos Por Um Petshop                - (HttpGet - /Recebidos/{id})"
        [Authorize( Roles = "Petshop,Administrador,Diretor")]
        [HttpGet("Recebidos/{id:int}")]
        public IActionResult ListarPedidosRecebidosPeloPetshop(int id)
        {
            return Ok(PedidoRepository.ListarPedidosRecebidosPeloPetshop(id));
        }
    #endregion
    #region "Listar Pedidos Recebidos Por Um Petshop                - (HttpGet - /emAndamento/Usuario/{id})"
        [Authorize( Roles = "Cliente,Administrador,Diretor")]
        [HttpGet("emAndamento/Usuario/{id:int}")]
        public IActionResult ListarPedidosDoUsuarioEmAndamento(int id)
        {
            return Ok(PedidoRepository.ListarPedidosDoUsuarioEmAndamento(id));
        }
    #endregion
    #region "Listar Pedidos De Um Usuario Que Nao Foram Entregues   - (HttpGet - /DoUsuario:{idUsuario:int}/Para:{idPetshop:int})"    
        [Authorize]
        [HttpGet("DoUsuario:{idUsuario:int}/Para:{idPetshop:int}")]
        public IActionResult PedidosDeUmUsuarioParaDeterminadoPetshop(int idUsuario, int idPetshop)
        {
            return Ok(PedidoRepository.PedidosDeUmUsuarioParaDeterminadoPetshop(idUsuario,idPetshop));
        }
    #endregion
    #region "Listar Pedidos Proximos A Localizacao DO Motoboy       - (HttpGet - /ParaSeremEntregues,lat:{lat},lng:{lng})"    
        [Authorize]
        [HttpGet("ParaSeremEntregues,lat:{lat},lng:{lng}")]
        public IActionResult ListarPedidosParaOMotoboyAceitar(decimal lat, decimal lng, int id)
        {
            if (PedidoRepository.ListarPedidosAceitosPeloMotoboy(id).Count() != 0 ) {
                return Ok(new {
                    Mensagem = "Você já tem uma entrega em andamento" ,
                    Pedidos = PedidoRepository.ListarPedidosPertoDoMotoboyEntrega(lat, lng, id)
                });
            } else {
                return Ok(new {
                    Mensagem = "Você não tem nenhuma entrega em andamento" ,
                    Pedidos = PedidoRepository.ListarPedidosPertoDoMotoboyEntrega(lat, lng, id)
                });
            }
        }
    #endregion
    #region "Listar Pedidos Que O Mtoboy Esta Entregando            - (HttpGet - /emAndamento/Motoboy/{id:int})"    
        [Authorize( Roles = "Motoboy,Administrador,Diretor")]
        [HttpGet("emAndamento/Motoboy/{id:int}")]
        public IActionResult ListarPedidosAceitosPeloMotoboy(int id)
        {
            return Ok(PedidoRepository.ListarPedidosAceitosPeloMotoboy(id));
        }
    #endregion
    #region "Listar Pedidos Entregues Pelo Motoboy                  - (HttpGet - /entregues/{id:int})"    
        [Authorize( Roles = "Motoboy,Administrador,Diretor")]
        [HttpGet("entregues/{id:int}")]
        public IActionResult ListarPedidosEntreguesPeloMotoboy(int id)
        {
            return Ok(PedidoRepository.ListarPedidosEntreguesPeloMotoboy(id));
        }
    #endregion
    #region "Listar Quantidade De Pedidos De Um Petshop             - (HttpGet - /petshop/{id:int}/count)"    
        [Authorize]
        [HttpGet("petshop/{id:int}/count")]
        public IActionResult QuantidadeDePedidos(int id)
        {
            return Ok(PedidoRepository.HistoricoDePedidosDoPetshop(id).Count());
        }
    #endregion
    #region "Listar Pedidos Do Petshop Em Andamento                 - (HttpGet - /pedidosEmAndamento/petshop/{id:int})"             
        [Authorize( Roles = "Petshop,Administrador,Diretor")]
        [HttpGet("pedidosEmAndamento/petshop/{id:int}")]
        public IActionResult ListarPedidosDoPetshopEmAndamento(int id)
        {
            return Ok(PedidoRepository.ListarPedidosDoPetshopEmAndamento(id));
        }
    #endregion
#endregion

#region "= = = = = = = = = = = REQUISIÇÕES PUT = = = = = = = = = = ="

    #region "Atualizar Pedido                                          - (HttpPut - /)"
        [Authorize(Roles="Motoboy,Petshop,Administrador,Diretor")]
        [HttpPut]
        public IActionResult Atualizar(Pedido pedidos)
        {
            try
            {
                PedidoRepository.Atualizar(pedidos);
                DashboardRepository.AtualizarStatusDoPedido(pedidos.Id, pedidos.status);
                EmailRepository.EnviaEmailAposAtualizarPedido(pedidos.status, pedidos.Id);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new { mensagem = e.Message });
            }
        }
    #endregion
    #region "Pedido Aceito Pelo Petshop                                - (HttpPut - /AceitoPeloPetshop)"
        [Authorize(Roles="Petshop,Administrador,Diretor")]
        [HttpPut("AceitoPeloPetshop")]
        public IActionResult AtualizarStatus_AceitoPeloPetshop(Pedido p)
        {
            var pedido = PedidoRepository.BuscarPorId(p.Id)[0];

            try
            {

                var ip = Request.Headers["ip_usuario"];
                PedidoRepository.Atualizar_PetshopAceitouPedido(p.Id);
                DashboardRepository.AtualizarStatusDoPedido(p.Id, "Aceito");
                EmailRepository.EnviaEmailAposAtualizarPedido("Aceito", p.Id);
                
                LogsRepository.PostLogPethop($"Petshop Aceitou o pedido de Id:{p.Id}", pedido.idPetshop , ip); 
                FirebaseRepository.NotificarEntregadoresProximos(pedido.CaminhoDaEntrega.From.Latitude , pedido.CaminhoDaEntrega.From.Longitude);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new { mensagem = e.Message });
            }
        }
#endregion
    #region "Pedido Recusado Pelo Petshop                              - (HttpPut - /RecusadoPeloPetshop)"
        [Authorize(Roles="Petshop,Administrador,Diretor")]
        [HttpPut("RecusadoPeloPetshop")]
        public IActionResult AtualizarStatus_RecusadoPeloPetshop(Pedido p)
        {
            try
            {
                var ip = Request.Headers["ip_usuario"];
                LogsRepository.PostLogPethop($"Petshop Recusou o Pedido de Id:{p.Id}", p.idPetshop , ").0000.0"); 
                PagamentoRepository.CancelarPagamento(p.Id);
                EmailRepository.EnviaEmailAposAtualizarPedido("Cancelado", p.Id);
                PedidoRepository.Atualizar_PetshopRecusouPedido(p.Id);
                DashboardRepository.AtualizarStatusDoPedido(p.Id, "Cancelado");
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new { mensagem = e.Message });
            }
        }
    #endregion
    #region "Cliente Retirou o Produto Na Loja"
        [Authorize(Roles="Petshop,Administrador,Diretor")]
        [HttpPut("ClienteRetirouOProduto")]
        public IActionResult AtualizarClienteRetirouOProdutoNoPetshop(string idPedido)
        {
            var pedido = PedidoRepository.BuscarPorId(idPedido);
            try
            {
                var ip = Request.Headers["ip_usuario"];
                LogsRepository.PostLogPethop($"Cliente Retirou o Pedido de Id:{idPedido}", pedido[0].idPetshop , ip); 
                PedidoRepository.Atualizar_ClienteRetirouOProdutoNoPetshop(idPedido);
                DashboardRepository.AtualizarInformaçõesDoPedido(idPedido);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new { mensagem = e.Message });
            }
        }
    #endregion
    #region "Pedido Cancelado Pelo Adm                                 - (HttpPut - /CanceladoPeloAdm)"
        [Authorize(Roles="Administrador,Diretor")]
        [HttpPut("CanceladoPeloAdm")]
        public IActionResult AtualizarStatus_RecusadoPeloAdm(Pedido p)
        {
            try
            {
                var ip = Request.Headers["ip_usuario"];
                // LogsRepository.PostLogPethop($"Adm Recusou o Pedido de Id:{p.Id}", p.idPetshop , ip); 
                PagamentoRepository.CancelarPagamento(p.Id);
                EmailRepository.EnviaEmailAposAtualizarPedido("Cancelado", p.Id);
                PedidoRepository.Atualizar_PetshopRecusouPedido(p.Id);
                DashboardRepository.AtualizarStatusDoPedido(p.Id, "Cancelado");
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new { mensagem = e.Message });
            }
        }
#endregion
    #region "Pedido Cancelado Pelo Cliente                             - (HttpPut - /CanceladoPeloCliente)"
        [Authorize]
        [HttpPut("CanceladoPeloCliente")]
        public IActionResult AtualizarStatus_RecusadoPeloCliente(Pedido p)
        {
            try
            {
                var ip = Request.Headers["ip_usuario"];
                LogsRepository.PostLog($"Cliente Recusou o Pedido de Id:{p.Id}", p.idUsuario , "00.0000"); 
                PagamentoRepository.CancelarPagamento(p.Id);
                EmailRepository.EnviaEmailAposAtualizarPedido("Cancelado", p.Id);
                PedidoRepository.Atualizar_ClienteRecusouPedido(p.Id);
                DashboardRepository.AtualizarStatusDoPedido(p.Id, "Cancelado");
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new { mensagem = e.Message });
            }
        }
#endregion
    #region "Entrega Iniciada Por Entregadores Particulares do Petshop"
    [Authorize(Roles="Petshop,Administrador,Diretor")]
        [HttpPut("EntregaIniciadaPeloPetshop")]
        public IActionResult Atualizado_EntregaIniciadaPeloPetshop(Pedido pedidos)
        {
            try
            {
                PedidoRepository.Atualizar_ProdutoJaRetirado(pedidos);
                EmailRepository.EnviaEmailAposRetirarPedido(pedidos.Id, "Entregando..");
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new { mensagem = e.Message });
            }
        }
        [Authorize(Roles="Petshop,Administrador,Diretor")]
        [HttpPut("PedidoEntreguePeloPetshop")]
        public IActionResult Atualizar_PedidoEntreguePeloPetshop(Pedido pedidos)
        {
            try
            {                 
                PedidoRepository.Atualizar_PedidoEntregue(pedidos.Id);
                DashboardRepository.AtualizarInformaçõesDoPedido(pedidos.Id);
                EmailRepository.EnviaEmailAposRetirarPedido(pedidos.Id, "Entregue");
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new { mensagem = e.Message });
            }
        }
    #endregion
    
    
    
    #region "Pedido Aceito Pelo Motoboy                                - (HttpPut - /AceitoPeloMotoboy)"
        [Authorize( Roles = "Motoboy,Administrador,Diretor")]
        [HttpPut("AceitoPeloMotoboy")]
        public IActionResult Atualizado_AceitoPeloEntregador(Pedido pedidos)
        {
            try
            {
                PedidoRepository.Atualizar_PedidoAceitoPeloMotoboy(pedidos); 
                LogsRepository.PostLogMotoboy($"Motoboy de Id {pedidos.IdMotoboy} ,Aceitou Pedido de Id {pedidos.Id}", pedidos.IdMotoboy, Request.Headers["ip_usuario"]); 
                DashboardRepository.AtualizarEntregadorDoPedido(pedidos.Id , pedidos.IdMotoboy);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new { mensagem = e.Message });
            }
        }
#endregion
    #region "Atuaizar Pedido Quando o Produto For Retirado no Petshop  - (HttpPut - /ProdutosJaRetirado)"
        [Authorize(Roles="Motoboy,Administrador,Diretor")]
        [HttpPut("ProdutosJaRetirado")]
        public IActionResult Atualizado_ProdutosJaRetirado(Pedido pedidos)
        {
            try
            {
                PedidoRepository.Atualizar_ProdutoJaRetirado(pedidos);
                EmailRepository.EnviaEmailAposRetirarPedido(pedidos.Id, "Entregando..");
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new { mensagem = e.Message });
            }
        }
#endregion
    #region "Atualizar Status do Pedido Entregue No MongoDB            - (HttpPut - /PedidoEntregue)" 
        [Authorize(Roles="Motoboy,Administrador,Diretor")]
        [HttpPut("PedidoEntregue")]
        public IActionResult Atualizar_PedidoEntregue(Pedido pedidos)
        {
            try
            { 
                PedidoRepository.Atualizar_PedidoEntregue(pedidos.Id);
                DashboardRepository.AtualizarInformaçõesDoPedido(pedidos.Id);
                EmailRepository.EnviaEmailAposRetirarPedido(pedidos.Id, "Entregue");
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new { mensagem = e.Message });
            }
        }
#endregion
    #region "Atualizar Status Do infoPedido Entregue                   - (HttpPut - /idPedido/{idDoPedido})
        [Authorize]
        [HttpPut("idPedido/{id}")]
        public IActionResult Atualizar_InfoPedidoEntregue(string id)
        {
            try
            {
                DashboardRepository.AtualizarInformaçõesDoPedido (id);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new { mensagem = e.Message });
            }
        }
#endregion
    #region "Atualizar Status do Pedido Avaliado Pelo Usuario          - (HttpPut - /Avaliado)" 
        [Authorize]
        [HttpPut("Avaliado")]
        public IActionResult Atualizar_PedidoAvaliado(Pedido pedidos)
        {
            try
            {
                PedidoRepository.Atualizar_PedidoAvaliado(pedidos);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(new { mensagem = e.Message });
            }
        }
#endregion
    #region "Fazer Um Pedido No APP                                    - (PostPedido)"
        [Authorize]
        [HttpPost]
        public IActionResult Cadastrar(pedidoViewModel p)
        {
            var ip_usuario = Request.Headers["ip_usuario"];
            string idPedido = PedidoRepository.Cadastrar(p.pedido);
            
            try
            {        
                pagamentoViewModel pay = new pagamentoViewModel();
                if(p.pedido.pagamento.Tipo != "Pix"){
                    pay.cartao = p.cartao;
                    pay.idPedido = idPedido;
                }

                InfoPedido info = new InfoPedido();
                info.codigoDePedido = idPedido;
                info.dataDoPedido = p.pedido.dataPedido;
                info.Distancia = Convert.ToSingle(p.pedido.Distancia);
                info.idPetshop = p.pedido.idPetshop;
                info.idUsuario = p.pedido.idUsuario;
                info.idEndereco = p.pedido.idEndereco;
                info.PrecoFrete = Math.Round(p.pedido.Frete, 2);
                info.PrecoProduto = Math.Round(p.pedido.PrecoDoProduto, 2);
                info.PrecoTotal = Math.Round(p.pedido.preco, 2);
                info.Pagamento = p.pedido.pagamento.Tipo; 
                info.idEntregador = 0;
 
                string pagamento;
                switch (p.pedido.pagamento.Tipo)
                {
                    case "Credito":
                    case "Crédito":
                        pagamento = PagamentoRepository.PayCredito(pay);
                        info.Status = pagamento != "Transação Não Autorizada" ? "Enviado" : "Cancelado";
                        
                        if(info.Status == "Enviado"){
                            DashboardRepository.CadastrarInformaçõesDoPedido(info);
                            EmailRepository.EnviaEmail(p.pedido.idUsuario);
                            EmailRepository.EnviaEmailParaPetshop(p.pedido.idPetshop);
                            LogsRepository.PostLog($"Compra de Id {idPedido}, foi Efetuado No Crédito", p.pedido.idUsuario, ip_usuario); 
                        } else {
                            LogsRepository.PostLog($"Compra de Id {idPedido}, não foi autorizada (Crédito)", p.pedido.idUsuario, ip_usuario); 
                        }
                        return Ok(pagamento);            
                    case "Debito":
                    case "Débito":
                        pagamento = PagamentoRepository.PayDebito(pay);
                        info.Status = pagamento != "Transação Não Autorizada"? "Enviado":"Cancelado";
                        if(info.Status == "Enviado"){
                            DashboardRepository.CadastrarInformaçõesDoPedido(info);
                            EmailRepository.EnviaEmail(p.pedido.idUsuario); 
                            EmailRepository.EnviaEmailParaPetshop(p.pedido.idPetshop);
                            LogsRepository.PostLog($"Compra de Id {idPedido}, foi Efetuado No Débito", p.pedido.idUsuario, ip_usuario); 
                        } else {
                            LogsRepository.PostLog($"Compra de Id {idPedido}, não foi autorizada (Débito)", p.pedido.idUsuario, ip_usuario); 
                        }
                        return Ok(pagamento);
                    case "Pix":
                    case "pix":
                        var response = PagamentoRepository.PayPix(idPedido);
                        info.Status = response.ToString() != "Transação Não Autorizada"? "Aguardando Pagamento":"Cancelado";
                        if(info.Status == "Aguardando Pagamento"){
                            DashboardRepository.CadastrarInformaçõesDoPedido(info);
                            PedidoRepository.Atualizar_PedidoStatus(idPedido, "Aguardando Pagamento");
                            LogsRepository.PostLog($"Compra de Id {idPedido}, foi Efetuado No Pix", p.pedido.idUsuario, ip_usuario); 
                            return Ok(response);
                        } else {
                            LogsRepository.PostLog($"Compra de Id {idPedido}, não foi autorizada (Pix)", p.pedido.idUsuario, ip_usuario); 
                            return Ok("Transação Não Autorizada");
                        }
                    case "Cartão na Hora da Entrega":
                        info.Status = "Enviado";
                        DashboardRepository.CadastrarInformaçõesDoPedido(info);
                        PedidoRepository.Atualizar_PedidoStatus(idPedido, "Em Analise");
                        EmailRepository.EnviaEmail(p.pedido.idUsuario);
                        EmailRepository.EnviaEmailParaPetshop(p.pedido.idPetshop);
                        LogsRepository.PostLog($"Compra de Id {idPedido}, foi Efetuado e o Pagamento Sera no Cartao Durante a Entrega", p.pedido.idUsuario, ip_usuario); 
                        return Ok("Pagamento Efetuado");
                    case "Débito/Crédito por link":
                        info.Status = "Enviado";
                        DashboardRepository.CadastrarInformaçõesDoPedido(info);
                        PedidoRepository.Atualizar_PedidoStatus(idPedido, "Aguardando Pagamento");
                        LogsRepository.PostLog($"Compra de Id {idPedido}, foi Efetuado e o Pagamento sera pelo link da GetNet", p.pedido.idUsuario, ip_usuario); 
                        return Ok("Pagamento Efetuado");
                    default:
                        PedidoRepository.Atualizar_PedidoStatus(idPedido, "Cancelado");
                        LogsRepository.PostLog($"Pedido de id: {idPedido} foi cancelado", p.pedido.idUsuario, ip_usuario); 
                        info.Status = "Cancelado";
                        DashboardRepository.CadastrarInformaçõesDoPedido(info);

                        return Ok("Transação Não Autorizada");
                }
            }
            catch (Exception e)
            {
                PedidoRepository.Atualizar_PedidoStatus(idPedido, "Cancelado");
                return Ok("Erro ao Concluir Pedido");
            }
        }
#endregion
#endregion
    }
}
