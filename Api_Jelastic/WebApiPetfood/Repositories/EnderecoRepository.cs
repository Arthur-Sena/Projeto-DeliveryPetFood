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
    public class EnderecoRepository
    {
        db_petfoodContext ctx = new db_petfoodContext();
        LogsRepository LogsRepository = new LogsRepository();
#region "Listar Todos os Enderecos"
        public List<Endereco> ListarEndereco()
        {
            return ctx.Enderecos.ToList();
        }
    #endregion
#region "Listar Endereceos dos Usuarios"
        public List<Endereco> EnderecosDoUsuario(int id)
        {
            var endereco = ctx.Enderecos.Where(x => x.Idusuario == id).ToList();
            return endereco;
        }
    #endregion
#region "Enderecos Por Id"
        public List<Endereco> BuscarEnderecoPorId(int id)
        {
            var endereco = ctx.Enderecos.Where(x => x.Idendereco == id).ToList();
            return endereco;
        }
    #endregion
#region "Cadastrar Endereco"
        public void CadastrarEndereco(Endereco endereco)
        {
            ctx.Enderecos.Add(endereco);
            ctx.SaveChanges();
        }
        #endregion
#region "Deletar Endereco"
        public void DeletarEndereco(int id)
        {
            Endereco endereco = ctx.Enderecos.Find(id);
            // LogsRepository.PostLog($"Endereço (ID: {id}) Foi Deletado Pelo Usuario",  ); 

            ctx.Enderecos.Remove(endereco);
            ctx.SaveChanges();
        }
    #endregion
#region "Atualizar Endereco"        
        public void AtualizarEndereco(Endereco endereco, string ip)
        { 
            Endereco EnderecoBuscado = ctx.Enderecos.FirstOrDefault(x => x.Idendereco == endereco.Idendereco);
            EnderecoBuscado.enderecoRua = endereco.enderecoRua;
            EnderecoBuscado.Bairro = endereco.Bairro;
            EnderecoBuscado.Cep = endereco.Cep;
            EnderecoBuscado.Cidade = endereco.Cidade;
            EnderecoBuscado.Estado = endereco.Estado;
            EnderecoBuscado.numero = endereco.numero;
            EnderecoBuscado.Complemento = endereco.Complemento;
            EnderecoBuscado.latitude = endereco.latitude;
            EnderecoBuscado.longitude = endereco.longitude;
            ctx.Update(EnderecoBuscado);
            ctx.SaveChanges();

            LogsRepository.PostLog($"Endereço (ID: {EnderecoBuscado.Idendereco}) Foi Atualizado Pelo Usuario", EnderecoBuscado.Idusuario, ip); 
        }
    #endregion
    }
}