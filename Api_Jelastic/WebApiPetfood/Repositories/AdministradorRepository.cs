using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApiPetfood.Models;
using WebApiPetfood.ViewModel;

namespace WebApiPetfood.Repositories
{
    public class AdministradorRepository
    {
        db_petfoodContext ctx = new db_petfoodContext();
        CodificarStringRepository CodificarRepository = new CodificarStringRepository();
        EmailRepository EmailRepository = new EmailRepository();

#region "Buscar Adm"
        public List<Administrador> ListarAdm()
        {
            return ctx.Administradors.ToList();
        }
        public List<Administrador> BuscarAdmPorId(int id)
        {
            var adm = ctx.Administradors.Where(x => x.Idadministrador == id).ToList();
            return adm;
        }
#endregion
#region "Cadastrar/Atualizar/Deletar Adm"
        public void CadastrarAdm(Administrador admin)
        {
            Administrador adm = new Administrador();
            adm.Email = admin.Email;
            adm.Senha = CodificarRepository.Encrypt(admin.Senha);
            adm.Nome = admin.Nome;            
            adm.Idtipousuario = 1;

            ctx.Administradors.Add(adm);
            ctx.SaveChanges();
        }
        public void AtualizarAdm(Administrador adm)
        {
            Administrador AdmBuscado = ctx.Administradors.FirstOrDefault(x => x.Idadministrador == adm.Idadministrador);
            AdmBuscado.Email = adm.Email;
            AdmBuscado.Senha = CodificarRepository.Encrypt(adm.Senha);
            AdmBuscado.Nome = adm.Nome;
            ctx.Update(AdmBuscado);
            ctx.SaveChanges();
        }
        public void DeletarAdm(int id)
        {
            Administrador adm = ctx.Administradors.Find(id);
            ctx.Administradors.Remove(adm);
            ctx.SaveChanges();
        }
#endregion
#region "Listar Entregadores Sem Aprovação"
        public List<Motoboy> ListarEntregadoresSemAprovacao()
        {
            return ctx.Motoboys.Where(x => x.Aprovado == false).Include(x => x.Imgmotoboy).ToList();
        }
#endregion
#region "Aprovar/Reporvar Entregador"
        public void AprovarEntregador(int id)
        {
            Motoboy moto = ctx.Motoboys.FirstOrDefault(x => x.Idmotoboy == id);
            moto.Aprovado = true;
            ctx.Update(moto);
            ctx.SaveChanges();

            EmailRepository.EnviarEmailAprovarEntregador(id);

        }
        public void ReprovarEntregador(int id)
        {            
            EmailRepository.EnviarEmailMotoboyReprovado(id);

            AvaliacaoMotoboy avaliacao = ctx.AvaliacaoMotoboys.FirstOrDefault(x => x.idMotoboy == id);            
            ImgMotoboy img = ctx.Imgmotoboy.FirstOrDefault(x => x.idMotoboy == id);
            TermosMotoboy termos = ctx.TermosMotoboys.FirstOrDefault(x => x.idMotoboy == id);
            Motoboy moto = ctx.Motoboys.Find(id);

            int QuantidadeLogs = ctx.LogMotoboys.Where(x => x.idMotoboy == id).ToList().Count();
            int QuantidadeLocalizacao = ctx.LocalizacaoMotoboys.Where(x => x.idMotoboy == id).ToList().Count();

            if(QuantidadeLogs != 0){
                for(int i = 0; i < QuantidadeLogs; i++)
                {
                    LogMotoboy log = ctx.LogMotoboys.FirstOrDefault(x => x.idMotoboy == id);
                    ctx.LogMotoboys.Remove(log);
                    ctx.SaveChanges();
                }
            }
            if(QuantidadeLocalizacao != 0){
                for(int f = 0; f < QuantidadeLogs; f++)
                {
                    LocalizacaoMotoboy local = ctx.LocalizacaoMotoboys.FirstOrDefault(x => x.idMotoboy == id);
                    ctx.LocalizacaoMotoboys.Remove(local);
                    ctx.SaveChanges();
                }
            }

            if(avaliacao != null){ ctx.AvaliacaoMotoboys.Remove(avaliacao); };
            if(termos    != null){ ctx.TermosMotoboys.Remove(termos);       };
            if(img       != null){ ctx.Imgmotoboy.Remove(img);              };
            if(moto      != null){ ctx.Motoboys.Remove(moto);               };
            ctx.SaveChanges();
        }

#endregion
#region "Listar e Atualizar Credencial"
        public string ListarCredencial()
        {
            var credencial = ctx.Getnets.ToList();
            return CodificarRepository.Decrypt(credencial[0].Credencial);
        }
        public void AtualizarCredencial(CredencialGetNet Codigo)
        {
            Getnet getnet = ctx.Getnets.FirstOrDefault(x => x.Id == 1);
            getnet.Credencial = CodificarRepository.Encrypt(Codigo.Credencial);
            
            ctx.Update(getnet);
            ctx.SaveChanges();
        }
#endregion
    }
}