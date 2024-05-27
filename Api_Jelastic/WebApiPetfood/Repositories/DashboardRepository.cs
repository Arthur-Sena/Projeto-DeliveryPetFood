using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using WebApiPetfood.Models;
using WebApiPetfood.ViewModels;

namespace WebApiPetfood.Repositories
{
    public class DashboardRepository
    {
        #region "Models e Banco de Dados"
        db_petfoodContext ctx = new db_petfoodContext();
        private readonly IMongoCollection<Pedido> _pedidos;
        NotificacaoRepository NotificacaoRepository = new NotificacaoRepository();
        public DashboardRepository()
        {
            var client = new MongoClient("mongodb://admin:nntz32C2i4@10.100.34.181:27017,10.100.34.209:27017,10.100.34.208:27017/?replicaSet=rs0&authSource=admin&readPreference=primary&w=majority");
            var database = client.GetDatabase("petfood");
            _pedidos = database.GetCollection<Pedido>("Pedido");
        }
    #endregion
        
#region "Frete Gratis"
        public float APartirDessePrecoOFreteEGratuito()
        {
            return ctx.FreteGratiss.First().Preco;
        }
        public void APartirDesseNovoPrecoOFreteEGratuito(float preco)
        {
            FreteGratis FreteBuscado =  ctx.FreteGratiss.First();
            FreteBuscado.Preco = preco;
            ctx.Update(FreteBuscado);
            ctx.SaveChanges();
        }
    #endregion
#region "Logistica do Petshop"
        public List<LogisticaDoPetshop>  TiposDeEntregaPossiveis()
        {
            return ctx.LogisticaDoPetshops.ToList();
        }        
#endregion
#region "Listar/Cadastrar/Atualizar/Deletar - Frete"
        public List<Frete> listarFrete()
        {
            return ctx.Fretes.FromSqlRaw("SELECT * FROM frete").OrderBy(x => x.Distancia).ToList();
        }

        public void CadastrarFrete(Frete frete)
        {
            ctx.Fretes.Add(frete);
            ctx.SaveChanges();
        }

        public void AtualizarFrete(Frete frete)
        {
            Frete FreteBuscado = ctx.Fretes.FirstOrDefault(x => x.idFrete == frete.idFrete);
            FreteBuscado.Distancia = frete.Distancia;
            FreteBuscado.Preco = frete.Preco;
            ctx.Update(FreteBuscado);
            ctx.SaveChanges();
        }
        public void DeletarFrete(int id)
        {
            Frete frete = ctx.Fretes.Find(id);
            ctx.Fretes.Remove(frete);
            ctx.SaveChanges();
        }
    #endregion

#region "Cadastrar/Atualizar Informacoes do Pedido"        
        public void CadastrarInformaçõesDoPedido(InfoPedido info)
        {
            ctx.InfoPedidos.Add(info);
            ctx.SaveChanges();
        }

        public void AtualizarStatusDoPedido(string id, string info)
        {
            Console.WriteLine(info);
            InfoPedido infoBuscada = ctx.InfoPedidos.FirstOrDefault(x => x.codigoDePedido == id);
            infoBuscada.Status = info;
            ctx.Update(infoBuscada);
            ctx.SaveChanges();
        }
        public void AtualizarInformaçõesDoPedido(string info)
        {
            InfoPedido infoBuscada = ctx.InfoPedidos.FirstOrDefault(x => x.codigoDePedido == info);
            infoBuscada.Status = "Concluido";
            ctx.Update(infoBuscada);
            ctx.SaveChanges();
        }
        public void AtualizarEntregadorDoPedido(string id, int idEntregador)
        {
            InfoPedido infoBuscada = ctx.InfoPedidos.FirstOrDefault(x => x.codigoDePedido == id);
            infoBuscada.idEntregador = idEntregador;
            ctx.Update(infoBuscada);
            ctx.SaveChanges();
        }
    #endregion
        public List<InfoPedido> InformacoesDosPedidos()
        {
            return ctx.InfoPedidos.ToList();
        }
#region "Faturamento"
        public List<ProdutoViewModel> RetornarValores()
        {
            List<ProdutoViewModel> listProdutos = (from p in ctx.InfoPedidos.Where(x => x.Status == "Aceito" || x.Status == "Concluido")
                                                   select new ProdutoViewModel
                                                   {
                                                       PrecoFrete = p.PrecoFrete,
                                                       PrecoProduto = p.PrecoProduto,
                                                       PrecoTotal = p.PrecoTotal
                                                   }).ToList();
            return listProdutos; 
        }

        public FaturamentoViewModel FaturamentoDetalhadoPetfood()
        {
            List<ProdutoViewModel> listProdutos = (from p in ctx.InfoPedidos.Where(x => x.Status == "Aceito" || x.Status == "Concluido")
                                                   select new ProdutoViewModel
                                                   {
                                                       PrecoFrete = p.PrecoFrete,
                                                       PrecoProduto = p.PrecoProduto,
                                                       PrecoTotal = p.PrecoTotal
                                                   }).ToList();
            
            FaturamentoViewModel Faturamento = new FaturamentoViewModel();
            Faturamento.PrecoFrete = listProdutos.Sum(x => x.PrecoFrete);
            Faturamento.PrecoProduto = listProdutos.Sum(x => x.PrecoProduto);
            Faturamento.PrecoTotal = listProdutos.Sum(x => x.PrecoTotal);
            Faturamento.LucroPetshop = Math.Round(( (listProdutos.Sum(x => x.PrecoProduto)) * Convert.ToDecimal(0.86)), 2);
            Faturamento.LucroPetFood = Math.Round(( (listProdutos.Sum(x => x.PrecoProduto)) * Convert.ToDecimal(0.14)), 2);
            
            return Faturamento; 
        }
    
        public List<FaturamentoViewModel> FaturamentoQuinzenalDoPetshop(int mes,int year, int idPetshop)
        {
            var PrimeiraQuinzena = ctx.InfoPedidos.Where(i => i.Status == "Concluido" && i.idPetshop == idPetshop && (
                i.dataDoPedido.Contains($"01/{mes}/{year}") ||
                i.dataDoPedido.Contains($"02/{mes}/{year}") ||
                i.dataDoPedido.Contains($"03/{mes}/{year}") ||
                i.dataDoPedido.Contains($"04/{mes}/{year}") ||
                i.dataDoPedido.Contains($"05/{mes}/{year}") ||
                i.dataDoPedido.Contains($"06/{mes}/{year}") ||
                i.dataDoPedido.Contains($"07/{mes}/{year}") ||
                i.dataDoPedido.Contains($"08/{mes}/{year}") ||
                i.dataDoPedido.Contains($"09/{mes}/{year}") ||
                i.dataDoPedido.Contains($"10/{mes}/{year}") ||
                i.dataDoPedido.Contains($"11/{mes}/{year}") ||
                i.dataDoPedido.Contains($"12/{mes}/{year}") ||
                i.dataDoPedido.Contains($"13/{mes}/{year}") ||
                i.dataDoPedido.Contains($"14/{mes}/{year}") ||
                i.dataDoPedido.Contains($"15/{mes}/{year}")
            )).ToList(); 

            var SegundaQuinzena = ctx.InfoPedidos.Where(i => i.Status == "Concluido" && i.idPetshop == idPetshop && (
                i.dataDoPedido.Contains($"16/{mes}/{year}") ||
                i.dataDoPedido.Contains($"17/{mes}/{year}") ||
                i.dataDoPedido.Contains($"18/{mes}/{year}") ||
                i.dataDoPedido.Contains($"19/{mes}/{year}") ||
                i.dataDoPedido.Contains($"20/{mes}/{year}") ||
                i.dataDoPedido.Contains($"21/{mes}/{year}") ||
                i.dataDoPedido.Contains($"22/{mes}/{year}") ||
                i.dataDoPedido.Contains($"23/{mes}/{year}") ||
                i.dataDoPedido.Contains($"24/{mes}/{year}") ||
                i.dataDoPedido.Contains($"25/{mes}/{year}") ||
                i.dataDoPedido.Contains($"26/{mes}/{year}") ||
                i.dataDoPedido.Contains($"27/{mes}/{year}") ||
                i.dataDoPedido.Contains($"28/{mes}/{year}") ||
                i.dataDoPedido.Contains($"29/{mes}/{year}") ||
                i.dataDoPedido.Contains($"30/{mes}/{year}") ||
                i.dataDoPedido.Contains($"31/{mes}/{year}")
            )).ToList(); 
        
            FaturamentoViewModel Faturamento1 = new FaturamentoViewModel();
            Faturamento1.PrecoFrete = PrimeiraQuinzena.Sum(x => x.PrecoFrete);
            Faturamento1.PrecoProduto = PrimeiraQuinzena.Sum(x => x.PrecoProduto);
            Faturamento1.PrecoTotal = PrimeiraQuinzena.Sum(x => x.PrecoTotal);
            Faturamento1.LucroPetshop = Math.Round(( (PrimeiraQuinzena.Sum(x => x.PrecoProduto)) * Convert.ToDecimal(0.86)), 2);
            Faturamento1.LucroPetFood = Math.Round(( (PrimeiraQuinzena.Sum(x => x.PrecoProduto)) * Convert.ToDecimal(0.14)), 2);
        
            FaturamentoViewModel Faturamento2 = new FaturamentoViewModel();
            Faturamento2.PrecoFrete = SegundaQuinzena.Sum(x => x.PrecoFrete);
            Faturamento2.PrecoProduto = SegundaQuinzena.Sum(x => x.PrecoProduto);
            Faturamento2.PrecoTotal = SegundaQuinzena.Sum(x => x.PrecoTotal);
            Faturamento2.LucroPetshop = Math.Round(( (SegundaQuinzena.Sum(x => x.PrecoProduto)) * Convert.ToDecimal(0.86)), 2);
            Faturamento2.LucroPetFood = Math.Round(( (SegundaQuinzena.Sum(x => x.PrecoProduto)) * Convert.ToDecimal(0.14)), 2);
        
            List<FaturamentoViewModel> list = new List<FaturamentoViewModel>();
            list.Add(Faturamento1);
            list.Add(Faturamento2);
            return list;
        }
        public List<FaturamentoViewModel> FaturamentoQuinzenalPetfood(int mes,int year)
        {
            var PrimeiraQuinzena = ctx.InfoPedidos.Where(i => i.Status == "Concluido" && (
                i.dataDoPedido.Contains($"01/{mes}/{year}") ||
                i.dataDoPedido.Contains($"02/{mes}/{year}") ||
                i.dataDoPedido.Contains($"03/{mes}/{year}") ||
                i.dataDoPedido.Contains($"04/{mes}/{year}") ||
                i.dataDoPedido.Contains($"05/{mes}/{year}") ||
                i.dataDoPedido.Contains($"06/{mes}/{year}") ||
                i.dataDoPedido.Contains($"07/{mes}/{year}") ||
                i.dataDoPedido.Contains($"08/{mes}/{year}") ||
                i.dataDoPedido.Contains($"09/{mes}/{year}") ||
                i.dataDoPedido.Contains($"10/{mes}/{year}") ||
                i.dataDoPedido.Contains($"11/{mes}/{year}") ||
                i.dataDoPedido.Contains($"12/{mes}/{year}") ||
                i.dataDoPedido.Contains($"13/{mes}/{year}") ||
                i.dataDoPedido.Contains($"14/{mes}/{year}") ||
                i.dataDoPedido.Contains($"15/{mes}/{year}")
            )).ToList(); 

            var SegundaQuinzena = ctx.InfoPedidos.Where(i => i.Status == "Concluido" && (
                i.dataDoPedido.Contains($"16/{mes}/{year}") ||
                i.dataDoPedido.Contains($"17/{mes}/{year}") ||
                i.dataDoPedido.Contains($"18/{mes}/{year}") ||
                i.dataDoPedido.Contains($"19/{mes}/{year}") ||
                i.dataDoPedido.Contains($"20/{mes}/{year}") ||
                i.dataDoPedido.Contains($"21/{mes}/{year}") ||
                i.dataDoPedido.Contains($"22/{mes}/{year}") ||
                i.dataDoPedido.Contains($"23/{mes}/{year}") ||
                i.dataDoPedido.Contains($"24/{mes}/{year}") ||
                i.dataDoPedido.Contains($"25/{mes}/{year}") ||
                i.dataDoPedido.Contains($"26/{mes}/{year}") ||
                i.dataDoPedido.Contains($"27/{mes}/{year}") ||
                i.dataDoPedido.Contains($"28/{mes}/{year}") ||
                i.dataDoPedido.Contains($"29/{mes}/{year}") ||
                i.dataDoPedido.Contains($"30/{mes}/{year}") ||
                i.dataDoPedido.Contains($"31/{mes}/{year}")
            )).ToList(); 
        
            FaturamentoViewModel Faturamento1 = new FaturamentoViewModel();
            Faturamento1.PrecoFrete = PrimeiraQuinzena.Sum(x => x.PrecoFrete);
            Faturamento1.PrecoProduto = PrimeiraQuinzena.Sum(x => x.PrecoProduto);
            Faturamento1.PrecoTotal = PrimeiraQuinzena.Sum(x => x.PrecoTotal);
            Faturamento1.LucroPetshop = Math.Round(( (PrimeiraQuinzena.Sum(x => x.PrecoProduto)) * Convert.ToDecimal(0.86)), 2);
            Faturamento1.LucroPetFood = Math.Round(( (PrimeiraQuinzena.Sum(x => x.PrecoProduto)) * Convert.ToDecimal(0.14)), 2);
        
            FaturamentoViewModel Faturamento2 = new FaturamentoViewModel();
            Faturamento2.PrecoFrete = SegundaQuinzena.Sum(x => x.PrecoFrete);
            Faturamento2.PrecoProduto = SegundaQuinzena.Sum(x => x.PrecoProduto);
            Faturamento2.PrecoTotal = SegundaQuinzena.Sum(x => x.PrecoTotal);
            Faturamento2.LucroPetshop = Math.Round(( (SegundaQuinzena.Sum(x => x.PrecoProduto)) * Convert.ToDecimal(0.86)), 2);
            Faturamento2.LucroPetFood = Math.Round(( (SegundaQuinzena.Sum(x => x.PrecoProduto)) * Convert.ToDecimal(0.14)), 2);
        
            List<FaturamentoViewModel> list = new List<FaturamentoViewModel>();
            list.Add(Faturamento1);
            list.Add(Faturamento2);
            return list;
        }
        
        public List<FaturamentoMensal> FaturamentoMensalPetfood(string year, int idPetshop)
        {            
            var janeiro  = (idPetshop == 0)?( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"01/{year}") && (x.Status == "Aceito" || x.Status == "Concluido")) ):( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"01/{year}") && (x.Status == "Aceito" || x.Status == "Concluido") && x.idPetshop == idPetshop) );
            var fevereiro= (idPetshop == 0)?( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"02/{year}") && (x.Status == "Aceito" || x.Status == "Concluido")) ):( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"02/{year}") && (x.Status == "Aceito" || x.Status == "Concluido") && x.idPetshop == idPetshop) );
            var marco    = (idPetshop == 0)?( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"03/{year}") && (x.Status == "Aceito" || x.Status == "Concluido")) ):( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"03/{year}") && (x.Status == "Aceito" || x.Status == "Concluido") && x.idPetshop == idPetshop) );
            var abril    = (idPetshop == 0)?( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"04/{year}") && (x.Status == "Aceito" || x.Status == "Concluido")) ):( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"04/{year}") && (x.Status == "Aceito" || x.Status == "Concluido") && x.idPetshop == idPetshop) );
            var maio     = (idPetshop == 0)?( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"05/{year}") && (x.Status == "Aceito" || x.Status == "Concluido")) ):( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"05/{year}") && (x.Status == "Aceito" || x.Status == "Concluido") && x.idPetshop == idPetshop) );
            var junho    = (idPetshop == 0)?( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"06/{year}") && (x.Status == "Aceito" || x.Status == "Concluido")) ):( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"06/{year}") && (x.Status == "Aceito" || x.Status == "Concluido") && x.idPetshop == idPetshop) );
            var julho    = (idPetshop == 0)?( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"07/{year}") && (x.Status == "Aceito" || x.Status == "Concluido")) ):( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"07/{year}") && (x.Status == "Aceito" || x.Status == "Concluido") && x.idPetshop == idPetshop) );
            var agosto   = (idPetshop == 0)?( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"08/{year}") && (x.Status == "Aceito" || x.Status == "Concluido")) ):( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"08/{year}") && (x.Status == "Aceito" || x.Status == "Concluido") && x.idPetshop == idPetshop) );
            var setembro = (idPetshop == 0)?( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"09/{year}") && (x.Status == "Aceito" || x.Status == "Concluido")) ):( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"09/{year}") && (x.Status == "Aceito" || x.Status == "Concluido") && x.idPetshop == idPetshop) );
            var outubro  = (idPetshop == 0)?( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"10/{year}") && (x.Status == "Aceito" || x.Status == "Concluido")) ):( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"10/{year}") && (x.Status == "Aceito" || x.Status == "Concluido") && x.idPetshop == idPetshop) );
            var novembro = (idPetshop == 0)?( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"11/{year}") && (x.Status == "Aceito" || x.Status == "Concluido")) ):( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"11/{year}") && (x.Status == "Aceito" || x.Status == "Concluido") && x.idPetshop == idPetshop) );
            var dezembro = (idPetshop == 0)?( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"12/{year}") && (x.Status == "Aceito" || x.Status == "Concluido")) ):( ctx.InfoPedidos.Where(x => x.dataDoPedido.Contains($"12/{year}") && (x.Status == "Aceito" || x.Status == "Concluido") && x.idPetshop == idPetshop) );
            
            FaturamentoMensal jan = new FaturamentoMensal();
            jan.Mes = "Jan";
            jan.faturamento = janeiro.Sum(x => x.PrecoTotal);
            jan.frete = janeiro.Sum(x => x.PrecoFrete);
            jan.lucroPetshop = Math.Round(janeiro.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.86),2);
            jan.lucroPetFood = Math.Round(janeiro.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.14),2);
            
            FaturamentoMensal fev = new FaturamentoMensal();
            fev.Mes = "Fev";
            fev.faturamento = fevereiro.Sum(x => x.PrecoTotal);
            fev.frete = fevereiro.Sum(x => x.PrecoFrete);
            fev.lucroPetshop = Math.Round(fevereiro.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.86),2);
            fev.lucroPetFood = Math.Round(fevereiro.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.14),2);
            
            FaturamentoMensal mar = new FaturamentoMensal();
            mar.Mes = "Mar";
            mar.faturamento = marco.Sum(x => x.PrecoTotal);
            mar.frete = marco.Sum(x => x.PrecoFrete);
            mar.lucroPetshop = Math.Round(marco.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.86),2);
            mar.lucroPetFood = Math.Round(marco.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.14),2);
            
            FaturamentoMensal abr = new FaturamentoMensal();
            abr.Mes = "Abr";
            abr.faturamento = abril.Sum(x => x.PrecoTotal);
            abr.frete = abril.Sum(x => x.PrecoFrete);
            abr.lucroPetshop = Math.Round(abril.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.86),2);
            abr.lucroPetFood = Math.Round(abril.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.14),2);
            
            FaturamentoMensal mai = new FaturamentoMensal();
            mai.Mes = "Mai";
            mai.faturamento = maio.Sum(x => x.PrecoTotal);
            mai.frete = maio.Sum(x => x.PrecoFrete);
            mai.lucroPetshop = Math.Round(maio.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.86),2);
            mai.lucroPetFood = Math.Round(maio.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.14),2);
            
            FaturamentoMensal jun = new FaturamentoMensal();
            jun.Mes = "Jun";
            jun.faturamento = junho.Sum(x => x.PrecoTotal);
            jun.frete = junho.Sum(x => x.PrecoFrete);
            jun.lucroPetshop = Math.Round(junho.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.86),2);
            jun.lucroPetFood = Math.Round(junho.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.14),2);
            
            FaturamentoMensal jul = new FaturamentoMensal();
            jul.Mes = "Jul";
            jul.faturamento = julho.Sum(x => x.PrecoTotal);
            jul.frete = julho.Sum(x => x.PrecoFrete);
            jul.lucroPetshop = Math.Round(julho.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.86),2);
            jul.lucroPetFood = Math.Round(julho.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.14),2);
            
            FaturamentoMensal ago = new FaturamentoMensal();
            ago.Mes = "Ago";
            ago.faturamento = agosto.Sum(x => x.PrecoTotal);
            ago.frete = agosto.Sum(x => x.PrecoFrete);
            ago.lucroPetshop = Math.Round(agosto.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.86),2);
            ago.lucroPetFood = Math.Round(agosto.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.14),2);
            
            FaturamentoMensal set = new FaturamentoMensal();
            set.Mes = "Set";
            set.faturamento = setembro.Sum(x => x.PrecoTotal);
            set.frete = setembro.Sum(x => x.PrecoFrete);
            set.lucroPetshop = Math.Round(setembro.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.86),2);
            set.lucroPetFood = Math.Round(setembro.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.14),2);
            
            FaturamentoMensal outu = new FaturamentoMensal();
            outu.Mes = "Out";
            outu.faturamento = outubro.Sum(x => x.PrecoTotal);
            outu.frete = outubro.Sum(x => x.PrecoFrete);
            outu.lucroPetshop = Math.Round(outubro.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.86),2);
            outu.lucroPetFood = Math.Round(outubro.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.14),2);
            
            FaturamentoMensal nov = new FaturamentoMensal();
            nov.Mes = "Nov";
            nov.faturamento = novembro.Sum(x => x.PrecoTotal);
            nov.frete = novembro.Sum(x => x.PrecoFrete);
            nov.lucroPetshop = Math.Round(novembro.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.86),2);
            nov.lucroPetFood = Math.Round(novembro.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.14),2);
            
            FaturamentoMensal dez = new FaturamentoMensal();
            dez.Mes = "Dez";
            dez.faturamento = dezembro.Sum(x => x.PrecoTotal);
            dez.frete = dezembro.Sum(x => x.PrecoFrete);
            dez.lucroPetshop = Math.Round(dezembro.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.86),2);
            dez.lucroPetFood = Math.Round(dezembro.Sum(x => x.PrecoProduto) * Convert.ToDecimal(0.14),2);

            List<FaturamentoMensal> list = new List<FaturamentoMensal>();
            list.Add(jan);
            list.Add(fev);
            list.Add(mar);
            list.Add(abr);
            list.Add(mai);
            list.Add(jun);
            list.Add(jul);
            list.Add(ago);
            list.Add(set);
            list.Add(outu);
            list.Add(nov);
            list.Add(dez);

            return list;
        }
        public FaturamentoViewModel FaturamentoDetalhadoDoPetshop(int idPetshop)
        {
            List<ProdutoViewModel> listProdutos = (from p in ctx.InfoPedidos.Where(x => (x.Status == "Aceito" || x.Status == "Concluido") && x.idPetshop == idPetshop)
                                                   select new ProdutoViewModel
                                                   {
                                                       PrecoFrete = p.PrecoFrete,
                                                       PrecoProduto = p.PrecoProduto,
                                                       PrecoTotal = p.PrecoTotal
                                                   }).ToList();
            
            FaturamentoViewModel Faturamento = new FaturamentoViewModel();
            Faturamento.PrecoFrete = listProdutos.Sum(x => x.PrecoFrete);
            Faturamento.PrecoProduto = listProdutos.Sum(x => x.PrecoProduto);
            Faturamento.PrecoTotal = listProdutos.Sum(x => x.PrecoTotal);
            Faturamento.LucroPetshop = Math.Round(( (listProdutos.Sum(x => x.PrecoProduto)) * Convert.ToDecimal(0.86)), 2);
            Faturamento.LucroPetFood = Math.Round(( (listProdutos.Sum(x => x.PrecoProduto)) * Convert.ToDecimal(0.14)), 2);
            
            return Faturamento; 
        }

        public ProdutoViewModel CalcularFaturamentoTotal()
        {
            decimal Frete = ctx.InfoPedidos.Where(x => x.Status == "Aceito" || x.Status == "Concluido").Sum(x => x.PrecoFrete);
            decimal Produto = ctx.InfoPedidos.Where(x => x.Status == "Aceito" || x.Status == "Concluido").Sum(x => x.PrecoProduto);
            decimal Total = ctx.InfoPedidos.Where(x => x.Status == "Aceito" || x.Status == "Concluido").Sum(x => x.PrecoTotal);

            ProdutoViewModel faturamento = new ProdutoViewModel();
            faturamento.PrecoFrete = Frete;
            faturamento.PrecoProduto = Produto;
            faturamento.PrecoTotal = Total;

            return faturamento;
        }
#endregion
#region "Faturamento PetFood"
        public decimal FaturamentoPetFood()
        {
            decimal Produto = ctx.InfoPedidos.Where(x => x.Status == "Aceito" || x.Status == "Concluido" || x.Status == "Entregue").Sum(x => x.PrecoTotal);
            return Math.Round((Produto * 0.14M), 2);
        }
        #endregion
#region "Faturamento do Petshop"
        public decimal FaturamentoDoPetshop(int idPetshop)
        {
            decimal Produto = ctx.InfoPedidos.Where(y => y.idPetshop == idPetshop && (y.Status == "Aceito" || y.Status == "Concluido" || y.Status == "Entregue")).Sum(x => x.PrecoProduto);
            return Math.Round(Produto, 2);
        }
        #endregion
#region "Faturamento Entregador Parceiro"
        public class ResumoDoMotoboy {
            public string idPedido {get;set;}
            public decimal Frete {get;set;}
            public int idMotoboy {get;set;}
            public string dataPedido { get; set; }
        }

        public class LucroDoMotoboyPorDia{
            public decimal a6DiasAtras {get;set;}
            public decimal a5DiasAtras {get;set;}
            public decimal a4DiasAtras {get;set;}
            public decimal a3DiasAtras {get;set;}
            public decimal a2DiasAtras {get;set;}
            public decimal a1DiasAtras {get;set;}
            public decimal Hoje {get;set;}
        }

        public LucroDoMotoboyPorDia FaturamentoDoMotoboy(int idMotoboy)
        {
            List<Pedido> pedidos = _pedidos.Find(x => x.IdMotoboy == idMotoboy).ToList();
            List<ResumoDoMotoboy> lista = (from p in pedidos.Where(x => x.status == "Concluido" || x.status == "Entregue")
                                                   select new ResumoDoMotoboy
                                                   {
                                                       idPedido = p.Id,
                                                       Frete = p.Frete,
                                                       idMotoboy = p.IdMotoboy,
                                                       dataPedido = p.dataPedido
                                                   }).ToList();

            var hoje = DateTime.Now.ToString("dd/MM/yyyy");
            var a1DiasAtras = DateTime.Today.AddDays(-1).ToString("dd/MM/yyyy");
            var a2DiasAtras = DateTime.Today.AddDays(-2).ToString("dd/MM/yyyy");
            var a3DiasAtras = DateTime.Today.AddDays(-3).ToString("dd/MM/yyyy");
            var a4DiasAtras = DateTime.Today.AddDays(-4).ToString("dd/MM/yyyy");
            var a5DiasAtras = DateTime.Today.AddDays(-5).ToString("dd/MM/yyyy");
            var a6DiasAtras = DateTime.Today.AddDays(-6).ToString("dd/MM/yyyy");

            LucroDoMotoboyPorDia lucro = new LucroDoMotoboyPorDia();
            lucro.Hoje = lista.Where(x => x.dataPedido == hoje).Sum(x => x.Frete);
            lucro.a1DiasAtras = lista.Where(x => x.dataPedido == a1DiasAtras).Sum(x => x.Frete);
            lucro.a2DiasAtras = lista.Where(x => x.dataPedido == a2DiasAtras).Sum(x => x.Frete);
            lucro.a3DiasAtras = lista.Where(x => x.dataPedido == a3DiasAtras).Sum(x => x.Frete);
            lucro.a4DiasAtras = lista.Where(x => x.dataPedido == a4DiasAtras).Sum(x => x.Frete);
            lucro.a5DiasAtras = lista.Where(x => x.dataPedido == a5DiasAtras).Sum(x => x.Frete);
            lucro.a6DiasAtras = lista.Where(x => x.dataPedido == a6DiasAtras).Sum(x => x.Frete);
            
            return lucro;
        }
    #endregion
    }
}