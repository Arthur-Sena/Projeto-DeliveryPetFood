using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using WebApiPetfood.Models;
using WebApiPetfood.ViewModel;

namespace WebApiPetfood.Repositories
{
    public class MotoboyRepository
    {
        db_petfoodContext ctx = new db_petfoodContext(); 
        private readonly IMongoCollection<Pedido> _pedidos;
        CodificarStringRepository CodificarRepository = new CodificarStringRepository();
        public MotoboyRepository()
        {
            var client = new MongoClient("mongodb://admin:nntz32C2i4@10.100.34.181:27017,10.100.34.209:27017,10.100.34.208:27017/?replicaSet=rs0&authSource=admin&readPreference=primary&w=majority");
            var database = client.GetDatabase("petfood");
            _pedidos = database.GetCollection<Pedido>("Pedido");
        }
        
        public void CadastrarUltimaLocalizacao(string lat, string lng,int id)
        {
            LocalizacaoMotoboy local = new LocalizacaoMotoboy();
            local.Data = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
            local.Latitude = lat;
            local.Longitude = lng;
            local.idMotoboy = id;
            ctx.LocalizacaoMotoboys.Add(local);
            ctx.SaveChanges();
            ctx.SaveChanges();
        }
        // -----------------------------Listar Motoboy-------------------------------\\
        public List<Motoboy> ListarMotoboy()
        {
            return ctx.Motoboys.ToList();
        }
        // -------------------------------BUSCAR USUARIO POR ID------------------------------\\
        public List<Motoboy> BuscarMotoboyPorId(int id)
        {
            var motoboy = ctx.Motoboys.Where(x => x.Idmotoboy == id).ToList();
            
            return motoboy;
        }
        // -----------------------------Cadastrar Motoboy-------------------------------\\
        public void CadastrarMotoboy(Motoboy motoboy)
        {
            motoboy.Idtipousuario = 3;
            motoboy.Carteiradigital =  Math.Round(Convert.ToDecimal(0.00), 2);
            motoboy.Avaliacao = 3;
            ctx.Motoboys.Add(motoboy);
            ctx.SaveChanges();
        }

        public void CadastrarFotoMotoboy(ImgMotoboy foto)
        {            
            ImgMotoboy img = new ImgMotoboy();
            img.Img = foto.Img;
            img.idMotoboy = foto.idMotoboy;
            ctx.Imgmotoboy.Add(img);
            ctx.SaveChanges();
        }

        public void TermosDeUsoMotoboy(TermosMotoboy t){
            ctx.TermosMotoboys.Add(t);
            ctx.SaveChanges();
        }
        // -----------------------------Atualizar Motoboy-------------------------------\\
        public void AtualizarMoto(Motoboy moto, string senha, string SenhaAntiga)
        {
            Motoboy MotoBuscado = ctx.Motoboys.FirstOrDefault(x => x.Idmotoboy == moto.Idmotoboy);
            if (SenhaAntiga == CodificarRepository.Decrypt(MotoBuscado.Senha))
            {
            MotoBuscado.Email = moto.Email;
            MotoBuscado.Senha = CodificarRepository.Encrypt(senha);
            MotoBuscado.Nome = moto.Nome;
            MotoBuscado.Telefone = moto.Telefone;
            MotoBuscado.Cpf = moto.Cpf;
            ctx.Update(MotoBuscado);
            ctx.SaveChanges();
            }
        }

        public void DeletarMoto(int id)
        {
            Motoboy moto = ctx.Motoboys.Find(id);
            ctx.Motoboys.Remove(moto);
            ctx.SaveChanges();
        }
        // ----------------------------------Recuperar Senha--------------------------------\\
        public string RecuperarSenha(string cpf)
        { 
            var motoboy = ctx.Motoboys.Where(x => x.Cpf == cpf).FirstOrDefault();
            return motoboy.Email;
        }
        public string RecuperarSenhaParte2(string email, string cpf)
        {             
            string[] matrizCaracteres = {"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","1","2","3","4","5","6","7","8","9","0"};
            
            Random r = new Random();
            
            string SenhaGerada = "";
            for (int i = 0; i <= 9; i++)
            {
                SenhaGerada = SenhaGerada+matrizCaracteres[r.Next(matrizCaracteres.GetLength(0))];
            }

            Motoboy MotoboyBuscado = ctx.Motoboys.FirstOrDefault(x => x.Email == email && x.Cpf == cpf);
            MotoboyBuscado.Senha = CodificarRepository.Encrypt(SenhaGerada); 
            ctx.Update(MotoboyBuscado);
            ctx.SaveChanges();          

            return SenhaGerada;
        }

        // ----------------------------Ultima Localizacao Do Motoboy--------------------------------\\
        public List<UltimaLocalizacaoMotoboy> BuscarUltimaLocalizacaoDoMotoboy()
        { 
            List<UltimaLocalizacaoMotoboy> list = (from json in ctx.Motoboys
                                                   select new UltimaLocalizacaoMotoboy
                                                   {
                                                       Motoboy = json,
                                                       UltimaLocalizacao = ctx.LocalizacaoMotoboys.OrderBy(Localizado => Localizado.Id).Last(x => x.idMotoboy == json.Idmotoboy),
                                                       UltimaVezVisto = ctx.LocalizacaoMotoboys.OrderBy(Localizado => Localizado.Id).Last(x => x.idMotoboy == json.Idmotoboy).Data != null ? (ctx.LocalizacaoMotoboys.OrderBy(Localizado => Localizado.Id).Last(x => x.idMotoboy == json.Idmotoboy).Data):("Nunca Acessou o App")
                                                   }).ToList();
            return list;
        }
       
        public LocalizacaoMotoboy UltimaLocalizacaoDoMotoboy(int Idmotoboy)
        { 
            var UltimaLocalizacao = ctx.LocalizacaoMotoboys.Where(Motoboy => Motoboy.idMotoboy == Idmotoboy).OrderBy(Localizado => Localizado.Id).LastOrDefault();
            return UltimaLocalizacao;
        }

        public int ListarPedidosPertoDoMotoboy(decimal lat, decimal lng)
        {            
            decimal latMax = lat + Convert.ToDecimal(0.05);
            decimal latMin = lat - Convert.ToDecimal(0.05);
            decimal lngMax = lng + Convert.ToDecimal(0.05);
            decimal lngMin = lng - Convert.ToDecimal(0.05);

            var query = _pedidos.AsQueryable<Pedido>()
            .Where(x => x.status == "Aceito" && (
                latMin >= x.CaminhoDaEntrega.From.Latitude &&
                latMax <= x.CaminhoDaEntrega.From.Latitude
            ) && (
                lngMin >= x.CaminhoDaEntrega.From.Longitude &&
                lngMax <= x.CaminhoDaEntrega.From.Longitude
            ));
            
            return query.ToList().Count();
        }
        public bool NotificarCasoTenhaPedidosProximos(int idMotoboy)
        {
            var LocalizacaoDoMotoboy = UltimaLocalizacaoDoMotoboy(idMotoboy);
            int QuantidadeDePedidos = ListarPedidosPertoDoMotoboy( Convert.ToDecimal(LocalizacaoDoMotoboy.Latitude), Convert.ToDecimal(LocalizacaoDoMotoboy.Longitude));        
                      
            if (QuantidadeDePedidos >= 1){
                return true;
            } else {
                return false;
            }
        }
    }
}