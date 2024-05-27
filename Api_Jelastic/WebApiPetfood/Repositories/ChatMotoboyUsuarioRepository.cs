using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApiPetfood.Models;
using WebApiPetfood.ViewModel;

namespace WebApiPetfood.Repositories
{
    public class ChatMotoboyUsuarioRepository
    {

        db_petfoodContext ctx = new db_petfoodContext();

#region "Listar Mensagens do Chat"
        public List<ChatEntregadorUsuario> ListarMensagens(int idEntregador, int idUsuario)
        {
            var chat = ctx.ChatEntregadorUsuarios.Where(x => x.idEntregador == idEntregador && x.idUsuario == idUsuario).OrderByDescending(i => i.idChat).ToList();
            return chat;
        }
#endregion
#region "Listar Mensagens não visualizadas (1- todas não visualizadas, 2- não visuakizadas pelo Cliente, 3- não visualizadas pelo entregador)"
        public List<ChatEntregadorUsuario> ListarMensagensNãoVisualizadas(int idEntregador, int idUsuario)
        {
            var chat = ctx.ChatEntregadorUsuarios.Where(x => x.idEntregador == idEntregador && x.idUsuario == idUsuario && x.VisualizadoCliente == false && x.VisualizadoEntregador == false).ToList();
            return chat;
        }
        public List<ChatEntregadorUsuario> ListarMensagensNãoVisualizadasPeloCliente(int idEntregador, int idUsuario)
        {
            var chat = ctx.ChatEntregadorUsuarios.Where(x => x.idEntregador == idEntregador && x.idUsuario == idUsuario && x.VisualizadoCliente == false).ToList();
            return chat;
        }
        // public List<ChatEntregadorUsuario> ListarMensagensNãoVisualizadasPeloPetshop(int idEntregador, int idUsuario)
        public List<ChatEntregadorUsuario> ListarMensagensNãoVisualizadasPeloEntregador(int idEntregador, int idUsuario)
        {
            var chat = ctx.ChatEntregadorUsuarios.Where(x => x.idEntregador == idEntregador && x.idUsuario == idUsuario && x.VisualizadoEntregador == false).ToList();
            return chat;
        }
#endregion
#region "Quantidade de Mensagens não Visualizadas (Pelo Entregador e Pelo Cliente)
        // public List<ChatViewModel> ListarQuantidadeDeMensagensNaoVistasPeloPetshop(int idEntregador)
        public List<ChatViewModel> ListarQuantidadeDeMensagensNaoVistasPeloEntregador(int idEntregador)
        {
            List<ChatViewModel> listProdutos = (from p in ctx.ChatEntregadorUsuarios.Where(x => x.idEntregador == idEntregador && x.VisualizadoEntregador == false)
                                                   select new ChatViewModel
                                                   {
                                                       idChat = p.idChat,
                                                       idUsuario = p.idUsuario,
                                                   }).ToList();         
            return listProdutos;
        }
        
        public List<ChatViewModel> ListarQuantidadeDeMensagensNaoVistasPeloCliente(int idUsuario)
        {
            List<ChatViewModel> listProdutos = (from p in ctx.ChatEntregadorUsuarios.Where(x => x.idUsuario == idUsuario && x.VisualizadoCliente == false)
                                                   select new ChatViewModel
                                                   {
                                                       idChat = p.idChat,
                                                       idUsuario = p.idEntregador,
                                                   }).ToList();         
            return listProdutos;
        }
        #endregion
#region "Enviar mensagem no chat"
        public void EnviarMensagem(ChatEntregadorUsuario chat)
        {
            chat.VisualizadoCliente = false;
            chat.VisualizadoEntregador = false;
            ctx.ChatEntregadorUsuarios.Add(chat);
            ctx.SaveChanges();
        }
        #endregion
#region "Mensagem visualizada"
        public void Atualizar_MensagemVisualizada(int idEntregador, int idUsuario)
        {
            var quantidade = ctx.ChatEntregadorUsuarios.Where(x => x.idEntregador == idEntregador && x.idUsuario == idUsuario).ToList().Count();
            if (quantidade != 0)
            {
                for (int i = 0; i < quantidade; i = i + 1)
                {
                    ChatEntregadorUsuario chat = ctx.ChatEntregadorUsuarios.FirstOrDefault(x => x.idEntregador == idEntregador && x.idUsuario == idUsuario);
                    chat.VisualizadoCliente = true;
                    chat.VisualizadoEntregador = true;
                    ctx.Update(chat);
                    ctx.SaveChanges();
                }
            }
        }
#endregion
#region "Atualizar Mensagens - Cliente ou Entregador"
        public void Atualizar_MensagemDoClientePorID(int id)
        {
            ChatEntregadorUsuario chat = ctx.ChatEntregadorUsuarios.FirstOrDefault(x => x.idChat == id);
            chat.VisualizadoCliente = true;
            ctx.Update(chat);
            ctx.SaveChanges();
        }
        // public void Atualizar_MensagemDoPetshopPorID(int id)
        public void Atualizar_MensagemDoEntregadorPorID(int id)
        {
            ChatEntregadorUsuario chat = ctx.ChatEntregadorUsuarios.FirstOrDefault(x => x.idChat == id);
            chat.VisualizadoEntregador = true;
            ctx.Update(chat);
            ctx.SaveChanges();
        }
#endregion
#region "Deletar Mensagens do chat entre Entregador e Usuario"
        public void DeletarChat(int idEntregador, int idUsuario)
        {
            var quantidade = ctx.ChatEntregadorUsuarios.Where(x => x.idEntregador == idEntregador && x.idUsuario == idUsuario).ToList().Count();
            if (quantidade != 0)
            {
                for (int i = 0; i < quantidade; i = i + 1)
                {
                    ChatEntregadorUsuario chat = ctx.ChatEntregadorUsuarios.Where(x => x.idEntregador == idEntregador && x.idUsuario == idUsuario).FirstOrDefault();
                    ctx.ChatEntregadorUsuarios.Remove(chat);
                    ctx.SaveChanges();
                }
            }
        }
        #endregion
    }
}