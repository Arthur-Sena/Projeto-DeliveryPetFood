using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApiPetfood.Models;
using Microsoft.EntityFrameworkCore;

namespace WebApiPetfood.Repositories
{
    public class AvaliacaoMotoboyRepository
    {
        db_petfoodContext ctx = new db_petfoodContext();

        public List<AvaliacaoMotoboy> ListarAvaliacao()
        {
            return ctx.AvaliacaoMotoboys.ToList();
        }
        // -----------------------------CADASTRAR AVALIACAO-------------------------------\\
        public void CadastrarAvaliacao(AvaliacaoMotoboy avaliacao)
        {
            ctx.AvaliacaoMotoboys.Add(avaliacao);
            ctx.SaveChanges();
        }
        // -----------------------------ATUALIZAR AVALIACAO-------------------------------\\
        public void AtualizarAvaliacaoNota1(AvaliacaoMotoboy avaliacao)
        {
            AvaliacaoMotoboy avaliacaoBuscada = ctx.AvaliacaoMotoboys.FirstOrDefault(x => x.idMotoboy == avaliacao.idMotoboy);
            avaliacaoBuscada.nota1 = avaliacaoBuscada.nota1 + 1;
            ctx.Update(avaliacaoBuscada);
            ctx.SaveChanges();

            CalculoDaAvaliacao(avaliacao);
        }
        public void AtualizarAvaliacaoNota2(AvaliacaoMotoboy avaliacao)
        {
            AvaliacaoMotoboy avaliacaoBuscada = ctx.AvaliacaoMotoboys.FirstOrDefault(x => x.idMotoboy == avaliacao.idMotoboy);
            avaliacaoBuscada.nota2 = avaliacaoBuscada.nota2 + 1;
            ctx.Update(avaliacaoBuscada);
            ctx.SaveChanges();

            CalculoDaAvaliacao(avaliacao);
        }
        public void AtualizarAvaliacaoNota3(AvaliacaoMotoboy avaliacao)
        {
            AvaliacaoMotoboy avaliacaoBuscada = ctx.AvaliacaoMotoboys.FirstOrDefault(x => x.idMotoboy == avaliacao.idMotoboy);
            avaliacaoBuscada.nota3 = avaliacaoBuscada.nota3 + 1;
            ctx.Update(avaliacaoBuscada);
            ctx.SaveChanges();

            CalculoDaAvaliacao(avaliacao);
        }
        public void AtualizarAvaliacaoNota4(AvaliacaoMotoboy avaliacao)
        {
            AvaliacaoMotoboy avaliacaoBuscada = ctx.AvaliacaoMotoboys.FirstOrDefault(x => x.idMotoboy == avaliacao.idMotoboy);
            avaliacaoBuscada.nota4 = avaliacaoBuscada.nota4 + 1;
            ctx.Update(avaliacaoBuscada);
            ctx.SaveChanges();

            CalculoDaAvaliacao(avaliacao);
        }
        public void AtualizarAvaliacaoNota5(AvaliacaoMotoboy avaliacao)
        {
            AvaliacaoMotoboy avaliacaoBuscada = ctx.AvaliacaoMotoboys.FirstOrDefault(x => x.idMotoboy == avaliacao.idMotoboy);
            avaliacaoBuscada.nota5 = avaliacaoBuscada.nota5 + 1;
            ctx.Update(avaliacaoBuscada);
            ctx.SaveChanges();

            CalculoDaAvaliacao(avaliacao);
        }

        public void CalculoDaAvaliacao(AvaliacaoMotoboy avaliacao)
        {
            var Nota = ctx.AvaliacaoMotoboys.FirstOrDefault(x => x.idMotoboy == avaliacao.idMotoboy);
            decimal AvaliacaoFinal = Convert.ToDecimal((Nota.nota1 * 1) + (Nota.nota2 * 2) + (Nota.nota3 * 3) + (Nota.nota4 * 4) + (Nota.nota5 * 5)) / Convert.ToDecimal(Nota.nota1 + Nota.nota2 + Nota.nota3 + Nota.nota4 + Nota.nota5);

            Motoboy MotoboyBuscado = ctx.Motoboys.FirstOrDefault(x => x.Idmotoboy == avaliacao.idMotoboy);

            MotoboyBuscado.Avaliacao = Math.Round(AvaliacaoFinal, 2);
            ctx.Update(MotoboyBuscado);
            ctx.SaveChanges();
        }
    }
}