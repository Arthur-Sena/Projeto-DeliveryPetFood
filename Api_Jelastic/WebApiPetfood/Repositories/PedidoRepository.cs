using Microsoft.Extensions.Hosting;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using WebApiPetfood.Models;

namespace WebApiPetfood.Repositories
{
    public class PedidoRepository
    {
#region "Models e Banco de Dados"
        db_petfoodContext ctx = new db_petfoodContext();
        private readonly IMongoCollection<Pedido> _pedidos;
        NotificacaoRepository NotificacaoRepository = new NotificacaoRepository();
        LogsRepository LogsRepository = new LogsRepository();
        public PedidoRepository()
        {
            var client = new MongoClient("mongodb://admin:nntz32C2i4@10.100.34.181:27017,10.100.34.209:27017,10.100.34.208:27017/?replicaSet=rs0&authSource=admin&readPreference=primary&w=majority");
            var database = client.GetDatabase("petfood");
            _pedidos = database.GetCollection<Pedido>("Pedido");
        }
    #endregion
        
#region "Cadastrar Pedido"
        public string Cadastrar(Pedido pedido)
        {
            _pedidos.InsertOne(pedido);
            return pedido.Id;
        }
#endregion
#region "Funções de PUT (ATUALIZACAO) DO PEDIDO, ATUALIZAR STATUS, FORMA DE PAGAMENTO, ETC"
        public void Atualizar(Pedido pedido)
        {
            var filter = Builders<Pedido>.Filter.Eq(s => s.Id, pedido.Id);

            var update = Builders<Pedido>.Update
            .Set(x => x.status, pedido.status)
            .Set(x => x.IdMotoboy, pedido.IdMotoboy)
            .Set(x => x.horaDeEntrega_Retirada.HorarioEmQueFoiAceito, pedido.horaDeEntrega_Retirada.HorarioEmQueFoiAceito)
            .Set(x => x.horaDeEntrega_Retirada.HorarioEmQueFoiAceitoPeloEntregador, pedido.horaDeEntrega_Retirada.HorarioEmQueFoiAceitoPeloEntregador)
            .Set(x => x.horaDeEntrega_Retirada.HorarioDaRetirada, pedido.horaDeEntrega_Retirada.HorarioDaRetirada)
            .Set(x => x.horaDeEntrega_Retirada.HorarioDaEntrega, pedido.horaDeEntrega_Retirada.HorarioDaEntrega);

            var result = _pedidos.UpdateOne(filter, update);
        }
        public void Atualizar_PedidoAceitoPeloMotoboy(Pedido pedido)
        {
            var pedidoBuscado = BuscarPorId(pedido.Id);
            if(pedidoBuscado[0].IdMotoboy == 0){
                var filter = Builders<Pedido>.Filter.Eq(s => s.Id, pedido.Id);
                var update = Builders<Pedido>.Update
                .Set(x => x.status, "Preparando Entrega")
                .Set(x => x.IdMotoboy, pedido.IdMotoboy)
                .Set(x => x.horaDeEntrega_Retirada.HorarioEmQueFoiAceitoPeloEntregador, DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"));

                var result = _pedidos.UpdateOne(filter, update);
            }
        }
        public void Atualizar_ProdutoJaRetirado(Pedido pedido)
        {
            var filter = Builders<Pedido>.Filter.Eq(s => s.Id, pedido.Id);

            var update = Builders<Pedido>.Update
            .Set(x => x.status, "Entregando..")
            .Set(x => x.horaDeEntrega_Retirada.HorarioDaRetirada, DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"));

            var result = _pedidos.UpdateOne(filter, update);
        }
        public void Atualizar_PedidoEntregue(string Id)
        {
            var pedido =  _pedidos.Find(x => x.Id == Id).FirstOrDefault();
            var filter = Builders<Pedido>.Filter.Eq(s => s.Id, Id);

            var update = Builders<Pedido>.Update
            .Set(x => x.status, "Entregue")
            .Set(x => x.horaDeEntrega_Retirada.HorarioDaEntrega, DateTime.Now.ToString("MM/dd/yyyy H:mm"));

            string host = Dns.GetHostName();
            string ip = Dns.GetHostAddresses(host)[2].ToString();

            switch(pedido.idLogistica){
                case 1:
                    LogsRepository.PostLogMotoboy($"Motoboy de Id {pedido.IdMotoboy}, Entregou o Pedido de Id {pedido.Id}", pedido.IdMotoboy, ip); 
                    break;
                case 2:
                case 3:
                    LogsRepository.PostLogPethop($"Entregador Particular do Petshop de Id {pedido.idPetshop}, Entregou o Pedido de Id {pedido.Id}", pedido.idPetshop, ip); 
                    break;
            }
            var result = _pedidos.UpdateOne(filter, update);
        }
        public void Atualizar_PedidoAvaliado(Pedido pedido)
        {
            var filter = Builders<Pedido>.Filter.Eq(s => s.Id, pedido.Id);

            var update = Builders<Pedido>.Update
            .Set(x => x.status, "Concluido");

            var result = _pedidos.UpdateOne(filter, update);
        }
        public void Atualizar_PedidoStatus(string id, string status)
        {
            var filter = Builders<Pedido>.Filter.Eq(s => s.Id, id);

            var update = Builders<Pedido>.Update
            .Set(x => x.status, status);

            var result = _pedidos.UpdateOne(filter, update);
        }

        public void Atualizar_PetshopAceitouPedido(string id)
        {
            var pedido = _pedidos.Find(x => x.Id == id).FirstOrDefault();

            if(pedido.RetirarNaLoja == false){
                var filter = Builders<Pedido>.Filter.Eq(s => s.Id, id);
                var update = Builders<Pedido>.Update
                .Set(x => x.status, "Aceito")
                .Set(x => x.horaDeEntrega_Retirada.HorarioEmQueFoiAceito, DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"));
                var result = _pedidos.UpdateOne(filter, update);
            } else {
                var filter = Builders<Pedido>.Filter.Eq(s => s.Id, id);
                var update = Builders<Pedido>.Update
                .Set(x => x.status, "Pronto para Retirar")
                .Set(x => x.horaDeEntrega_Retirada.HorarioEmQueFoiAceito, DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"));
                var result = _pedidos.UpdateOne(filter, update);
            }
        }
        public void Atualizar_PetshopRecusouPedido(string id)
        {
            var filter = Builders<Pedido>.Filter.Eq(s => s.Id, id);

            var update = Builders<Pedido>.Update
            .Set(x => x.status, "Cancelado")
            .Set(x => x.horaDeEntrega_Retirada.HorarioEmQueFoiAceito, DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"));
            var result = _pedidos.UpdateOne(filter, update);

            var pedido = _pedidos.Find(x => x.Id == id).ToList();

            // if(pedido[0].pagamento.Tipo == "Pix"){
            //     Usuario u = ctx.Usuarios.FirstOrDefault(x => x.Idusuario == pedido[0].idUsuario);
            //     u.Carteiradigital = Math.Round((u.Carteiradigital + pedido[0].preco) , 2);
            //     ctx.Update(u);
            //     ctx.SaveChanges();
            // }

        }
        public void Atualizar_ClienteRetirouOProdutoNoPetshop(string id)
        {
            var filter = Builders<Pedido>.Filter.Eq(s => s.Id, id);
            var update = Builders<Pedido>.Update
            .Set(x => x.status, "Entregue")
            .Set(x => x.horaDeEntrega_Retirada.HorarioDaEntrega, DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"));
            var result = _pedidos.UpdateOne(filter, update);
        }
        public void Atualizar_ClienteRecusouPedido(string id)
        {

            var pedido = _pedidos.Find(x => x.Id == id).ToList();
            
            if(pedido[0].status =="Em Analise" || pedido[0].status == "Aguardando Pagamento"){
                var filter = Builders<Pedido>.Filter.Eq(s => s.Id, id);

                var update = Builders<Pedido>.Update
                .Set(x => x.status, "Cancelado")
                .Set(x => x.horaDeEntrega_Retirada.HorarioEmQueFoiAceito, DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"));
                var result = _pedidos.UpdateOne(filter, update);
            } 

            // if(pedido[0].pagamento.Tipo == "Pix"){
            //     Usuario u = ctx.Usuarios.FirstOrDefault(x => x.Idusuario == pedido[0].idUsuario);
            //     u.Carteiradigital = Math.Round((u.Carteiradigital + pedido[0].preco) , 2);
            //     ctx.Update(u);
            //     ctx.SaveChanges();
            // }
        }
        public void Atualizar_PedidoDepoisDoPagamento(string id, object info, string status, string pay)
        {
            var filter = Builders<Pedido>.Filter.Eq(s => s.Id, id);

            var update = Builders<Pedido>.Update
            .Set(x => x.pagamento.informacoes, info)
            .Set(x => x.pagamento.payment_id, pay)
            .Set(x => x.pagamento.Status, status)
            .Set(x => x.pagamento.Data, DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"));

            var result = _pedidos.UpdateOne(filter, update);
        }
        
        public void Atualizar_PedidoDepoisDoPagamentoSerCancelado(string id, string status)
        {
            var filter = Builders<Pedido>.Filter.Eq(s => s.Id, id);

            var update = Builders<Pedido>.Update
            .Set(x => x.pagamento.Status, status);

            var result = _pedidos.UpdateOne(filter, update);
        }
#endregion
#region "Listar Pedidos
        public List<Pedido> Listar()
        {
            return _pedidos.Find(l => true).ToList();
        }
        public List<Pedido> ListarPedidosDoMes(string mes, string year, int idPetshop)
        {
            return _pedidos.Find(x => x.dataPedido.Contains($"{mes}/{year}") && x.idPetshop == idPetshop && x.status != "Cancelado" && x.status != "Em Analise").ToList();
        }        
        public List<Pedido> BuscarPorId(string id)
        {
            return _pedidos.Find(x => x.Id == id).ToList();
        }
    #endregion
#region "Historico de Pedidos do Petshop"
        public List<Pedido> HistoricoDePedidosDoPetshop(int id)
        {
            return _pedidos.Find(x => x.idPetshop == id  && x.status != "Aguardando Pagamento"  && x.status != "Não Autorizada").ToList();
        }
        public List<Pedido> ListarPedidosRecebidosPeloPetshop(int id)
        {
            return _pedidos.Find(s => s.idPetshop == id && (s.status != "Entregue" && s.status != "Cancelado" && s.status != "Aguardando Pagamento" && s.status != "Concluido"  && s.status != "Não Autorizada")).ToList();
        }
        public List<Pedido> PedidosDeUmUsuarioParaDeterminadoPetshop(int idUsuario, int idPetshop)
        {
            return _pedidos.Find(s => s.idUsuario == idUsuario && s.idPetshop == idPetshop && (s.status != "Entregue" && s.status != "Aguardando Pagamento" && s.status != "Cancelado" && s.status != "Não Autorizada")).ToList();
        }

        public int ListarPedidosDoPetshopEmAndamento(int id)
        {
            var pedidos = _pedidos.Find(s => s.idPetshop == id && (s.status != "Entregue" && s.status != "Em Analise" && s.status != "Concluido" && s.status != "Cancelado" )).ToList();
            return pedidos.Count();
        }
    #endregion
#region "Listar Pedidos Do Usuario"
        public List<Pedido> ListarPedidosDoUsuario(int id)
        {
            var pedido = _pedidos.Find(x => x.idUsuario == id).ToList();
            return pedido;
        }
       #endregion
#region "Listar Pedidos Em Andamento - Tela de ADM"
        public List<Pedido> TodosPedidosEmAndamento()
        {
            return _pedidos.Find(s => s.status != "Entregue" && s.status != "Cancelado" && s.status != "Concluido"  && s.status != "Não Autorizada").ToList();
        }
    #endregion
#region "Listar Pedidos em Andamento Ainda Nao Entregues"
        public List<Pedido> ListarPedidosDoUsuarioEmAndamento(int id)
        {
            var hoje = DateTime.Now.ToString("dd/MM/yyyy");
            var ontem = DateTime.Today.AddDays(-1).ToString("dd/MM/yyyy");

            return _pedidos.Find(s => s.idUsuario == id && (s.status == "Em Analise" || s.status == "Pronto para Retirar" || s.status == "Aguardando Pagamento" ||s.status == "Aceito" || s.status == "Entregando.." || s.status == "Preparando Entrega" || (s.status == "Entregue" && (s.dataPedido == hoje || s.dataPedido == ontem)) || (s.status == "Cancelado" && (s.dataPedido == hoje || s.dataPedido == ontem)) )).ToList();
        }
#endregion
#region "LISTAR PEDIDOS PERTO DO MOTOBOY(PEDIDOS PRONTOS PARA SEREM ENTREGUES"
        public List<Pedido> ListarPedidosPertoDoMotoboyEntrega(decimal lat, decimal lng,int id)
        {
            LocalizacaoMotoboy local = new LocalizacaoMotoboy();
            local.Data = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
            local.Latitude = lat.ToString();
            local.Longitude = lng.ToString();
            local.idMotoboy = id;
            ctx.LocalizacaoMotoboys.Add(local);
            ctx.SaveChanges();

            decimal latMax = lat + Convert.ToDecimal(0.2);
            decimal latMin = lat - Convert.ToDecimal(0.2);
            decimal lngMax = lng + Convert.ToDecimal(0.2);
            decimal lngMin = lng - Convert.ToDecimal(0.2);

            var query = _pedidos.AsQueryable<Pedido>()
            .Where(x => x.status == "Aceito" && x.idLogistica == 1 && (
                latMin >= x.CaminhoDaEntrega.From.Latitude &&
                latMax <= x.CaminhoDaEntrega.From.Latitude
            ) && (
                lngMin >= x.CaminhoDaEntrega.From.Longitude &&
                lngMax <= x.CaminhoDaEntrega.From.Longitude
            )
            );
            return query.ToList();
        }
#endregion
#region "BUSCAR PEDIDO QUE O MOTOBOY ESTA ENTREGANDO"
        public List<Pedido> ListarPedidosAceitosPeloMotoboy(int id)
        {
            return _pedidos.Find(s => s.IdMotoboy == id && (s.status == "Preparando Entrega" || s.status == "Entregando..")).ToList();
        }
#endregion
#region "Listar Pedidos Entregues Pelo Motoboy"
        // public List<Pedido> ListarPedidosEntreguesPeloMotoboy(int id)
        // {
        //     return _pedidos.Find(s => s.IdMotoboy == id && (s.status == "Concluido" || s.status == "Entregue")).ToList();
        // }

        public List<Pedido> ListarPedidosEntreguesPeloMotoboy(int id)
        {
            return _pedidos.Find(s => s.IdMotoboy == id && (s.status == "Concluido" || s.status == "Entregue")).ToList();
        }
    
    #endregion
    }
}