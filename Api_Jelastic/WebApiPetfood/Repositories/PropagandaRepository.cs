using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApiPetfood.Models;

namespace WebApiPetfood.Repositories
{
    public class PropagandaRepository
    {

        db_petfoodContext ctx = new db_petfoodContext();

        // - - -LISTAR PROPAGANDAS/PROMOCOES------------------------------------------------------------------------------------------\\
        public List<Propaganda> ListarPropagandas_Promocoes()
        {
            return ctx.Propagandas.ToList();
        }
        public List<Propaganda> ListarPropagandas_PromocoesAtivas()
        {
            return ctx.Propagandas.Where(x => x.Ativa == true).ToList();
        }
         // - - -CADASTRAR PROPAGANDA/PROMOCAO------------------------------------------------------------------------------
        public void CadastrarPropaganda(Propaganda propaganda)
        {
            ctx.Propagandas.Add(propaganda);
            ctx.SaveChanges();
        }

        // - - -ATUALIZAR STATUS DA PROPAGANDAS/PROMOCOES------------------------------------------------------------------------------
        public void AtualizarStatusDaPropaganda(int idPropaganda)
        {
            Propaganda propagandaBuscada = ctx.Propagandas.Find(idPropaganda);
            propagandaBuscada.Ativa = !propagandaBuscada.Ativa;
            ctx.Update(propagandaBuscada);
            ctx.SaveChanges();
        }

        public void DeletarPropaganda(int idPropaganda)
        {
            Propaganda propagandaBuscada = ctx.Propagandas.Find(idPropaganda);
            ctx.Propagandas.Remove(propagandaBuscada);
            ctx.SaveChanges();
        }
    }
}