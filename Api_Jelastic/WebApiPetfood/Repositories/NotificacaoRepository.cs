using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApiPetfood.Models;

namespace WebApiPetfood.Repositories
{
    public class NotificacaoRepository
    {

        db_petfoodContext ctx = new db_petfoodContext();

        // -------------------------------BUSCAR NOTIFICACOEs------------------------------\\
        public List<Notificacao> ListarNotificacoesDoPetshop(int id)
        {
            var notificacao = ctx.Notificacaos.Where(x => x.idPetshop == id && x.Visualizado == false).ToList();
            return notificacao;
        }
        // - - -CADASTRAR NOTIFICACAO DO PEDIDO----------------------------------------------------------------
        public void CadastrarNotificacaoDoPetshop(Notificacao notificacao)
        {
            ctx.Notificacaos.Add(notificacao);
            ctx.SaveChanges();
        }
        // - - -ATUALIZAR NOTIFICACAO-----------------------------------------------------------------------------------\\
        public void Atualizar_NotificacaoVisualizada(Notificacao notificacao)
        {
            Notificacao NotificacaoBuscada = ctx.Notificacaos.FirstOrDefault(x => x.idNotificacao == notificacao.idNotificacao);
            // NotificacaoBuscada.Tipo = notificacao.Tipo;
            NotificacaoBuscada.Visualizado = true;
            ctx.Update(NotificacaoBuscada); 
            ctx.SaveChanges();
        }
        // - - -DELETAR NOTIFICACAO-------------------------------------------------------------------------\\
        public void DeletarNotificacao(int id)
        {
            Notificacao notificacao = ctx.Notificacaos.Where(x => x.idNotificacao == id).FirstOrDefault();
            ctx.Notificacaos.Remove(notificacao);
            ctx.SaveChanges();
        }
    }
}