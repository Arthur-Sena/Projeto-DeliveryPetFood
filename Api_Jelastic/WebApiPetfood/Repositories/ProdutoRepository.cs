using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApiPetfood.Models;

namespace WebApiPetfood.Repositories
{ 
    public class ProdutoRepository
    { 
#region "Repositorios"
        db_petfoodContext ctx = new db_petfoodContext();
        LogsRepository LogRepository = new LogsRepository();
#endregion
#region "Listar Todos os Produtos Cadastrados Na Plataforma
        public List<Produto> ListarProdutos()
        {
            return ctx.Produtos.Where(x => x.deletado == false && x.disponivel == true).Include(x => x.Imgprodutos).ToList();
        }
#endregion
#region "Listar Todas as Categorias De Produtos"
        public List<Categoria> ListarCategoria()
        {
            return ctx.Categorias.ToList();
        }
#endregion
#region "Buscar Produto Por Id"
        public List<Produto> BuscarProdutoPorId (int id) {
            var produto = ctx.Produtos.Where(x => x.Idproduto == id && x.deletado == false).Include(x => x.Imgprodutos).ToList();
            return produto; 
        }
#endregion
#region "Listar Produtos de Um Petshop"
        public List<Produto> ProdutosDoPetshop(int id)
        {
            var produtos = ctx.Produtos
            .Where(x => x.Idpetshop == id && x.deletado == false && x.disponivel == true)
            .Include(x => x.Imgprodutos)
            .ToList();
            return produtos;
        }

        public List<Produto> EstoqueDoPetshop(int id)
        {
            var produtos = ctx.Produtos
            .Where(x => x.Idpetshop == id && x.deletado == false )
            .Include(x => x.Imgprodutos)
            .ToList();
            return produtos;
        }
#endregion
#region "Listar Produtos Dos Petshops Proximos"
    #region "Listar Produtos Dos Petshops Num Raio de 3KM"
        public List<Produto> ListarProdutosDePetshopsRaio3km(decimal lat, decimal lng)
        {
            decimal latMax = lat*-1 + Convert.ToDecimal(0.03);
            decimal latMin = lat*-1 - Convert.ToDecimal(0.03);
            decimal lngMax = lng*-1 + Convert.ToDecimal(0.03);
            decimal lngMin = lng*-1 - Convert.ToDecimal(0.03);

            var ProdutosDoPetshop = ctx.Produtos
            .Include(z => z.Imgprodutos)
            .Include(y => y.IdpetshopNavigation)
            .Where(x =>
            x.deletado == false && x.disponivel == true &&
            (
                latMin <= Convert.ToDecimal(x.IdpetshopNavigation.Latitude)*-1 &&
                Convert.ToDecimal(x.IdpetshopNavigation.Latitude)*-1 <= latMax 
            ) && (
                lngMin <= Convert.ToDecimal(x.IdpetshopNavigation.Longitude)*-1 &&
                Convert.ToDecimal(x.IdpetshopNavigation.Longitude)*-1 <= lngMax)
            )
            .ToList();

            return ProdutosDoPetshop;
        }
        public object Listar20ProdutosDosPetshopsNumRaioDe3km(decimal lat, decimal lng)
        {
            Random r = new Random();

            decimal latMax = lat*-1 + Convert.ToDecimal(0.03);
            decimal latMin = lat*-1 - Convert.ToDecimal(0.03);
            decimal lngMax = lng*-1 + Convert.ToDecimal(0.03);
            decimal lngMin = lng*-1 - Convert.ToDecimal(0.03);

            var ProdutosDoPetshop = ctx.Produtos
            .Include(z => z.Imgprodutos)
            .Include(y => y.IdpetshopNavigation)
            .Where(x =>
            x.deletado == false && x.disponivel == true &&
            (
                latMin <= Convert.ToDecimal(x.IdpetshopNavigation.Latitude)*-1 &&
                Convert.ToDecimal(x.IdpetshopNavigation.Latitude)*-1 <= latMax 
            ) && (
                lngMin <= Convert.ToDecimal(x.IdpetshopNavigation.Longitude)*-1 &&
                Convert.ToDecimal(x.IdpetshopNavigation.Longitude)*-1 <= lngMax)
            )
            .ToList()
            .OrderBy(x=>(r.Next()))
            .Take(15);

            return ProdutosDoPetshop;
        }
    #endregion
    #region "Listar Produtos Dos Petshops Num Raio de 7.5KM"
        public List<Produto> ListarProdutosDePetshopsRaio7_5km(decimal lat, decimal lng)
        {
            decimal latMax = lat*-1 + Convert.ToDecimal(0.05);
            decimal latMin = lat*-1 - Convert.ToDecimal(0.05);
            decimal lngMax = lng*-1 + Convert.ToDecimal(0.05);
            decimal lngMin = lng*-1 - Convert.ToDecimal(0.05);

            var ProdutosDoPetshop = ctx.Produtos
            .Include(z => z.Imgprodutos)
            .Include(y => y.IdpetshopNavigation)
            .Where(x => 
            x.deletado == false && x.disponivel == true &&
            (
                latMin <= Convert.ToDecimal(x.IdpetshopNavigation.Latitude)*-1 &&
                Convert.ToDecimal(x.IdpetshopNavigation.Latitude)*-1 <= latMax 
            )&&(
                lngMin <= Convert.ToDecimal(x.IdpetshopNavigation.Longitude)*-1 &&
                Convert.ToDecimal(x.IdpetshopNavigation.Longitude)*-1 <= lngMax)
            )
            .ToList();

            return ProdutosDoPetshop;
        }
        public object Listar20ProdutosDosPetshopsNumRaioDe7_5km(decimal lat, decimal lng)
        {
            Random r = new Random();

            decimal latMax = lat*-1 + Convert.ToDecimal(0.05);
            decimal latMin = lat*-1 - Convert.ToDecimal(0.05);
            decimal lngMax = lng*-1 + Convert.ToDecimal(0.05);
            decimal lngMin = lng*-1 - Convert.ToDecimal(0.05);

            var ProdutosDoPetshop = ctx.Produtos
            .Include(z => z.Imgprodutos)
            .Include(y => y.IdpetshopNavigation)
            .Where(x =>
            x.deletado == false && x.disponivel == true &&
            (
                latMin <= Convert.ToDecimal(x.IdpetshopNavigation.Latitude)*-1 &&
                Convert.ToDecimal(x.IdpetshopNavigation.Latitude)*-1 <= latMax
            ) && (
                lngMin <= Convert.ToDecimal(x.IdpetshopNavigation.Longitude)*-1 &&
                Convert.ToDecimal(x.IdpetshopNavigation.Longitude)*-1 <= lngMax)
            )
            .ToList()
            .OrderBy(x=>(r.Next()))
            .Take(15);

            return ProdutosDoPetshop;
        }
    #endregion
    #region "Listar Produtos Dos Petshops Num Raio de 10KM"
        public List<Produto> ListarProdutosDePetshopsRaio10km(decimal lat, decimal lng)
        {
            decimal latMax = lat*-1 + Convert.ToDecimal(0.07);
            decimal latMin = lat*-1 - Convert.ToDecimal(0.07);
            decimal lngMax = lng*-1 + Convert.ToDecimal(0.07);
            decimal lngMin = lng*-1 - Convert.ToDecimal(0.07);

            var ProdutosDoPetshop = ctx.Produtos
            .Include(z => z.Imgprodutos)
            .Include(y => y.IdpetshopNavigation)
            .Where(x =>
            x.deletado == false && x.disponivel == true &&
            (
                latMin <= Convert.ToDecimal(x.IdpetshopNavigation.Latitude)*-1 &&
                Convert.ToDecimal(x.IdpetshopNavigation.Latitude)*-1 <= latMax 
            )&&(
                lngMin <= Convert.ToDecimal(x.IdpetshopNavigation.Longitude)*-1 &&
                Convert.ToDecimal(x.IdpetshopNavigation.Longitude)*-1 <= lngMax
            ))
            .ToList();

            return ProdutosDoPetshop;
        }
        public object Listar20ProdutosDosPetshopsNumRaioDe10km(decimal lat, decimal lng)
        {
            Random r = new Random();
            decimal latMax = lat*-1 + Convert.ToDecimal(0.07);
            decimal latMin = lat*-1 - Convert.ToDecimal(0.07);
            decimal lngMax = lng*-1 + Convert.ToDecimal(0.07);
            decimal lngMin = lng*-1 - Convert.ToDecimal(0.07);

            var ProdutosDoPetshop = ctx.Produtos
            .Include(z => z.Imgprodutos)
            .Include(y => y.IdpetshopNavigation)
            .Where(x => 
            x.deletado == false && x.disponivel == true &&
            (
                latMin <= Convert.ToDecimal(x.IdpetshopNavigation.Latitude)*-1 &&
                Convert.ToDecimal(x.IdpetshopNavigation.Latitude)*-1 <= latMax 
            ) && (
                lngMin <= Convert.ToDecimal(x.IdpetshopNavigation.Longitude)*-1 &&
                Convert.ToDecimal(x.IdpetshopNavigation.Longitude)*-1 <= lngMax)
            )
            .ToList()
            .OrderBy(x=>(r.Next()))
            .Take(15);

            return ProdutosDoPetshop;
        }
    #endregion
    #region "Listar Produtos Dos Petshops Num Raio de 15KM"
        public List<Produto> ListarProdutosDePetshopsRaio15km(decimal lat, decimal lng)
        {
            decimal latMax = lat*-1 + Convert.ToDecimal(0.1);
            decimal latMin = lat*-1 - Convert.ToDecimal(0.1);
            decimal lngMax = lng*-1 + Convert.ToDecimal(0.1);
            decimal lngMin = lng*-1 - Convert.ToDecimal(0.1);

            var ProdutosDoPetshop = ctx.Produtos
            .Include(z => z.Imgprodutos)
            .Include(y => y.IdpetshopNavigation)
            .Where(x =>
            x.deletado == false && x.disponivel == true &&
            (
                latMin <= Convert.ToDecimal(x.IdpetshopNavigation.Latitude)*-1 &&
                Convert.ToDecimal(x.IdpetshopNavigation.Latitude)*-1 <= latMax 
            )&&(
                lngMin <= Convert.ToDecimal(x.IdpetshopNavigation.Longitude)*-1 &&
                Convert.ToDecimal(x.IdpetshopNavigation.Longitude)*-1 <= lngMax)
            )
            .ToList();

            return ProdutosDoPetshop;
        }

        public object Listar20ProdutosDosPetshopsNumRaioDe15km(decimal lat, decimal lng)
        {
            Random r = new Random();

            decimal latMax = lat*-1 + Convert.ToDecimal(0.1);
            decimal latMin = lat*-1 - Convert.ToDecimal(0.1);
            decimal lngMax = lng*-1 + Convert.ToDecimal(0.1);
            decimal lngMin = lng*-1 - Convert.ToDecimal(0.1);

            var ProdutosDoPetshop = ctx.Produtos
            .Include(z => z.Imgprodutos)
            .Include(y => y.IdpetshopNavigation)
            .Where(x =>
            x.deletado == false && x.disponivel == true &&
            (
                latMin <= Convert.ToDecimal(x.IdpetshopNavigation.Latitude)*-1 &&
                Convert.ToDecimal(x.IdpetshopNavigation.Latitude)*-1 <= latMax 
            ) &&
            (
                lngMin <= Convert.ToDecimal(x.IdpetshopNavigation.Longitude)*-1 &&
                Convert.ToDecimal(x.IdpetshopNavigation.Longitude)*-1 <= lngMax)
            )
            .ToList()
            .OrderBy(x=>(r.Next()))
            .Take(15);

            return ProdutosDoPetshop;
        }
    #endregion
#endregion
#region "Buscar Produto Pelo Nome"
        public object BuscarPeloNome(decimal lat, decimal lng, string pesquisa)
        {
            decimal latMax = lat*-1 + Convert.ToDecimal(0.1);
            decimal latMin = lat*-1 - Convert.ToDecimal(0.1);
            decimal lngMax = lng*-1 + Convert.ToDecimal(0.1);
            decimal lngMin = lng*-1 - Convert.ToDecimal(0.1);

            var ProdutosDoPetshop = ctx.Produtos
            .FromSqlRaw("SELECT * FROM produto WHERE unaccent(titulo) ILIKE unaccent('%"+ pesquisa +"%')")
            .Include(z => z.Imgprodutos)
            .Include(y => y.IdpetshopNavigation)
            .Where(x =>
            x.deletado == false && x.disponivel == true &&
            (
                latMin <= Convert.ToDecimal(x.IdpetshopNavigation.Latitude)*-1 &&
                Convert.ToDecimal(x.IdpetshopNavigation.Latitude)*-1 <= latMax 
            ) && (
                lngMin <= Convert.ToDecimal(x.IdpetshopNavigation.Longitude)*-1 &&
                Convert.ToDecimal(x.IdpetshopNavigation.Longitude)*-1 <= lngMax )
            )
            .Take(15)
            .ToList();

            return ProdutosDoPetshop;
        }
#endregion
#region "Listar Produtos com Imagem"
        public List<Imgproduto> ListarImgDoProduto()
        {
            return ctx.Imgprodutos
            .Include(x => x.IdprodutoNavigation)
            .ToList();
        } 
        public List<Imgproduto> ImgDoProduto(int id) 
        {
            return ctx.Imgprodutos.Where(x => x.Idproduto == id).ToList();
        }
#endregion
#region "Cadastros (1- Produto; 2- Categorias; 3- Imagem"
        public void CadastrarProduto(Produto produto)
        {
            if(produto.Titulo == null || produto.Descricao == null ||produto.Titulo == "" || produto.Descricao == ""|| produto.Preco ==  0 || produto.idCategoria == 0){
                throw new NullReferenceException(message: "Nenhum campo pode ser nulo");
            }
            produto.disponivel = true;
            ctx.Produtos.Add(produto);
            ctx.SaveChanges();
        }
        public void CadastrarCategoria(Categoria categoria)
        {
            ctx.Categorias.Add(categoria);
            ctx.SaveChanges();
        }
        public void CadastrarImg(Imgproduto img)
        {
            ctx.Imgprodutos.Add(img);
            ctx.SaveChanges();
        }
#endregion
#region "Atualizar (1- Produto; 2- Categorias; 3- Imagem)
        public void AtualizarProduto(Produto produto)
        {
            if(produto.Titulo == null || produto.Descricao == null || produto.Titulo == "" || produto.Descricao == ""|| produto.Preco ==  0 || produto.idCategoria == 0){
                throw new NullReferenceException(message: "Nenhum campo pode ser nulo");
            }

            Produto ProdutoBuscado = ctx.Produtos.FirstOrDefault(x => x.Idproduto == produto.Idproduto);
            ProdutoBuscado.Titulo = produto.Titulo;
            ProdutoBuscado.Preco = produto.Preco;
            ProdutoBuscado.Descricao = produto.Descricao;
            ProdutoBuscado.idCategoria = produto.idCategoria;
            ctx.Update(ProdutoBuscado);
            ctx.SaveChanges();
        }
        public void AtualizarCategoria(Categoria categoria)
        {
            Categoria categoriaBuscada = ctx.Categorias.FirstOrDefault(x => x.idCategoria == categoria.idCategoria);
            if(categoria.categoria != null) {   categoriaBuscada.categoria = categoria.categoria; }
            if(categoria.icone != null){   categoriaBuscada.icone = categoria.icone;  }
            ctx.Update(categoriaBuscada);
            ctx.SaveChanges();
        }
        public void AtualizarImg(Imgproduto imgproduto)
        {
            if(imgproduto.Img == null || imgproduto.Img == ""){
                throw new NullReferenceException(message: "Erro, imagem não pode ser nula");
            }
            if(imgproduto.Img.Length >= 150000){
                throw new InvalidOperationException(message: "Erro ao atualizar, Imagem muito pesada");
            }

            Imgproduto imgBuscado = ctx.Imgprodutos.FirstOrDefault(x => x.Idimg == imgproduto.Idimg);
            imgBuscado.Img = imgproduto.Img;
            imgBuscado.Idproduto = imgproduto.Idproduto;
            ctx.Update(imgBuscado);
            ctx.SaveChanges();
        }
#endregion
#region "Indisponibilizar Produtos"
        public void ProdutoIndisponivel(int id, string ip)
        {
            Console.WriteLine($"ID: {id}\n ip: {ip}");
            
            Produto ProdutoBuscado = ctx.Produtos.Find(id);
            ProdutoBuscado.disponivel = !ProdutoBuscado.disponivel;
            ctx.Update(ProdutoBuscado);
            ctx.SaveChanges();

            LogRepository.PostLogPethop($"Petshop Indisponibilizou o Produto de Id: {id}", ProdutoBuscado.Idpetshop , ip); 
        }
#endregion
#region "Deletar (1- Produto; 2- Deletar Produto Permantentemente; 3- Deletar Categoria; 4- Deletar Imagem"
        public void ExcluirProduto(int id, string ip)
        {
            Produto produto = ctx.Produtos.Find(id);

            Produto ProdutoBuscado = ctx.Produtos.FirstOrDefault(x => x.Idproduto == id);
            ProdutoBuscado.deletado = true;
            ProdutoBuscado.disponivel = false;
            ctx.Update(ProdutoBuscado);
            ctx.SaveChanges();

            LogRepository.PostLogPethop($"Petshop Deletou o Produto de Id: {id}", produto.Idpetshop , ip); 
        }
        
        public void DeletarProduto(int id, string ip)
        {
            Imgproduto imgproduto = ctx.Imgprodutos.Where(x => x.Idproduto == id).FirstOrDefault();
            if (imgproduto != null)
            {
                ctx.Imgprodutos.Remove(imgproduto);
            }

            Produto produto = ctx.Produtos.Find(id);
            LogRepository.PostLogPethop($"Petshop Deletou o Produto de Id: {id}", produto.Idpetshop , ip); 

            ctx.Produtos.Remove(produto);
            ctx.SaveChanges();
        }
        public void DeletarCategoria(int id)
        {
            Categoria categoria = ctx.Categorias.Find(id);
            ctx.Categorias.Remove(categoria);
            ctx.SaveChanges();
        }
        public void DeletarImg(int id)
        {
            Imgproduto imgproduto = ctx.Imgprodutos.Find(id);
            ctx.Imgprodutos.Remove(imgproduto);
            ctx.SaveChanges();
        }
#endregion
    }
}