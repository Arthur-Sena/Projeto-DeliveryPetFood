using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApiPetfood.Models;
using WebApiPetfood.ViewModel;

namespace WebApiPetfood.Repositories
{
    public class ChatRepository
    {

        db_petfoodContext ctx = new db_petfoodContext();

#region "Listar Mensagens do Chat"
        public List<Chat> ListarMensagens(int idPetshop, int idUsuario)
        {
            var chat = ctx.Chats.Where(x => x.idPetshop == idPetshop && x.idUsuario == idUsuario).OrderByDescending(i => i.idChat).ToList();
            return chat;
        }
        #endregion
#region "Listar Mensagens não visualizadas (1- todas não visualizadas, 2- não visuakizadas pelo Cliente, 3- não visualizadas pelo entregador)"
        public List<Chat> ListarMensagensNãoVisualizadas(int idPetshop, int idUsuario)
        {
            var chat = ctx.Chats.Where(x => x.idPetshop == idPetshop && x.idUsuario == idUsuario && x.VisualizadoCliente == false && x.VisualizadoPetshop == false).ToList();
            return chat;
        }
        public List<Chat> ListarMensagensNãoVisualizadasPeloCliente(int idPetshop, int idUsuario)
        {
            var chat = ctx.Chats.Where(x => x.idPetshop == idPetshop && x.idUsuario == idUsuario && x.VisualizadoCliente == false).ToList();
            // chat.Reverse();
            return chat;
        }
        public List<Chat> ListarMensagensNãoVisualizadasPeloPetshop(int idPetshop, int idUsuario)
        {
            var chat = ctx.Chats.Where(x => x.idPetshop == idPetshop && x.idUsuario == idUsuario && x.VisualizadoPetshop == false).ToList();
            // chat.Reverse();
            return chat;
        }
#endregion
#region "Quantidade de Mensagens não Visualizadas (Pelo Entregador e Pelo Cliente)"
        public List<ChatViewModel> ListarQuantidadeDeMensagensNaoVistasPeloPetshop(int idPetshop)
        {
            List<ChatViewModel> listProdutos = (from p in ctx.Chats.Where(x => x.idPetshop == idPetshop && x.VisualizadoPetshop == false)
                                                   select new ChatViewModel
                                                   {
                                                       idChat = p.idChat,
                                                       idUsuario = p.idUsuario,
                                                   }).ToList();         
            return listProdutos;
        }
        
        public List<ChatViewModel> ListarQuantidadeDeMensagensNaoVistasPeloCliente(int idUsuario)
        {
            List<ChatViewModel> listProdutos = (from p in ctx.Chats.Where(x => x.idUsuario == idUsuario && x.VisualizadoCliente == false)
                                                   select new ChatViewModel
                                                   {
                                                       idChat = p.idChat,
                                                       idUsuario = p.idPetshop,
                                                   }).ToList();         
            return listProdutos;
        }
      #endregion  
#region "Enviar Mensagem"
        public void EnviarMensagem(Chat chat)
        {
            chat.VisualizadoCliente = false;
            chat.VisualizadoPetshop = false;
            ctx.Chats.Add(chat);
            ctx.SaveChanges();
        }
        #endregion
#region "Mensagem visualizada"
        public void Atualizar_MensagemVisualizada(int idPetshop, int idUsuario)
        {
            var quantidade = ctx.Chats.Where(x => x.idPetshop == idPetshop && x.idUsuario == idUsuario).ToList().Count();
            if (quantidade != 0)
            {
                for (int i = 0; i < quantidade; i = i + 1)
                {
                    Chat chat = ctx.Chats.FirstOrDefault(x => x.idPetshop == idPetshop && x.idUsuario == idUsuario);
                    chat.VisualizadoCliente = true;
                    chat.VisualizadoPetshop = true;
                    ctx.Update(chat);
                    ctx.SaveChanges();
                }
            }
        }
        #endregion
#region "Atualizar Mensagens - Cliente ou Entregador"
        public void Atualizar_MensagemDoClientePorID(int id)
        {
            Chat chat = ctx.Chats.FirstOrDefault(x => x.idChat == id);
            chat.VisualizadoCliente = true;
            ctx.Update(chat);
            ctx.SaveChanges();
        }
        public void Atualizar_MensagemDoPetshopPorID(int id)
        {
            Chat chat = ctx.Chats.FirstOrDefault(x => x.idChat == id);
            chat.VisualizadoPetshop = true;
            ctx.Update(chat);
            ctx.SaveChanges();
        }
        #endregion
#region "Deletar Mensagens do chat entre Entregador e Usuario"
        public void DeletarChat(int idPetshop, int idUsuario)
        {
            var quantidade = ctx.Chats.Where(x => x.idPetshop == idPetshop && x.idUsuario == idUsuario).ToList().Count();
            if (quantidade != 0)
            {
                for (int i = 0; i < quantidade; i = i + 1)
                {
                    Chat chat = ctx.Chats.Where(x => x.idPetshop == idPetshop && x.idUsuario == idUsuario).FirstOrDefault();
                    ctx.Chats.Remove(chat);
                    ctx.SaveChanges();
                }
            }
        }
        #endregion
    }
}