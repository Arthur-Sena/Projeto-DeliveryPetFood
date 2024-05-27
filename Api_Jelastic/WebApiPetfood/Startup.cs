using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.Certificate;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.HttpOverrides;
using WebApiPetfood.ViewModel;
using MongoDB.Bson.Serialization;

namespace WebApiPetfood
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // MongoDB-------------------------
            MongoDbContext.ConnectionString = Configuration.GetSection("MongoConnection:ConnectionString").Value;
            MongoDbContext.DatabaseName = Configuration.GetSection("MongoConnection:Database").Value;
            MongoDbContext.IsSSL = Convert.ToBoolean(this.Configuration.GetSection("MongoConnection:IsSSL").Value);

            if (!BsonClassMap.IsClassMapRegistered(typeof(PagamentoReturnViewModel)))
            {
               BsonClassMap.RegisterClassMap<PagamentoReturnViewModel>();
            }
            if (!BsonClassMap.IsClassMapRegistered(typeof(PagamentoErradoViewModel)))
            {
               BsonClassMap.RegisterClassMap<PagamentoErradoViewModel>();
            }
            if (!BsonClassMap.IsClassMapRegistered(typeof(PagamentoDebitoReturnViewModel)))
            {
               BsonClassMap.RegisterClassMap<PagamentoDebitoReturnViewModel>();
            }
            if (!BsonClassMap.IsClassMapRegistered(typeof(PagamentoPixReturnViewModel)))
            {
               BsonClassMap.RegisterClassMap<PagamentoPixReturnViewModel>();
            }

            // Postgre
            services.AddDbContext<db_petfoodContext>(options =>
            options.UseNpgsql(Configuration.GetConnectionString("PetFoodDB")));

            // -----------------------------------------------------------
            services.AddControllers().AddNewtonsoftJson(options =>
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            );

            services.AddCors(options =>
                       {
                           options.AddPolicy("CorsPolicy",
                               builder => builder
                                    .AllowAnyOrigin()
                                    .AllowAnyMethod()
                                    .AllowAnyHeader());
                           //    .AllowCredentials());
                       });
            // --------------------------------
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebApiPetfood", Version = "v1" });
            });

            services.AddAuthentication(
            CertificateAuthenticationDefaults.AuthenticationScheme)
            .AddCertificate()
            .AddCertificateCache();

            services.AddAuthentication(

            options =>
        {
            options.DefaultAuthenticateScheme = "JwtBearer";
            options.DefaultChallengeScheme = "JwtBearer";
        }

        ).AddJwtBearer("JwtBearer", options =>
        {
            options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                ValidateIssuer = true,

                ValidateAudience = true,

                ValidateLifetime = true,

                IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("PetFood-autenticacao")),

                ClockSkew = TimeSpan.FromMinutes(60),

                ValidIssuer = "WebApiPetfood",

                ValidAudience = "WebApiPetfood"
            };
        });
        
        services.AddControllersWithViews().AddNewtonsoftJson();

        services.Add(
        new ServiceDescriptor(
            typeof(IActionResultExecutor<JsonResult>),
            Type.GetType("Microsoft.AspNetCore.Mvc.Infrastructure.SystemTextJsonResultExecutor, Microsoft.AspNetCore.Mvc.Core"),
            ServiceLifetime.Singleton));

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            // app.UseHttpsRedirection();
            
            app.UseRouting();
            
            app.UseCors("CorsPolicy");

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseCookiePolicy();

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "PetFood API V1");
            });
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });


        }
    }
}