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
    public class AvaliacaoRepository
    {
        db_petfoodContext ctx = new db_petfoodContext();

        public List<Avaliacao> ListarAvaliacao()
        {
            return ctx.Avaliacaos.ToList();
        }
        // -----------------------------CADASTRAR AVALIACAO-------------------------------\\
        public void CadastrarAvaliacao(Avaliacao avaliacao)
        {
            ctx.Avaliacaos.Add(avaliacao);
            ctx.SaveChanges();
        }
        // -----------------------------ATUALIZAR AVALIACAO-------------------------------\\
        public void AtualizarAvaliacaoNota1(Avaliacao avaliacao)
        {
            Avaliacao avaliacaoBuscada = ctx.Avaliacaos.FirstOrDefault(x => x.idPetshop == avaliacao.idPetshop);
            avaliacaoBuscada.nota1 = avaliacaoBuscada.nota1 + 1;
            ctx.Update(avaliacaoBuscada);
            ctx.SaveChanges();

            CalculoDaAvaliacao(avaliacao);
        }
        public void AtualizarAvaliacaoNota2(Avaliacao avaliacao)
        {
            Avaliacao avaliacaoBuscada = ctx.Avaliacaos.FirstOrDefault(x => x.idPetshop == avaliacao.idPetshop);
            avaliacaoBuscada.nota2 = avaliacaoBuscada.nota2 + 1;
            ctx.Update(avaliacaoBuscada);
            ctx.SaveChanges();

            CalculoDaAvaliacao(avaliacao);
        }
        public void AtualizarAvaliacaoNota3(Avaliacao avaliacao)
        {
            Avaliacao avaliacaoBuscada = ctx.Avaliacaos.FirstOrDefault(x => x.idPetshop == avaliacao.idPetshop);
            avaliacaoBuscada.nota3 = avaliacaoBuscada.nota3 + 1;
            ctx.Update(avaliacaoBuscada);
            ctx.SaveChanges();

            CalculoDaAvaliacao(avaliacao);
        }
        public void AtualizarAvaliacaoNota4(Avaliacao avaliacao)
        {
            Avaliacao avaliacaoBuscada = ctx.Avaliacaos.FirstOrDefault(x => x.idPetshop == avaliacao.idPetshop);
            avaliacaoBuscada.nota4 = avaliacaoBuscada.nota4 + 1;
            ctx.Update(avaliacaoBuscada);
            ctx.SaveChanges();

            CalculoDaAvaliacao(avaliacao);
        }
        public void AtualizarAvaliacaoNota5(Avaliacao avaliacao)
        {
            Avaliacao avaliacaoBuscada = ctx.Avaliacaos.FirstOrDefault(x => x.idPetshop == avaliacao.idPetshop);
            avaliacaoBuscada.nota5 = avaliacaoBuscada.nota5 + 1;
            ctx.Update(avaliacaoBuscada);
            ctx.SaveChanges();

            CalculoDaAvaliacao(avaliacao);
        }

        public void CalculoDaAvaliacao(Avaliacao avaliacao)
        {
            var Nota = ctx.Avaliacaos.FirstOrDefault(x => x.idPetshop == avaliacao.idPetshop);
            decimal AvaliacaoFinal = Convert.ToDecimal((Nota.nota1 * 1) + (Nota.nota2 * 2) + (Nota.nota3 * 3) + (Nota.nota4 * 4) + (Nota.nota5 * 5)) / Convert.ToDecimal(Nota.nota1 + Nota.nota2 + Nota.nota3 + Nota.nota4 + Nota.nota5);

            Petshop PetshopBuscado = ctx.Petshops.FirstOrDefault(x => x.Idpetshop == avaliacao.idPetshop);
            Console.WriteLine(AvaliacaoFinal);

            PetshopBuscado.Avaliacao = Math.Round(AvaliacaoFinal, 2);
            ctx.Update(PetshopBuscado);
            ctx.SaveChanges();
        }
    }
}