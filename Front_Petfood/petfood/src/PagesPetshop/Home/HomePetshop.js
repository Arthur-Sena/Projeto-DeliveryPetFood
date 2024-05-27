import React, { Component } from 'react';
import './HomePetshop.css';
import { parseJwt } from '../../services/auth.js';
import HeaderPetshop from '../../Component/Petshop/NavPetshop/NavPetshopHome';
import CardDashboard from '../../Component/Petshop/CardHome/CardHome';
import CardPedido from '../../Component/Petshop/CardPedido/CardPedido';

import Produtos from '../../Component/Petshop/CardHome/Icons/Produtos.svg';
import PedidosEmAndamento from '../../Component/Petshop/CardHome/Icons/PedidosEmAndamento.svg';
import Pedidos from '../../Component/Petshop/CardHome/Icons/Pedidos.svg';
import Faturamento from '../../Component/Petshop/CardHome/Icons/Faturamento.svg';

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
var ip;

function salvarIp(retorno) {
    ip = retorno;
    localStorage.setItem("ip_user", ip);
}

class HomePetshop extends Component {

    constructor() {
        super();
        this.state = {
            imgPetshop: [],
            mensagens: [],
            qntMensagens: 0,
            infoPetshop: {},
            UltimosPedidos: [],
            QuantidadeProdutos: 0,
            QuantidadeDePedidos: 0,
            QntPedidosEmAndamento: 0,
            Faturamento: 0.0,
            status: null,
            quantidadeDeMensagemNova: 0,
            looping: false,
            idPetshop: parseJwt().jti,
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
            .then(data => this.setState({ imgPetshop: data[0].imgpetshops[0].img }) + this.setState({ infoPetshop: data[0] }) + this.setState({ status: data[0].status }) + sessionStorage.setItem('petshop', JSON.stringify(data[0])) )
            .catch(error => console.log(error))
    }
    // #region "Contadores Dashboard Do Petshop"
    contadorDeProdutos = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/produtos/petshop/' + parseJwt().jti + '/count', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => this.setState({ QuantidadeProdutos: data }))
            .catch(error => console.log(error))
    }
    contadorDePedidos = () => {
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
    FaturamentoDoPetshop = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/dashboard/lucropetshop?idpetshop=' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => this.setState({ Faturamento: data }))
            .catch(error => console.log(error))
    }
    // #endregion
    // #region "Listar pedidos"
    listarUltimosPedidosLooping = () => {
        ListUltimos = setInterval(() => this.listarUltimosPedidos(), 10000);
    }
    listarUltimosPedidos = () => {
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
    //#endregion
    // #region "Requisições do chat"
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
                .catch(error => console.log(error)), 20000)
        } else {
            clearInterval(novasMensagens);
        }
    }
    //#endregion

    nomeDoDispositivo = () => {
        if (localStorage.getItem("ip_user") == "" && localStorage.getItem("ip_user") == null) {
            geolocator.getIP(function (err, result) {
                if (result != null) {
                    salvarIp(result.ip);
                }
            });
        }
    }

    componentDidMount() {
        this.BuscarImgPetshop();
        this.contadorDeProdutos();
        this.contadorDePedidos();
        this.FaturamentoDoPetshop();
        this.listarUltimosPedidos();
        this.listarUltimosPedidosLooping();
        this.novasMensagens();
        this.contarNovasMensagens();
        this.nomeDoDispositivo();
    }

    render() {
        return (
            <div className='Tela_HomePetshop'>
                <HeaderPetshop status={this.state.status}/>

                <CardDashboard icon={Produtos} TituloCard="Produtos" Valor={this.state.QuantidadeProdutos} />
                <CardDashboard icon={PedidosEmAndamento} TituloCard="Pedidos em Andamento" Valor={this.state.QntPedidosEmAndamento} />
                <CardDashboard icon={Pedidos} TituloCard="Pedidos" Valor={this.state.QuantidadeDePedidos} />
                <CardDashboard icon={Faturamento} TituloCard="Faturamento" Valor={this.state.Faturamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />

                <h1 className='TituloPedidosRecentes' >Pedidos Recentes</h1>

                {
                    this.state.UltimosPedidos.map(x => {
                        let data = x.horaDeEntrega_Retirada.horarioDoPedido.split(" ");
                        return (
                            <CardPedido 
                                Chat={true} 
                                Produtos={false} 
                                listaProdutos={x.listaProdutos} 
                                id={x.id} 
                                idUsuario={x.idUsuario}
                                Img={this.state.imgPetshop} 
                                Cliente={x.cliente.nome.split((/[\s,]+/),2)[0] + ' - ' + x.cliente.telefone}
                                Endereco={x.caminhoDaEntrega.to.endereco + ' ' + (x.caminhoDaEntrega.to.complemento != null? x.caminhoDaEntrega.to.complemento : '')}
                                Nome={x.caminhoDaEntrega.from.petshop} 
                                Data={data[0]} Hora={data[1]} 
                                Status={x.status}  
                                Preco={x.preco} 
                                retirarNaLoja={x.retirarNaLoja} 
                                Logistica={x.idLogistica}/>
                        )
                    })
                }
            </div>
        )
    }
}

export default HomePetshop;