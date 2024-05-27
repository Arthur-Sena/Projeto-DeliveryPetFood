using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using WebApiPetfood.Models;
using WebApiPetfood.Repositories;

namespace WebApiPetfood.Repositories
{
    public class LogsRepository
    {
        db_petfoodContext ctx = new db_petfoodContext();
        
        public void PostLog(string desc, int idUser, string ip)
        {      
            if(ip=="" || ip==null){
                string host = Dns.GetHostName();
                ip = Dns.GetHostAddresses(host)[2].ToString();
            }      
            
            LogUsuario log = new LogUsuario();
            log.descricao = desc;
            log.ipUsuario = ip;
            log.data = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
            log.idUsuario = idUser;
            
            ctx.LogUsuarios.Add(log);
            ctx.SaveChanges();
        }
       
        public void PostLogPethop(string desc, int idPet, string ip)
        {      
            if(ip=="" || ip==null){
                string host = Dns.GetHostName();
                ip = Dns.GetHostAddresses(host)[2].ToString();
            }      
            
            LogPetshop log = new LogPetshop();
            log.descricao = desc;
            log.ipPetshop = ip;
            log.data = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
            log.idPetshop = idPet;
            ctx.LogPetshops.Add(log);
            ctx.SaveChanges();
        }
        public void PostLogMotoboy(string desc, int idMotoboy, string ip)
        {      
            if(ip=="" || ip==null){
                string host = Dns.GetHostName();
                ip = Dns.GetHostAddresses(host)[2].ToString();
            }      
            
            LogMotoboy log = new LogMotoboy();
            log.descricao = desc;
            log.ipMotoboy = ip;
            log.data = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
            log.idMotoboy = idMotoboy;
            ctx.LogMotoboys.Add(log);
            ctx.SaveChanges();
        }
    }
}