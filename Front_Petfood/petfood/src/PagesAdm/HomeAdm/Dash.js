import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Axios from 'axios';
import { parseJwt } from '../../services/auth.js';
import axios from 'axios';
//Css + images
import './Dash.css';
import Menu from '../../Component/MenuAdm';

let context, oscillator, contextGain = 0;
var ListUltimos;
function start() {
    let context = new AudioContext(),
        oscillator = context.createOscillator(),
        contextGain = context.createGain();

    oscillator.type = 'sine';
    oscillator.connect(contextGain);
    contextGain.connect(context.destination);
    oscillator.start(0);
    contextGain.gain.exponentialRampToValueAtTime(
        0.00001, context.currentTime + 5
    )
}

var geolocator = require("geolocator");
var distanciaSelecionada = "10Km";
var distancia;
var ip;

function salvarIp(retorno) {
    ip = retorno;
    localStorage.setItem("ip_user", ip);
}

class Dash extends Component {
    constructor() {
        super();
        this.state = {
            imgPetshop: [],
            mensagens: [],
            qntMensagens: 0,
            infoPetshop: [],
            eventKey: 'false',
            UltimosPedidos: [],
            QuantidadeProdutos: 0,
            QuantidadePetshop: 0,
            QuantidadeUsuario: 0,
            QuantidadeDePedidos: 0,
            QntPedidosEmAndamento: 0,
            Faturamento: 0.0,
            data: "",
            status: null,
            quantidadeDeMensagemNova: 0,
            looping: false,
            btnClicado: false,
            idPetshop: parseJwt().jti,
        }
    }

    contadorDeUsuario = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/usuario/count', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => this.setState({ QuantidadeUsuario: data }))
            .catch(error => console.log(error))
    }
    contadorDePetshop = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/petshop/count', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => this.setState({ QuantidadePetshop: data }))
            .catch(error => console.log(error))
    }
    contadorDeProdutos = (Permissao) => {
        if (Permissao === 'Petshop') {
            fetch('https://env-9048989.jelastic.saveincloud.net/api/produtos/petshop/' + parseJwt().jti + '/count', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => this.setState({ QuantidadeProdutos: data }))
                .catch(error => console.log(error))

        } else {
            fetch('https://env-9048989.jelastic.saveincloud.net/api/produtos/count', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => this.setState({ QuantidadeProdutos: data }))
                .catch(error => console.log(error))
        }
    }
    contadorDePedidos = (Permissao) => {
        if (Permissao === 'Petshop') {
            fetch('https://env-9048989.jelastic.saveincloud.net/api/pedidos/petshop/' + parseJwt().jti + '/count', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => this.setState({ QuantidadeDePedidos: data }))
                .catch(error => console.log(error))

            fetch('https://env-9048989.jelastic.saveincloud.net/api/pedidos/pedidosEmAndamento/petshop/' + parseJwt().jti, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => this.setState({ QntPedidosEmAndamento: data }))
                .catch(error => console.log(error))
        }
    }
    FaturamentoDoPetshop = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/dashboard/lucropetshop?idpetshop=' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => this.setState({ Faturamento: data.toLocaleString('pt-BR') }))
            .catch(error => console.log(error))
    }
    FaturamentoPetFood = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/dashboard/faturamento', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => this.setState({ Faturamento: data.precoTotal.toLocaleString('pt-BR') }))
            .catch(error => console.log(error))
    }
    eventTrue = (event) => {
        if (this.state.eventKey === 'false') {
            this.setState({ eventKey: 'true' })
        } else {
            this.setState({ eventKey: 'false' })
        }
    }
    listarUltimosPedidosLooping = () => {
        ListUltimos = setInterval(() => this.listarUltimosPedidos(), 10000);
    }
    listarUltimosPedidos = () => {
        let autorizacao = localStorage.getItem("usuario-petfood");
        if (autorizacao != null) {
            if (parseJwt().Permissao === 'Administrador' || parseJwt().Permissao === 'Diretor') {

                fetch('https://env-9048989.jelastic.saveincloud.net/api/pedidos/ADM', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'ip_usuario': localStorage.getItem("ip_user"),
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        this.setState({ UltimosPedidos: data });
                    })
                    .catch(error => console.log(error))
            }
            if (parseJwt().Permissao === 'Petshop') {
                fetch('https://env-9048989.jelastic.saveincloud.net/api/pedidos/recebidos/' + parseJwt().jti, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'ip_usuario': localStorage.getItem("ip_user"),
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        this.setState({ UltimosPedidos: data });
                        if (data.length != this.state.QntPedidosEmAndamento) {
                            if (this.state.looping == true) {
                                start();
                            }
                            this.setState({ QntPedidosEmAndamento: data.length });
                        }
                        this.setState({ looping: true });
                    })
                    .catch(error => console.log(error))

            }
        } else {
            clearInterval(ListUltimos);
        }
    }
    BuscarImgPetshop = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/petshop/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => this.setState({ imgPetshop: data[0].imgpetshops[0].img }) + this.setState({ infoPetshop: data[0].nome }) + this.setState({ status: data[0].status }))
            .catch(error => console.log(error))
    }
    componentDidMount() {
        if (parseJwt().Permissao === 'Administrador' || parseJwt().Permissao === 'Diretor') {
            this.contadorDePetshop();
            this.contadorDeUsuario();
            this.FaturamentoPetFood();
            this.contadorDeProdutos(parseJwt().Permissao);
            this.listarUltimosPedidos();
        } if (parseJwt().Permissao === 'Petshop') {
            this.BuscarImgPetshop();
            this.contadorDeProdutos(parseJwt().Permissao);
            this.contadorDePedidos(parseJwt().Permissao);
            this.FaturamentoDoPetshop();
            this.novasMensagens();
            this.contarNovasMensagens();
            this.listarUltimosPedidos();
        }
        this.nomeDoDispositivo();
        this.listarUltimosPedidosLooping();

    }

    AceitarPedido = (id) => {
        if (this.state.btnClicado == false) {
            this.setState({ btnClicado: true })

            Axios.put("https://env-9048989.jelastic.saveincloud.net/api/pedidos/AceitoPeloPetshop", {
                Id: id
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'ip_usuario': localStorage.getItem("ip_user"),
                },
            })
                .then(response => {
                    this.setState({ btnClicado: false })
                    this.setState({ QntPedidosEmAndamento: this.state.QntPedidosEmAndamento + 1 })
                    window.location.reload();
                })
                .catch(error => this.setState({ btnClicado: false }))
        }
    }

    PixRecebido = (id) => {
        if (this.state.btnClicado == false) {
            this.setState({ btnClicado: true })

            Axios.get("https://env-9048989.jelastic.saveincloud.net/api/pagamento/GetNet/AprovarPixManualmente?pedidoId=" + id, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                },
            })
                .then(response => {
                    this.setState({ btnClicado: false })
                    this.setState({ QntPedidosEmAndamento: this.state.QntPedidosEmAndamento + 1 })
                    window.location.reload();
                })
                .catch(error => this.setState({ btnClicado: false }))
        }
    }

    RecusarPedido = (id) => {
        if (this.state.btnClicado == false) {
            this.setState({ btnClicado: true })

            Axios.put("https://env-9048989.jelastic.saveincloud.net/api/pedidos/RecusadoPeloPetshop", {
                Id: id
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'ip_usuario': localStorage.getItem("ip_user"),
                },
            })
                .then(response => {
                    this.setState({ btnClicado: false })
                    this.setState({ QntPedidosEmAndamento: this.state.QntPedidosEmAndamento - 1 });
                    window.location.reload();
                })
                .catch(error => this.setState({ btnClicado: false }))
        }
    }

    ClienteRetirouOProduto = (id) => {
        if (this.state.btnClicado == false) {
            this.setState({ btnClicado: true })

            Axios.put("https://env-9048989.jelastic.saveincloud.net/api/pedidos/ClienteRetirouOProduto?idPedido=" + id, {}, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'ip_usuario': localStorage.getItem("ip_user"),
                },
            })
                .then(response => {
                    this.setState({ btnClicado: false })
                    this.setState({ QntPedidosEmAndamento: this.state.QntPedidosEmAndamento - 1 });
                    window.location.reload();
                })
                .catch(error => this.setState({ btnClicado: false }))
        }
    }

    AdmCancelarPedido = (id) => {
        if (this.state.btnClicado == false) {
            this.setState({ btnClicado: true })

            Axios.put("https://env-9048989.jelastic.saveincloud.net/api/pedidos/CanceladoPeloAdm", {
                Id: id
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'ip_usuario': localStorage.getItem("ip_user"),
                },
            })
                .then(response => {
                    this.setState({ btnClicado: false })
                    this.setState({ QntPedidosEmAndamento: this.state.QntPedidosEmAndamento - 1 });
                    window.location.reload();
                })
                .catch(error => this.setState({ btnClicado: false }))
        }
    }

    abrirOuFecharLoja = () => {
        Axios.put("https://env-9048989.jelastic.saveincloud.net/api/petshop/Status", {
            idpetshop: parseJwt().jti,
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('usuario-petfood')
            }
        }).then(response => {
            if (response.status === 200) {
                window.location.reload();
            }
        })
    }

    novasMensagens = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/chat/NovasMensagens?idPetshop=' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ mensagens: data });
            })
            .catch(error => console.log(error))
    }

    contarNovasMensagens = () => {
        let autorizacao = localStorage.getItem("usuario-petfood");
        if (autorizacao != null) {
            var novasMensagens = setInterval(() => fetch('https://env-9048989.jelastic.saveincloud.net/api/chat/NovasMensagens/Count?idPetshop=' + this.state.idPetshop, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    this.setState({ qntMensagens: data });
                    if (this.state.qntMensagens != this.state.mensagens.length) {
                        this.novasMensagens();
                    }
                })
                .catch(error => console.log(error)), 3000)
        } else {
            clearInterval(novasMensagens);
            clearInterval(0);
            clearInterval(1);
            clearInterval(2);
            clearInterval(3);
        }
    }

    verificarNovaMensagem = (id) => {
        const novaMensagem = this.state.mensagens.filter(x => {
            return x.idUsuario == id;
        });
        if (novaMensagem.length != 0) {
            if (this.state.quantidadeDeMensagemNova != novaMensagem.length) {
                start();
                this.setState({ quantidadeDeMensagemNova: novaMensagem.length });
            }
            return novaMensagem.length + " Novas"
        } else {
            return ""
        }
    }

    nomeDoDispositivo = () => {
        if (localStorage.getItem("ip_user") != "" && localStorage.getItem("ip_user") != null) {
            console.log("Olá Hacker :)");
        } else {
            geolocator.getIP(function (err, result) {
                if (result != null) {
                    salvarIp(result.ip);
                }
            });
        }
    }

    PetshopIniciaEntrega = (id) => {
        if (this.state.btnClicado == false) {
            this.setState({ btnClicado: true })

            Axios.put("https://env-9048989.jelastic.saveincloud.net/api/pedidos/EntregaIniciadaPeloPetshop", {
                Id: id
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'ip_usuario': localStorage.getItem("ip_user"),
                },
            })
                .then(response => {
                    this.setState({ btnClicado: false })
                    this.setState({ QntPedidosEmAndamento: this.state.QntPedidosEmAndamento - 1 });
                    window.location.reload();
                })
                .catch(error => this.setState({ btnClicado: false }))
        }
    }

    PetshopEntregouPedido = (id) => {
        if (this.state.btnClicado == false) {
            this.setState({ btnClicado: true })

            Axios.put("https://env-9048989.jelastic.saveincloud.net/api/pedidos/PedidoEntreguePeloPetshop", {
                Id: id
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'ip_usuario': localStorage.getItem("ip_user"),
                },
            })
                .then(response => {
                    this.setState({ btnClicado: false })
                    this.setState({ QntPedidosEmAndamento: this.state.QntPedidosEmAndamento - 1 });
                    window.location.reload();
                })
                .catch(error => this.setState({ btnClicado: false }))
        }
    }

    render() {
        return (
            <div className="Dash" >
                <nav className='navDash'>
                    <h1>Home</h1>
                    {parseJwt().Permissao != 'Administrador' && parseJwt().Permissao != 'Diretor' ? (
                        <div className="div_btnStatus">
                            {this.state.status == false || this.state.status == false ? (
                                <button
                                    className="btn_LojaFechada"
                                    onClick={this.abrirOuFecharLoja}
                                >
                                    Fechado
                                </button>
                            ) : (
                                <button
                                    className="btn_LojaAberta"
                                    onClick={this.abrirOuFecharLoja}
                                >
                                    Aberto
                                </button>
                            )}
                        </div>
                    ) : (
                        <div>
                        </div>
                    )}
                </nav>

                <Menu />

                <div className='divDashboard'>

                    <div className='dashInfo'>
                        <h1>{this.state.QuantidadeProdutos}</h1>
                        <h5>Produtos</h5>
                    </div>

                    {parseJwt().Permissao === 'Administrador' || parseJwt().Permissao === 'Diretor' ? (
                        <div className='dashInfo'>
                            <h1>{this.state.QuantidadeUsuario}</h1>
                            <h5>Users</h5>
                        </div>
                    ) : (
                        <div className='dashInfo'>
                            <h1>{this.state.QntPedidosEmAndamento}</h1>
                            <h5>Pedidos<br />Em Andamento</h5>
                        </div>
                    )}
                    <div className='dashInfo'>
                        <h1>{this.state.Faturamento}</h1>
                        <h5>Faturamento (R$)</h5>
                    </div>

                    {parseJwt().Permissao === 'Administrador' || parseJwt().Permissao === 'Diretor' ? (
                        <div className='dashInfo'>
                            <h1>{this.state.QuantidadePetshop}</h1>
                            <h5>Lojas</h5>
                        </div>
                    ) : (
                        <div className='dashInfo'>
                            <h1>{this.state.QuantidadeDePedidos}</h1>
                            <h5>Pedidos</h5>
                        </div>
                    )}

                </div>

                <div className='PedidosRecentes'>
                    <br></br>
                    <h2 className='h2Pedidos'>Pedidos Recentes</h2>
                    <div className="divListaPedidosRecentes_Dash">
                        {
                            // this.state.UltimosPedidos.length == 0 ? (

                            this.state.UltimosPedidos.map(x => {
                                let data = x.horaDeEntrega_Retirada.horarioDoPedido.split(" ");

                                return (
                                    <div className="Div_BoxPedidos">
                                        <div className='boxPedidosRecentes' style={{ height: '80px' }} >
                                            {parseJwt().Permissao === 'Petshop' ? (
                                                <div className='divImgPedido'>
                                                    <Link to="/ProdutosPedidos"
                                                        onClick={() => { localStorage.setItem("idPedido", x.id) }}
                                                        style={{ textDecoration: "none" }}
                                                    >
                                                        <img src={this.state.imgPetshop} className='imgPedido' />
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div>
                                                    {/* IMG PETSHOP */}
                                                    {/* <img src={petshop.imgPetshop[0]} className='imgPedido' /> */}
                                                </div>
                                            )}
                                            <Link to="/ProdutosPedidos"
                                                onClick={() => { localStorage.setItem("idPedido", x.id) }}
                                                style={{ textDecoration: "none" }}
                                            >
                                                <div className='divText'>
                                                    <p><strong>{x.caminhoDaEntrega.from.petshop}</strong></p>
                                                    <p>{data[0]}</p>
                                                    <p>{data[1]}</p>
                                                </div>
                                            </Link>
                                            <div>
                                                {
                                                    x.status == "Em Analise" ? (
                                                        // -------------------------------
                                                        parseJwt().Permissao === 'Petshop' ? (
                                                            <div>
                                                                <div className='div_btnStatus'>

                                                                    <button className='btn_MudarStatusPedido'
                                                                        style={{
                                                                            backgroundColor: "green",
                                                                            color: "white",
                                                                            borderRadius: "5px"
                                                                        }}
                                                                        onClick={() => this.AceitarPedido(x.id)}
                                                                    >Aceitar</button>
                                                                    <button className='btn_MudarStatusPedido'
                                                                        style={{
                                                                            backgroundColor: "red",
                                                                            color: "white",
                                                                            borderRadius: "5px"
                                                                        }}
                                                                        onClick={() => this.RecusarPedido(x.id)}
                                                                    >Recusar</button>
                                                                </div>
                                                                <br></br>
                                                                <div style={{ color: "rgb(110, 110, 110)" }}>
                                                                    <p>R${x.preco.toFixed(2)}</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <div className='divStatus' style={{ color: 'white', backgroundColor: 'orange', borderRadius: '5px' }}>
                                                                    <p>{x.status}</p>
                                                                </div>
                                                                <br></br>
                                                                <div style={{ color: "rgb(110, 110, 110)" }}>
                                                                    <p>R${x.preco.toFixed(2)}</p>
                                                                </div>
                                                            </div>
                                                        )
                                                        // -------------------------------
                                                    ) : (
                                                        x.status == 'Aceito' || x.status == 'Entregando..' || x.status == "Preparando Entrega" || x.status == 'Pronto para Retirar' ? (
                                                            <div>
                                                                <div className='divStatus' style={{ color: 'white', backgroundColor: 'orange', borderRadius: '5px' }}>
                                                                    <p>{x.status}</p>
                                                                </div>
                                                                <br></br>
                                                                <div style={{ color: "rgb(110, 110, 110)" }}>
                                                                    <p>R${x.preco.toFixed(2)}</p>
                                                                </div>
                                                            </div>

                                                        ) : (
                                                            x.status == 'Concluido' || x.status == 'Entregue' ? (
                                                                <div>
                                                                    <div className='divStatus' style={{ color: 'white', backgroundColor: 'green', borderRadius: '5px' }}>
                                                                        <p>{x.status}</p>
                                                                    </div>
                                                                    <br></br>

                                                                    <div style={{ color: "rgb(110, 110, 110)" }}>
                                                                        <p>R${x.preco.toFixed(2)}</p>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                x.status == 'Aguardando Pagamento' ? (
                                                                    <div className='div_btnStatus'>
                                                                        <div style={{ marginTop: '50px' }}>
                                                                            <button className='btn_MudarStatusPedido'
                                                                                style={{
                                                                                    backgroundColor: "green",
                                                                                    color: "white",
                                                                                    borderRadius: "5px"
                                                                                }}
                                                                                onClick={() => this.PixRecebido(x.id)}
                                                                            >Pix Recebido</button>
                                                                            <button className='btn_MudarStatusPedido'
                                                                                style={{
                                                                                    backgroundColor: "red",
                                                                                    color: "white",
                                                                                    borderRadius: "5px"
                                                                                }}
                                                                                onClick={() => this.RecusarPedido(x.id)}
                                                                            >Pix Não Efetuado</button>
                                                                        </div>
                                                                        <div style={{ color: "rgb(110, 110, 110)" }}>
                                                                            <p>R${x.preco.toFixed(2)}</p>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <div className='divStatus' style={{ color: 'white', backgroundColor: 'red', borderRadius: '5px' }}>
                                                                            <p>{x.status}</p>
                                                                        </div>
                                                                        <br></br>
                                                                        <div style={{ color: "rgb(110, 110, 110)" }}>
                                                                            <p>R${x.preco.toFixed(2)}</p>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )
                                                        )
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="div_subDescricaoDoPedido">
                                            <p><strong>Cliente  :</strong> {x.cliente.nome}</p>
                                            <p><strong>Telefone :</strong> {x.cliente.telefone}</p>
                                            <p><strong>Endereço :</strong> {x.caminhoDaEntrega.to.endereco}</p>
                                            {x.pagamento.tipo != "Cartão na Hora da Entrega" ? (
                                                <p><strong>Pagamento:</strong> {x.pagamento.tipo} (Já esta pago)</p>
                                            ) : (
                                                <p><strong>Pagamento:</strong> Pagar na entrega - cartão</p>
                                            )}
                                            <p><strong>Código   :</strong> {x.id}</p>
                                            {x.retirarNaLoja == true && x.status == 'Pronto para Retirar' ? (

                                                <button
                                                    style={{ width: "90%", marginLeft: "5%" }}
                                                    onClick={() => {
                                                        const r = window.confirm("O Cliente Retirou o Produto?");
                                                        if (r == true) {
                                                            this.ClienteRetirouOProduto(x.id);
                                                        }
                                                    }
                                                    }
                                                >
                                                    Cliente Retirou O Produto
                                                </button>
                                            ) : (<div></div>)}
                                            {x.idLogistica ? (
                                                x.idLogistica != 1 && x.status == "Aceito" ? (

                                                    <button
                                                        style={{ width: "90%", marginLeft: "5%" }}
                                                        onClick={() => {
                                                            const r = window.confirm("A Entrega Foi Iniciada?");
                                                            if (r == true) {
                                                                this.PetshopIniciaEntrega(x.id);
                                                            }
                                                        }
                                                        }
                                                    >
                                                        Iniciar Entrega Do Pedido
                                                    </button>
                                                ) : (x.idLogistica != 1 && x.status == "Entregando.." ? (

                                                    <button
                                                        style={{ width: "90%", marginLeft: "5%" }}
                                                        onClick={() => {
                                                            const r = window.confirm("A Entrega Foi Concluida?");
                                                            if (r == true) {
                                                                this.PetshopEntregouPedido(x.id);
                                                            }
                                                        }
                                                        }
                                                    >
                                                        Pedido Entregue
                                                    </button>
                                                ) : (<div></div>))
                                            ) : (<div></div>)}
                                        </div>
                                        {parseJwt().Permissao === 'Petshop' ? (
                                            <div className="div_LinkChat"
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                }}
                                            >
                                                <Link to="/ChatAdm"
                                                    onClick={() => {
                                                        sessionStorage.setItem("idCliente", x.idUsuario);
                                                    }}
                                                    style={{
                                                        textDecoration: 'none',
                                                        fontSize: "small",
                                                        fontFamily: "bolder",
                                                        textAlign: "center",
                                                        color: "rgb(110, 110, 110)",
                                                        width: "85%"
                                                    }}    >
                                                    <p>Chat Com Cliente</p>
                                                </Link>
                                                <p style={{
                                                    fontSize: "14px",
                                                    fontFamily: "bolder",
                                                    textAlign: "right",
                                                    color: "rgb(110, 110, 110)"
                                                }}>{this.verificarNovaMensagem(x.idUsuario)}</p>
                                            </div>
                                        ) : (
                                            <div className="DivBtn_CancelarPedidoAdm">
                                                <button className="Btn_CancelarPedidoAdm"
                                                    onClick={() => {
                                                        const r = window.confirm("Tem certeza que quer cancelar o pedido?");
                                                        if (r == true) {
                                                            this.AdmCancelarPedido(x.id);
                                                        }
                                                    }}
                                                >
                                                    <p><strong>Cancelar Pedido</strong></p>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

            </div >
        );
    }
}

export default Dash;