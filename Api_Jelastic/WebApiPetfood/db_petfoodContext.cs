using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using WebApiPetfood.Models;

#nullable disable

namespace WebApiPetfood
{
    public partial class db_petfoodContext : DbContext
    {
        public db_petfoodContext()
        {
        }

        public db_petfoodContext(DbContextOptions<db_petfoodContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Administrador> Administradors { get; set; }
        public virtual DbSet<Imgproduto> Imgprodutos { get; set; }
        public virtual DbSet<Imgpetshop> Imgpetshops { get; set; }
        public virtual DbSet<ImgMotoboy> Imgmotoboy { get; set; }
        public virtual DbSet<Motoboy> Motoboys { get; set; }
        public virtual DbSet<Petshop> Petshops { get; set; }
        public virtual DbSet<Produto> Produtos { get; set; }
        public virtual DbSet<Propaganda> Propagandas { get; set; }
        public virtual DbSet<Tipousuario> Tipousuarios { get; set; }
        public virtual DbSet<Usuario> Usuarios { get; set; }
        public virtual DbSet<Endereco> Enderecos { get; set; }
        public virtual DbSet<Notificacao> Notificacaos { get; set; }
        public virtual DbSet<Chat> Chats { get; set; }
        public virtual DbSet<ChatEntregadorUsuario> ChatEntregadorUsuarios { get; set; }
        public virtual DbSet<Avaliacao> Avaliacaos { get; set; }
        public virtual DbSet<AvaliacaoMotoboy> AvaliacaoMotoboys { get; set; }
        public virtual DbSet<Frete> Fretes { get; set; }
        public virtual DbSet<FreteGratis> FreteGratiss { get; set; }
        public virtual DbSet<InfoPedido> InfoPedidos { get; set; }
        public virtual DbSet<Categoria> Categorias { get; set; }
        public virtual DbSet<TermosCondicoes> Termos { get; set; }
        public virtual DbSet<TermosPetshop> TermosPetshops { get; set; }
        public virtual DbSet<TermosMotoboy> TermosMotoboys { get; set; }
        public virtual DbSet<LogUsuario> LogUsuarios { get; set; }
        public virtual DbSet<LogPetshop> LogPetshops { get; set; }
        public virtual DbSet<LogMotoboy> LogMotoboys { get; set; }
        public virtual DbSet<LocalizacaoMotoboy> LocalizacaoMotoboys { get; set; }
        public virtual DbSet<Getnet> Getnets { get; set; }
        public virtual DbSet<FirebaseEntregador> FirebaseEntregadors { get; set; }
        public virtual DbSet<LogisticaDoPetshop> LogisticaDoPetshops { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql("Host=10.100.32.236;Port=5432;Username=webadmin;Database=postgres;Password=4Jg4AnI4J2;timeout=30;commandtimeout=0");
            }
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "Portuguese_Brazil.1252");

            modelBuilder.Entity<Administrador>(entity =>
            {
                entity.HasKey(e => e.Idadministrador)
                    .HasName("administrador_pkey");

                entity.ToTable("administrador");

                entity.HasIndex(e => e.Email, "administrador_email_key")
                    .IsUnique();

                entity.Property(e => e.Idadministrador).HasColumnName("idadministrador");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(90)
                    .HasColumnName("email");

                entity.Property(e => e.Idtipousuario).HasColumnName("idtipousuario");

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("nome");

                entity.Property(e => e.Senha)
                    .IsRequired()
                    .HasMaxLength(128)
                    .HasColumnName("senha");

                entity.HasOne(d => d.IdtipousuarioNavigation)
                    .WithMany(p => p.Administradors)
                    .HasForeignKey(d => d.Idtipousuario)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_tipodeusuario");
            });

            modelBuilder.Entity<Imgproduto>(entity =>
            {
                entity.HasKey(e => e.Idimg)
                    .HasName("imgproduto_pkey");

                entity.ToTable("imgproduto");

                entity.Property(e => e.Idimg).HasColumnName("idimg");

                entity.Property(e => e.Idproduto).HasColumnName("idproduto");

                entity.Property(e => e.Img).HasColumnName("img");

                entity.HasOne(d => d.IdprodutoNavigation)
                    .WithMany(p => p.Imgprodutos)
                    .HasForeignKey(d => d.Idproduto)
                    .OnDelete(DeleteBehavior.ClientCascade)
                    .HasConstraintName("fk_idproduto");
            });

            modelBuilder.Entity<Imgpetshop>(entity =>
            {
                entity.HasKey(e => e.Idimgpetshop)
                    .HasName("imgpetshop_pkey");

                entity.HasIndex(e => e.Idpetshop, "imgpetshop_idpetshop_key")
                    .IsUnique();

                entity.ToTable("imgpetshop");

                entity.Property(e => e.Idimgpetshop).HasColumnName("idimgpetshop");

                entity.Property(e => e.Idpetshop).HasColumnName("idpetshop");

                entity.Property(e => e.Img)
                .IsRequired()
                .HasMaxLength(150000)
                .HasColumnName("img");

                entity.HasOne(d => d.IdpetshopNavigation)
                    .WithMany(p => p.Imgpetshops)
                    .HasForeignKey(d => d.Idpetshop)
                    .OnDelete(DeleteBehavior.ClientCascade)
                    .HasConstraintName("fk_idproduto");
            });

            modelBuilder.Entity<Motoboy>(entity =>
            {
                entity.HasKey(e => e.Idmotoboy)
                    .HasName("motoboy_pkey");

                entity.ToTable("motoboy");

                entity.HasIndex(e => e.Email, "motoboy_email_key")
                    .IsUnique();

                entity.HasIndex(e => e.Cpf, "motoboy_cpf_key")
                    .IsUnique();

                entity.Property(e => e.Idmotoboy).HasColumnName("idmotoboy");

                entity.Property(e => e.Avaliacao).HasColumnName("avaliacao");

                entity.Property(e => e.Carteiradigital).HasColumnName("carteiradigital");
                entity.Property(e => e.Aprovado).HasColumnName("aprovado");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(90)
                    .HasColumnName("email");

                entity.Property(e => e.Idtipousuario).HasColumnName("idtipousuario");

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasMaxLength(200)
                    .HasColumnName("nome");

                entity.Property(e => e.Senha)
                    .IsRequired()
                    .HasMaxLength(128)
                    .HasColumnName("senha");

                entity.Property(e => e.Telefone)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("telefone");

                entity.Property(e => e.Cpf)
                    .IsRequired()
                    .HasMaxLength(14)
                    .HasColumnName("cpf");

                entity.HasOne(d => d.IdtipousuarioNavigation)
                    .WithMany(p => p.Motoboys)
                    .HasForeignKey(d => d.Idtipousuario)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_tipodeusuario");
            });

            modelBuilder.Entity<Petshop>(entity =>
            {
                entity.HasKey(e => e.Idpetshop)
                    .HasName("petshop_pkey");

                entity.ToTable("petshop");

                entity.HasIndex(e => e.Email, "petshop_email_key")
                    .IsUnique();

                entity.Property(e => e.Idpetshop).HasColumnName("idpetshop");

                entity.Property(e => e.Avaliacao).HasColumnName("avaliacao");

                entity.Property(e => e.Cep)
                    .IsRequired()
                    .HasMaxLength(10)
                    .HasColumnName("cep");

                entity.Property(e => e.Cidade)
                    .IsRequired()
                    .HasMaxLength(75)
                    .HasColumnName("cidade");

                entity.Property(e => e.Estado)
                    .IsRequired()
                    .HasMaxLength(2)
                    .HasColumnName("estado");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(90)
                    .HasColumnName("email");

                entity.Property(e => e.Endereco)
                    .IsRequired()
                    .HasMaxLength(120)
                    .HasColumnName("endereco");

                entity.Property(e => e.Horaabertura)
                    .HasMaxLength(15)
                    .HasColumnName("horaabertura");

                entity.Property(e => e.Horafechamento)
                    .HasMaxLength(15)
                    .HasColumnName("horafechamento");

                entity.Property(e => e.Idtipousuario).HasColumnName("idtipousuario");

                entity.Property(e => e.Latitude)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("latitude");

                entity.Property(e => e.Longitude)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("longitude");

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("nome");

                entity.Property(e => e.Senha)
                    .IsRequired()
                    .HasMaxLength(128)
                    .HasColumnName("senha");

                entity.Property(e => e.Status).HasColumnName("status");

                entity.Property(e => e.deletado)
                    .HasColumnName("deletado");

                entity.Property(e => e.Telefone)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("telefone");

                entity.Property(e => e.Carteiradigital).HasColumnName("carteiradigital");

                entity.Property(e => e.Logistica).HasColumnName("logistica");
                entity.Property(e => e.RetirarNaLoja).HasColumnName("retirarnaloja");

                entity.HasOne(d => d.IdtipousuarioNavigation)
                    .WithMany(p => p.Petshops)
                    .HasForeignKey(d => d.Idtipousuario)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_tipodeusuario");
                
                entity.HasOne(d => d.LogisticaNavigation)
                    .WithMany(p => p.Petshops)
                    .HasForeignKey(d => d.Logistica)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_logisticadopetshop");
            });

            modelBuilder.Entity<Produto>(entity =>
            {
                entity.HasKey(e => e.Idproduto)
                    .HasName("produto_pkey");

                entity.ToTable("produto");

                entity.Property(e => e.Idproduto).HasColumnName("idproduto");

                entity.Property(e => e.Descricao)
                    .IsRequired()
                    .HasColumnName("descricao");

                entity.Property(e => e.Idpetshop)
                    .IsRequired()
                    .HasColumnName("idpetshop");

                entity.Property(e => e.Preco)
                    .IsRequired()
                    .HasMaxLength(3)
                    .HasColumnName("preco");

                entity.Property(e => e.Titulo)
                    .IsRequired()
                    .HasMaxLength(90)
                    .HasColumnName("titulo");

                entity.Property(e => e.disponivel)
                    .HasColumnName("disponivel");

                entity.Property(e => e.deletado)
                    .HasColumnName("deletado");

                entity.Property(e => e.idCategoria).HasColumnName("idcategoria");

                entity.HasOne(d => d.IdpetshopNavigation)
                    .WithMany(p => p.Produtos)
                    .HasForeignKey(d => d.Idpetshop)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_idpetshop");
                
                entity.HasOne(d => d.IdcategoriaNavigation)
                    .WithMany(p => p.Produtos)
                    .HasForeignKey(d => d.idCategoria)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_idcategoria");

            });

            modelBuilder.Entity<Endereco>(entity =>
            {
                entity.HasKey(e => e.Idendereco)
                    .HasName("endereco_pkey");

                entity.ToTable("endereco");

                entity.Property(e => e.Idendereco).HasColumnName("idendereco");

                entity.Property(e => e.enderecoRua)
                    .IsRequired()
                    .HasMaxLength(90)
                    .HasColumnName("endereco");
                
                entity.Property(e => e.Bairro)
                    .IsRequired()
                    .HasMaxLength(90)
                    .HasColumnName("bairro");

                entity.Property(e => e.Cep)
                    .IsRequired()
                    .HasMaxLength(14)
                    .HasColumnName("cep");

                entity.Property(e => e.Cidade)
                    .IsRequired()
                    .HasMaxLength(75)
                    .HasColumnName("cidade");

                entity.Property(e => e.Estado)
                    .IsRequired()
                    .HasMaxLength(2)
                    .HasColumnName("estado");

                entity.Property(e => e.numero)
                    .IsRequired()
                    .HasMaxLength(90)
                    .HasColumnName("numero");

                entity.Property(e => e.Complemento)
                    .HasMaxLength(255)
                    .HasColumnName("complemento");

                entity.Property(e => e.latitude).HasColumnName("latitude");

                entity.Property(e => e.longitude).HasColumnName("longitude");

                entity.Property(e => e.Idusuario).HasColumnName("idusuario");

                entity.HasOne(d => d.IdusuarioNavigation)
                    .WithMany(p => p.Enderecos)
                    .HasForeignKey(d => d.Idusuario)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_idusuario");
            });

            modelBuilder.Entity<Notificacao>(entity =>
            {
                entity.HasKey(e => e.idNotificacao)
                    .HasName("notificacao_pkey");

                entity.ToTable("notificacao_petshop");

                entity.Property(e => e.idNotificacao).HasColumnName("idnotificacao");

                entity.Property(e => e.Tipo)
                    .IsRequired()
                    .HasColumnName("tipo");

                entity.Property(e => e.idPetshop).HasColumnName("idpetshop");

                entity.Property(e => e.Visualizado)
                    .IsRequired()
                    .HasColumnName("visualizado");

                entity.HasOne(d => d.IdpetshopNavigation)
                    .WithMany(p => p.Notificacaos)
                    .HasForeignKey(d => d.idPetshop)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_idpetshop");
            });

            modelBuilder.Entity<Propaganda>(entity =>
            {
                entity.HasKey(e => e.idPropaganda)
                    .HasName("propaganda_pkey");

                entity.ToTable("propaganda");

                entity.Property(e => e.idPropaganda).HasColumnName("idpropaganda");

                entity.Property(e => e.Titulo)
                    .HasColumnName("titulo");

                entity.Property(e => e.urlRedirecionamento)
                    .HasColumnName("url");
                                        
                entity.Property(e => e.Descricao)
                    .HasColumnName("descricao");

                entity.Property(e => e.Imagem)
                    .HasColumnName("imagem");
                entity.Property(e => e.Ativa)
                    .HasColumnName("ativa");
            });

            modelBuilder.Entity<Tipousuario>(entity =>
            {
                entity.HasKey(e => e.Idtipousuario)
                    .HasName("tipousuario_pkey");

                entity.ToTable("tipousuario");

                entity.Property(e => e.Idtipousuario).HasColumnName("idtipousuario");

                entity.Property(e => e.Tipo)
                    .HasMaxLength(45)
                    .HasColumnName("tipo");
            });

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(e => e.Idusuario)
                    .HasName("usuario_pkey");

                entity.ToTable("usuario");

                entity.HasIndex(e => e.Email, "usuario_email_key")
                    .IsUnique();

                entity.HasIndex(e => e.Cpf, "usuario_cpf_key")
                        .IsUnique();

                entity.Property(e => e.Idusuario).HasColumnName("idusuario");

                entity.Property(e => e.Carteiradigital).HasColumnName("carteiradigital");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(90)
                    .HasColumnName("email");

                entity.Property(e => e.Idtipousuario).HasColumnName("idtipousuario");

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasMaxLength(200)
                    .HasColumnName("nome");

                entity.Property(e => e.Senha)
                    .IsRequired()
                    .HasMaxLength(128)
                    .HasColumnName("senha");

                entity.Property(e => e.Telefone)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("telefone");

                entity.Property(e => e.Cpf)
                    .IsRequired()
                    .HasMaxLength(128)
                    .HasColumnName("cpf");

                entity.HasOne(d => d.IdtipousuarioNavigation)
                    .WithMany(p => p.Usuarios)
                    .HasForeignKey(d => d.Idtipousuario)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_tipodeusuario");
            });

            modelBuilder.Entity<Chat>(entity =>
                       {
                           entity.HasKey(e => e.idChat)
                               .HasName("chat_pkey");

                           entity.ToTable("chat");

                           entity.Property(e => e.idChat).HasColumnName("idchat");


                           entity.Property(e => e.idUsuario).HasColumnName("idusuario");

                           entity.Property(e => e.idPetshop).HasColumnName("idpetshop");

                           entity.Property(e => e.Mensagem).HasColumnName("mensagem");

                           entity.Property(e => e.Emissor).HasColumnName("emissor");

                           entity.Property(e => e.VisualizadoCliente).HasColumnName("visualizadoCliente");
                           entity.Property(e => e.VisualizadoPetshop).HasColumnName("visualizadoPetshop");

                           entity.HasOne(d => d.IdusuarioNavigation)
                                .WithMany(p => p.Chats)
                                .HasForeignKey(d => d.idUsuario)
                                .OnDelete(DeleteBehavior.ClientSetNull)
                                .HasConstraintName("fk_idusuario");

                           entity.HasOne(d => d.IdpetshopNavigation)
                                .WithMany(p => p.Chats)
                                .HasForeignKey(d => d.idPetshop)
                                .OnDelete(DeleteBehavior.ClientSetNull)
                                .HasConstraintName("fk_idpetshop");

                           entity.HasOne(d => d.IdtipousuarioNavigation)
                                .WithMany(p => p.Chats)
                                .HasForeignKey(d => d.Emissor)
                                .OnDelete(DeleteBehavior.ClientSetNull)
                                .HasConstraintName("fk_tipodeusuario");

                       });
            
            modelBuilder.Entity<ChatEntregadorUsuario>(entity =>
                       {
                           entity.HasKey(e => e.idChat)
                               .HasName("chat_pkey");

                           entity.ToTable("chat_entregador_usuario");

                           entity.Property(e => e.idChat).HasColumnName("idchat");


                           entity.Property(e => e.idUsuario).HasColumnName("idusuario");

                           entity.Property(e => e.idEntregador).HasColumnName("identregador");

                           entity.Property(e => e.Mensagem).HasColumnName("mensagem");

                           entity.Property(e => e.Emissor).HasColumnName("emissor");

                           entity.Property(e => e.VisualizadoCliente).HasColumnName("visualizadocliente");
                           entity.Property(e => e.VisualizadoEntregador).HasColumnName("visualizadoentregador");

                           entity.HasOne(d => d.IdusuarioNavigation)
                                .WithMany(p => p.ChatEntregadorUsuarios)
                                .HasForeignKey(d => d.idUsuario)
                                .OnDelete(DeleteBehavior.ClientSetNull)
                                .HasConstraintName("fk_idusuario");

                           entity.HasOne(d => d.IdmotoboyNavigation)
                                .WithMany(p => p.ChatEntregadorUsuarios)
                                .HasForeignKey(d => d.idEntregador)
                                .OnDelete(DeleteBehavior.ClientSetNull)
                                .HasConstraintName("fk_idmotoboy");

                           entity.HasOne(d => d.IdtipousuarioNavigation)
                                .WithMany(p => p.ChatEntregadorUsuarios)
                                .HasForeignKey(d => d.Emissor)
                                .OnDelete(DeleteBehavior.ClientSetNull)
                                .HasConstraintName("fk_tipodeusuario");

                       });

            modelBuilder.Entity<Avaliacao>(entity =>
                        {
                            entity.HasKey(e => e.idAvaliacao)
                                .HasName("avaliacao_pkey");

                            entity.ToTable("avaliacao");

                            entity.Property(e => e.idAvaliacao).HasColumnName("idavaliacao");
                            entity.Property(e => e.nota1).HasColumnName("nota1");
                            entity.Property(e => e.nota2).HasColumnName("nota2");
                            entity.Property(e => e.nota3).HasColumnName("nota3");
                            entity.Property(e => e.nota4).HasColumnName("nota4");
                            entity.Property(e => e.nota5).HasColumnName("nota5");
                            entity.Property(e => e.idPetshop).HasColumnName("idpetshop");

                            entity.HasOne(d => d.IdpetshopNavigation)
                                .WithMany(p => p.Avaliacaos)
                                .HasForeignKey(d => d.idPetshop)
                                .OnDelete(DeleteBehavior.ClientSetNull)
                                .HasConstraintName("fk_idpetshop");
                        });
           
            modelBuilder.Entity<AvaliacaoMotoboy>(entity =>
                        {
                            entity.HasKey(e => e.idAvaliacao)
                                .HasName("avaliacao_pkey");

                            entity.ToTable("avaliacaomotoboy");

                            entity.Property(e => e.idAvaliacao).HasColumnName("idavaliacao");
                            entity.Property(e => e.nota1).HasColumnName("nota1");
                            entity.Property(e => e.nota2).HasColumnName("nota2");
                            entity.Property(e => e.nota3).HasColumnName("nota3");
                            entity.Property(e => e.nota4).HasColumnName("nota4");
                            entity.Property(e => e.nota5).HasColumnName("nota5");
                            entity.Property(e => e.idMotoboy).HasColumnName("idmotoboy");

                            entity.HasOne(d => d.IdmotoboyNavigation)
                                .WithMany(p => p.AvaliacaoMotoboys)
                                .HasForeignKey(d => d.idMotoboy)
                                .OnDelete(DeleteBehavior.ClientCascade)
                                .HasConstraintName("fk_idmotoboy");
                        });
           
            modelBuilder.Entity<Frete>(entity =>
                       {
                           entity.HasKey(e => e.idFrete)
                                .HasName("frete_pkey");

                           entity.ToTable("frete");
                           entity.Property(e => e.idFrete).HasColumnName("idfrete");
                           entity.Property(e => e.Distancia)
                            .IsRequired()
                            .HasColumnName("distancia");

                           entity.Property(e => e.Preco)
                           .HasColumnName("preco");
                       });

            modelBuilder.Entity<FreteGratis>(entity =>
                       {
                           entity.HasKey(e => e.id)
                                .HasName("fretegratis_pkey");

                           entity.ToTable("freteGratis");
                           entity.Property(e => e.id).HasColumnName("id");
                           entity.Property(e => e.Preco).HasColumnName("preco");
                       });

            modelBuilder.Entity<InfoPedido>(entity =>
                       {
                           entity.HasKey(e => e.idPedido)
                                .HasName("infopedido_pkey");

                           entity.ToTable("infopedido");

                           entity.Property(e => e.idPedido).HasColumnName("idpedido");
                           entity.Property(e => e.codigoDePedido).HasColumnName("codigodepedido");
                           entity.Property(e => e.Status).HasColumnName("status");
                           entity.Property(e => e.dataDoPedido).HasColumnName("datadopedido");
                           entity.Property(e => e.Distancia).HasColumnName("distancia");
                           entity.Property(e => e.PrecoFrete).HasColumnName("precofrete");
                           entity.Property(e => e.PrecoProduto).HasColumnName("precoproduto");
                           entity.Property(e => e.PrecoTotal).HasColumnName("precototal");

                           entity.Property(e => e.idPetshop).HasColumnName("idpetshop");
                           entity.Property(e => e.idEntregador).HasColumnName("idEntregador");
                           entity.Property(e => e.idUsuario).HasColumnName("idusuario");
                           entity.Property(e => e.idEndereco).HasColumnName("idendereco");
                           entity.Property(e => e.Pagamento).HasColumnName("formaDePagamento");

                           entity.Property(e => e.PrecoProduto)
                           .HasColumnName("precoproduto");

                           entity.Property(e => e.PrecoFrete)
                           .HasColumnName("precofrete");

                           entity.Property(e => e.PrecoTotal)
                           .HasColumnName("precototal");

                           entity.HasOne(d => d.IdpetshopNavigation)
                                .WithMany(p => p.InfoPedidos)
                                .HasForeignKey(d => d.idPetshop)
                                .OnDelete(DeleteBehavior.ClientSetNull)
                                .HasConstraintName("fk_idpetshop");

                           entity.HasOne(d => d.IdusuarioNavigation)
                                .WithMany(p => p.InfoPedidos)
                                .HasForeignKey(d => d.idUsuario)
                                .OnDelete(DeleteBehavior.ClientSetNull)
                                .HasConstraintName("fk_idusuario");

                           entity.HasOne(d => d.IdenderecoNavigation)
                                .WithMany(p => p.InfoPedidos)
                                .HasForeignKey(d => d.idEndereco)
                                .OnDelete(DeleteBehavior.ClientSetNull)
                                .HasConstraintName("fk_idendereco");

                       });
            
            modelBuilder.Entity<Categoria>(entity =>
                       {
                           entity.HasKey(e => e.idCategoria)
                                .HasName("categoria_pkey");

                           entity.ToTable("categoriadoproduto");
                           entity.Property(e => e.idCategoria).HasColumnName("idcategoria");
                           entity.Property(e => e.icone)
                            .IsRequired()
                            .HasColumnName("icone");

                           entity.Property(e => e.categoria)
                            .IsRequired()
                            .HasColumnName("categoria");
                       });
          
            modelBuilder.Entity<TermosCondicoes>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("termos_condicoes_pkey");

                entity.ToTable("termos_condicoes");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.data)
                    .HasMaxLength(50)
                    .HasColumnName("data");

                entity.Property(e => e.ipDoUsuario)
                    .HasMaxLength(50)
                    .HasColumnName("ipdousuario");

                entity.Property(e => e.navegadorDoUsuario)
                    .HasMaxLength(200)
                    .HasColumnName("navegadordousuario");

                entity.Property(e => e.idUsuario).HasColumnName("idusuario");

                entity.HasOne(d => d.IdusuarioNavigation)
                    .WithMany(p => p.Termos)
                    .HasForeignKey(d => d.idUsuario)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_idusuario");
            });

            modelBuilder.Entity<TermosPetshop>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("termos_petshop_pkey");

                entity.ToTable("termos_petshop");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.data)
                    .HasMaxLength(50)
                    .HasColumnName("data");

                entity.Property(e => e.ipDoPetshop)
                    .HasMaxLength(50)
                    .HasColumnName("ipdousuario");

                entity.Property(e => e.navegadorDoPetshop)
                    .HasMaxLength(200)
                    .HasColumnName("navegadordousuario");

                entity.Property(e => e.idPetshop).HasColumnName("idpetshop");

                entity.HasOne(d => d.IdpetshopNavigation)
                    .WithMany(p => p.TermosPetshop)
                    .HasForeignKey(d => d.idPetshop)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_idpetshop");
            });

            modelBuilder.Entity<TermosMotoboy>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("termos_motoboy_pkey");

                entity.ToTable("termos_motoboy");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.data)
                    .HasMaxLength(50)
                    .HasColumnName("data");

                entity.Property(e => e.ipDoMotoboy)
                    .HasMaxLength(50)
                    .HasColumnName("ipdousuario");

                entity.Property(e => e.navegadorDoMotoboy)
                    .HasMaxLength(200)
                    .HasColumnName("navegadordousuario");

                entity.Property(e => e.idMotoboy).HasColumnName("idmotoboy");

                entity.HasOne(d => d.IdmotoboyNavigation)
                    .WithMany(p => p.TermosMotoboy)
                    .HasForeignKey(d => d.idMotoboy)
                    .OnDelete(DeleteBehavior.ClientCascade)
                    .HasConstraintName("fk_idmotoboy");
            });

            modelBuilder.Entity<LogUsuario>(entity =>
            {
                entity.HasKey(e => e.idLog)
                    .HasName("logs_usuario_pkey");

                entity.ToTable("logs_usuario");

                entity.Property(e => e.idLog).HasColumnName("idlog");

                entity.Property(e => e.descricao)
                    .HasColumnName("descricao");

                entity.Property(e => e.ipUsuario)
                    .HasMaxLength(50)
                    .HasColumnName("ipdousuario");

                entity.Property(e => e.data)
                    .HasMaxLength(50)
                    .HasColumnName("data");

                entity.Property(e => e.idUsuario).HasColumnName("idusuario");

                entity.HasOne(d => d.IdusuarioNavigation)
                    .WithMany(p => p.LogUsuarios)
                    .HasForeignKey(d => d.idUsuario)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_idusuario");
            });
            
            modelBuilder.Entity<LogPetshop>(entity =>
            {
                entity.HasKey(e => e.idLog)
                    .HasName("logs_petshop_pkey");

                entity.ToTable("logs_petshop");

                entity.Property(e => e.idLog).HasColumnName("idlog");

                entity.Property(e => e.descricao)
                    .HasMaxLength(100)
                    .HasColumnName("descricao");

                entity.Property(e => e.ipPetshop)
                    .HasMaxLength(50)
                    .HasColumnName("ipdopetshop");

                entity.Property(e => e.data)
                    .HasMaxLength(50)
                    .HasColumnName("data");

                entity.Property(e => e.idPetshop).HasColumnName("idpetshop");

                entity.HasOne(d => d.IdpetshopNavigation)
                    .WithMany(p => p.LogPetshops)
                    .HasForeignKey(d => d.idPetshop)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_idpetshop");
            });
           
            modelBuilder.Entity<LogMotoboy>(entity =>
            {
                entity.HasKey(e => e.idLog)
                    .HasName("logs_motoboy_pkey");

                entity.ToTable("logs_motoboy");

                entity.Property(e => e.idLog).HasColumnName("idlog");

                entity.Property(e => e.descricao)
                    .HasMaxLength(100)
                    .HasColumnName("descricao");

                entity.Property(e => e.ipMotoboy)
                    .HasMaxLength(50)
                    .HasColumnName("ipdomotoboy");

                entity.Property(e => e.data)
                    .HasMaxLength(50)
                    .HasColumnName("data");

                entity.Property(e => e.idMotoboy).HasColumnName("idmotoboy");

                entity.HasOne(d => d.IdmotoboyNavigation)
                    .WithMany(p => p.LogMotoboys)
                    .HasForeignKey(d => d.idMotoboy)
                    .OnDelete(DeleteBehavior.ClientCascade)
                    .HasConstraintName("fk_idmotoboy");
            });

            modelBuilder.Entity<LocalizacaoMotoboy>(entity =>
            {
                entity.HasKey(e => e.Id)
                    .HasName("localizacaodomotoboy_pkey");

                entity.ToTable("localizacaodomotoboy");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Data)
                    .HasMaxLength(50)
                    .HasColumnName("data");

                entity.Property(e => e.Latitude)
                    .HasMaxLength(50)
                    .HasColumnName("latitude");

                entity.Property(e => e.Longitude)
                    .HasMaxLength(50)
                    .HasColumnName("longitude");

                entity.Property(e => e.idMotoboy).HasColumnName("idmotoboy");

                entity.HasOne(d => d.IdmotoboyNavigation)
                    .WithMany(p => p.LocalizacaoMotoboys)
                    .HasForeignKey(d => d.idMotoboy)
                    .OnDelete(DeleteBehavior.ClientCascade)
                    .HasConstraintName("fk_idmotoboy");
            });

            modelBuilder.Entity<Getnet>(entity =>
            {
                entity.HasKey(e => e.Id)
                    .HasName("getnet_pkey");

                entity.ToTable("getnet");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Credencial)
                    .HasColumnName("credencial");
            });
            
            modelBuilder.Entity<ImgMotoboy>(entity =>
            {
                entity.HasKey(e => e.Id)
                    .HasName("fotomotoboy_pkey");

                entity.ToTable("fotomotoboy");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.idMotoboy).HasColumnName("idmotoboy");

                entity.Property(e => e.Img)
                .IsRequired()
                .HasMaxLength(500000)
                .HasColumnName("imagem");

                entity.HasOne(d => d.IdmotoboyNavigation)
                    .WithMany(p => p.Imgmotoboy)
                    .HasForeignKey(d => d.idMotoboy)
                    .OnDelete(DeleteBehavior.ClientCascade)
                    .HasConstraintName("fk_idmotoboy");
            });

            modelBuilder.Entity<FirebaseEntregador>(entity =>
            {
                entity.HasKey(e => e.id)
                    .HasName("firebaseentregador_pkey");

                entity.ToTable("firebaseentregador");

                entity.Property(e => e.id).HasColumnName("id");

                entity.Property(e => e.tokenFirebase)
                    .HasMaxLength(256)
                    .HasColumnName("tokenfirebase");

                entity.Property(e => e.ipEntregador)
                    .HasMaxLength(128)
                    .HasColumnName("ipentregador");

                entity.Property(e => e.hora)
                    .HasMaxLength(50)
                    .HasColumnName("hora");

                entity.Property(e => e.idMotoboy).HasColumnName("idmotoboy");

                entity.HasOne(d => d.IdmotoboyNavigation)
                    .WithMany(p => p.FirebaseEntregadors)
                    .HasForeignKey(d => d.idMotoboy)
                    .OnDelete(DeleteBehavior.ClientCascade)
                    .HasConstraintName("fk_idmotoboy");
            });

            modelBuilder.Entity<LogisticaDoPetshop>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("logisticaDoPetshop_pkey");

                entity.ToTable("logisticaDoPetshop");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.TipoFrete).HasColumnName("tipoFrete");
            });
            
            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
