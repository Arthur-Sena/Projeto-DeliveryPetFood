using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApiPetfood.Models;

namespace WebApiPetfood.Repositories
{
    public class PetshopRepository
    {
#region "Repositorios"
        db_petfoodContext ctx = new db_petfoodContext();
        CodificarStringRepository CodificarRepository = new CodificarStringRepository();
#endregion
#region "Listar Petshops"
        public List<Petshop> ListarPetshops()
        {
            return ctx.Petshops.Where(x => x.deletado == false).Include(x => x.Imgpetshops).ToList();
        }
#endregion
#region "Verificar Se o Petshopp estra Aberto"
        public List<Petshop> VerificarStatusDoPetshops(int idPetshop)
        {
            return ctx.Petshops.Where(x => x.Idpetshop == idPetshop).ToList();
        }
#endregion
#region "Listar Petshops Próximos
        public List<Petshop> ListarPetshopsRaio3km(decimal lat, decimal lng)
        {
            decimal latMax = lat * -1 + Convert.ToDecimal(0.02);
            decimal latMin = lat * -1 - Convert.ToDecimal(0.02);
            decimal lngMax = lng * -1 + Convert.ToDecimal(0.02);
            decimal lngMin = lng * -1 - Convert.ToDecimal(0.02);

            return ctx
                .Petshops
                .Where(x =>
                    x.deletado == false &&
                    (
                        (latMin <= Convert.ToDecimal(x.Latitude) * -1) 
                        &&
                        (Convert.ToDecimal(x.Latitude) * -1 <= latMax)
                    ) &&
                    (
                        (lngMin <= Convert.ToDecimal(x.Longitude) * -1) 
                        &&
                        (Convert.ToDecimal(x.Longitude) * -1 <= lngMax)
                    ))
                .Include(x => x.Imgpetshops)
                .ToList();
        }

        public List<Petshop> ListarPetshopsRaio7_5km(decimal lat, decimal lng)
        {
            decimal latMax = lat * -1 + Convert.ToDecimal(0.05);
            decimal latMin = lat * -1 - Convert.ToDecimal(0.05);
            decimal lngMax = lng * -1 + Convert.ToDecimal(0.05);
            decimal lngMin = lng * -1 - Convert.ToDecimal(0.05);

            return ctx
                .Petshops
                .Where(x =>
                    x.deletado == false &&
                    (
                    (latMin <= Convert.ToDecimal(x.Latitude) * -1) &&
                    (Convert.ToDecimal(x.Latitude) * -1 <= latMax)
                    ) &&
                    (
                    (lngMin <= Convert.ToDecimal(x.Longitude) * -1) &&
                    (Convert.ToDecimal(x.Longitude) * -1 <= lngMax)
                    ))
                .Include(x => x.Imgpetshops)
                .ToList();
        }

        public List<Petshop> ListarPetshopsRaio10km(decimal lat, decimal lng)
        {
            decimal latMax = lat * -1 + Convert.ToDecimal(0.07);
            decimal latMin = lat * -1 - Convert.ToDecimal(0.07);
            decimal lngMax = lng * -1 + Convert.ToDecimal(0.07);
            decimal lngMin = lng * -1 - Convert.ToDecimal(0.07);

            return ctx
                .Petshops
                .Where(x =>
                x.deletado == false &&
                    (
                    (latMin <= Convert.ToDecimal(x.Latitude) * -1) &&
                    (Convert.ToDecimal(x.Latitude) * -1 <= latMax)
                    ) &&
                    (
                    (lngMin <= Convert.ToDecimal(x.Longitude) * -1) &&
                    (Convert.ToDecimal(x.Longitude) * -1 <= lngMax)
                    ))
                .Include(x => x.Imgpetshops)
                .ToList();
        }

        public List<Petshop> ListarPetshopsRaio15km(decimal lat, decimal lng)
        {
            decimal latMax = lat * -1 + Convert.ToDecimal(0.1);
            decimal latMin = lat * -1 - Convert.ToDecimal(0.1);
            decimal lngMax = lng * -1 + Convert.ToDecimal(0.1);
            decimal lngMin = lng * -1 - Convert.ToDecimal(0.1);

            return ctx
                .Petshops
                .Where(x =>
                x.deletado == false &&
                    (
                    latMin <= Convert.ToDecimal(x.Latitude) * -1 &&
                    Convert.ToDecimal(x.Latitude) * -1 <= latMax
                    ) &&
                    (
                    lngMin <= Convert.ToDecimal(x.Longitude) * -1 &&
                    Convert.ToDecimal(x.Longitude) * -1 <= lngMax
                    ))
                .Include(x => x.Imgpetshops)
                .ToList();
        }
#endregion
#region "Buscar Petshop Por Id
        public List<Petshop> ListarPetshopsPorId(int id)
        {
            var petshop = ctx.Petshops.Where(x => x.Idpetshop == id && x.deletado == false).Include(x => x.Imgpetshops).ToList();
            return petshop;
        }
#endregion
#region "Cadastros (1- Petshop; 2- Imagem"
        public void CadastrarPetshop(Petshop pet)
        {
            ctx.Petshops.Add(pet);
            ctx.SaveChanges();
        }
        public void CadastrarImg(Imgpetshop img)
        {
            ctx.Imgpetshops.Add (img);
            ctx.SaveChanges();
        }
#endregion
#region "Termos De Usuario"
        public bool VerificarAceitacaoDosTermos(int idPetshop)
        {
            var verificado = ctx.TermosPetshops.FirstOrDefault(x => x.idPetshop == idPetshop);
            if (verificado == null)
            {
                return false;
            }
            return true;
        } 

         public void CadastrarConcordanciaComTermosDeUso(TermosPetshop t)
        {
            ctx.TermosPetshops.Add(t);
            ctx.SaveChanges();
        }    
#endregion
#region "Atualizar (1- Petshop; 2- Avaliação; 3- Status de Aberto/Fechado; 4- Imagem)
        public void AtualizarPetshop(CadastroPetshop petshop)
        {
            Petshop PetshopBuscado = ctx.Petshops.FirstOrDefault(x => x.Idpetshop == petshop.idPetshop);
            PetshopBuscado.Email = petshop.Email;

            PetshopBuscado.Senha = (petshop.Senha.Count() != 0)? CodificarRepository.Encrypt(petshop.Senha) : PetshopBuscado.Senha;
            PetshopBuscado.Nome = petshop.Nome;
            PetshopBuscado.Telefone = petshop.Telefone;
            PetshopBuscado.Endereco = petshop.Endereco;
            PetshopBuscado.Cep = petshop.Cep;
            PetshopBuscado.Cidade = petshop.Cidade;
            PetshopBuscado.Estado = petshop.Estado;
            PetshopBuscado.Longitude = petshop.Longitude;
            PetshopBuscado.Latitude = petshop.Latitude;
            PetshopBuscado.Status = PetshopBuscado.Status;
            PetshopBuscado.Horaabertura = petshop.Horaabertura;
            PetshopBuscado.Horafechamento = petshop.Horafechamento;
            ctx.Update(PetshopBuscado);
            ctx.SaveChanges();
        }

        public void AtualizarAvaliacaoDoPetshop(Petshop petshop)
        {
            Petshop PetshopBuscado = ctx.Petshops.FirstOrDefault(x => x.Idpetshop == petshop.Idpetshop);
            PetshopBuscado.Avaliacao = petshop.Avaliacao;
            ctx.Update (PetshopBuscado);
            ctx.SaveChanges();
        }

        public void AtualizarAvaliacaoStatus(Petshop petshop)
        {
            Petshop PetshopBuscado = ctx.Petshops.FirstOrDefault(x => x.Idpetshop == petshop.Idpetshop);
            PetshopBuscado.Status = !PetshopBuscado.Status;
            ctx.Update (PetshopBuscado);
            ctx.SaveChanges();
        }

        public void AtualizarImg(Imgpetshop imgpetshop)
        {
            if(imgpetshop.Img == null || imgpetshop.Img == ""){
                throw new NullReferenceException(message: "Erro, imagem não pode ser nula");
            }
            if(imgpetshop.Img.Length >= 150000){
                throw new InvalidOperationException(message: "Erro ao atualizar, Imagem muito pesada");
            }

            Imgpetshop imgBuscado = ctx.Imgpetshops.FirstOrDefault(x => x.Idimgpetshop == imgpetshop.Idimgpetshop);
            imgBuscado.Img = imgpetshop.Img;
            imgBuscado.Idimgpetshop = imgpetshop.Idimgpetshop;
            ctx.Update (imgBuscado);
            ctx.SaveChanges();
        }
#endregion
#region "Disponibilizar Retirada De Produtos Na Loja"
        public void DisponibilizarRetiradaDeProdutoNaLoja(int idPetshop)
        {
            Petshop PetshopBuscado = ctx.Petshops.FirstOrDefault(x => x.Idpetshop == idPetshop);
            PetshopBuscado.RetirarNaLoja = !PetshopBuscado.RetirarNaLoja;
            ctx.Update (PetshopBuscado);
            ctx.SaveChanges();
        }
#endregion
#region "Deletar Petshop"
        public void DeletarPetshop(int id)
        {
            Petshop PetshopBuscado = ctx.Petshops.Find(id);
            PetshopBuscado.deletado = true;
            ctx.Update (PetshopBuscado);
            ctx.SaveChanges();

            var quantidade = ctx.Produtos.Where(x => x.Idpetshop == id).ToList().Count();
            if (quantidade != 0)
            {
                for (int i = 0; i < quantidade; i = i + 1)
                {
                    Produto ProdutoBuscado = ctx.Produtos.Where(x => x.Idpetshop == id && x.deletado == false).FirstOrDefault();
                    ProdutoBuscado.deletado = true;
                    ProdutoBuscado.disponivel = false;
                    ctx.Update(ProdutoBuscado);
                    ctx.SaveChanges();
                }
            }
        }
#endregion
#region "Recuperar Senha"
         public string RecuperarSenha(string email)
        { 
            var pet = ctx.Petshops.Where(x => x.Email == email).FirstOrDefault();
            if(pet.deletado == false){
                return pet.Email;
            } else {
                return "Erro";
            }
        }
        public string RecuperarSenhaParte2(string email)
        {             
            string[] matrizCaracteres = {"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","1","2","3","4","5","6","7","8","9","0"};
            
            Random r = new Random();
            
            string SenhaGerada = "";
            for (int i = 0; i <= 9; i++)
            {
                SenhaGerada = SenhaGerada+matrizCaracteres[r.Next(matrizCaracteres.GetLength(0))];
            }

            Petshop PetshopBuscado = ctx.Petshops.FirstOrDefault(x => x.Email == email);
            PetshopBuscado.Senha = CodificarRepository.Encrypt(SenhaGerada); 
            ctx.Update(PetshopBuscado);
            ctx.SaveChanges();          

            return SenhaGerada;
        }
#endregion
    }
}
