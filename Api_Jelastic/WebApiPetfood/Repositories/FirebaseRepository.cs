using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WebApiPetfood.Models;
using WebApiPetfood.Repositories;
using WebApiPetfood.ViewModel;

namespace WebApiPetfood.Repositories
{
    public class FirebaseRepository
    {
        db_petfoodContext ctx = new db_petfoodContext();
        
        public class Notificacao
        {
            public string title { get; set; }
            public string body { get; set; }
            public string click_action { get; set; }
            public string icon { get; set; }
        }
        public class NotificacaoCompleta
        {
            public Notificacao notification { get; set; }
            public string to { get; set; }
        }

        public void PostTokenEntregador(FirebaseEntregador firebase)
        {   
            firebase.hora = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"); 
            FirebaseEntregador f = ctx.FirebaseEntregadors.FirstOrDefault(x => x.idMotoboy == firebase.idMotoboy);

            if( f != null){
                f.hora =  DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
                f.tokenFirebase = firebase.tokenFirebase;
                f.ipEntregador = firebase.ipEntregador;
                ctx.Update(f);
                ctx.SaveChanges();
            } else {
                ctx.FirebaseEntregadors.Add(firebase);
                ctx.SaveChanges();
            }
        }

        public List<NotificarEntregadorViewModel> UltimaLocalizacaoComToken()
        {
            var EntregadoresPossiveisDeNotificar = ctx.FirebaseEntregadors.ToList();

            List<NotificarEntregadorViewModel> NotificarEssesEntregadores = (from tokenFirebase in ctx.FirebaseEntregadors
                                                                            select new NotificarEntregadorViewModel
                                                                            {
                                                                                FirebaseEntregador = tokenFirebase,
                                                                                UltimaLocalizacao = ctx.LocalizacaoMotoboys.OrderBy(Localizado => Localizado.Id).Last(x => x.idMotoboy == tokenFirebase.idMotoboy)
                                                                            }).ToList();
            return NotificarEssesEntregadores;
        }
    
        public void NotificarEntregadoresProximos(decimal Lat, decimal Lng)
        {            
            string url = ("https://fcm.googleapis.com/fcm/send");

            var Notification = new Notificacao {
                    title = "Novo Pedido!!!",
                    body = "Recebemos um novo pedido próximo a sua localização. Entre no app para aceita-lo!!",
                    click_action = "",
                    icon = "",
                };

            decimal latMax = Lat + Convert.ToDecimal(0.2);
            decimal latMin = Lat - Convert.ToDecimal(0.2);
            decimal lngMax = Lng + Convert.ToDecimal(0.2);
            decimal lngMin = Lng - Convert.ToDecimal(0.2);

            List<NotificarEntregadorViewModel> Entregadores = UltimaLocalizacaoComToken();
            int Repeticoes = Entregadores.Count();

            for (int i = 0; i < Repeticoes; i = i + 1)
                {
                    if( ( latMax >= Convert.ToDecimal(Entregadores[i].UltimaLocalizacao.Latitude)) && 
                        ( latMin <= Convert.ToDecimal(Entregadores[i].UltimaLocalizacao.Latitude)) && 
                        ( lngMax >= Convert.ToDecimal(Entregadores[i].UltimaLocalizacao.Longitude)) &&
                        ( lngMin <= Convert.ToDecimal(Entregadores[i].UltimaLocalizacao.Longitude))  
                    ) {
                        var NotificationComplete = new NotificacaoCompleta {
                            notification = Notification,
                            to = Entregadores[i].FirebaseEntregador.tokenFirebase
                        };
                        string jsonString = JsonConvert.SerializeObject(NotificationComplete);

                        try
                        {
                            WebRequest request = WebRequest.Create(url);
                            request.Headers.Add("Authorization", "key=AAAAragdeZw:APA91bESD7STobYkDv-ueEkfLxwazkKZzgqFrA28WIG60V-tD2EZjs0DRbT2uD12U2gWg7ijOarYLDyuA_h6RsQ6OtZZh_CyX7QQI-cb1ZqMieW3rgDRJ62dzrCYP1XU-dN7GX5HpFtQ");
                            request.ContentType = "application/json";
                            request.Method = "POST";

                            using( var streamWriter = new StreamWriter(request.GetRequestStream()) ){
                                streamWriter.Write(JObject.Parse(jsonString));
                                streamWriter.Flush();
                            }

                            var httpResponse = (HttpWebResponse)request.GetResponse();
                            Stream streamResposta = httpResponse.GetResponseStream();
                            StreamReader leitor = new StreamReader(streamResposta);
                            var objResponse = leitor.ReadToEnd();
                            var post = JObject.Parse(objResponse);
                        } catch (WebException ex){
                            Console.WriteLine(ex.InnerException.Message);
                        }                    
                
                    } 
                }
        }
    }
}