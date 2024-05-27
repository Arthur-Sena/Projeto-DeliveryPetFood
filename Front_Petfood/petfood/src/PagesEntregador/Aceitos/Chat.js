import React, { Component } from 'react';
import { parseJwt } from '../../services/auth';
import Axios from 'axios';
//Css + images
import './Chat.css';
import Seta from '../../Assets/chevron-left.svg';
import Enter from '../../Assets/enviaricon.png';
import Tel from './../../Assets/telefoneIcon.png';
import Hora from './../../Assets/relogio.png';
import Entregador from './../../Assets/entrega.png';
import Local from './../../Assets/localizacao.png';
import Avaliador from './../../Component/Avaliador';

var geolocator = require("geolocator");

export default class ChatCliente extends Component {

    constructor() {
        super();
        this.state = {
            usuario: {},
            mensagem: "",
            chat: [],
            idMotoboy: parseJwt().jti,
            enderecoSelecionado: {},
            distancia: null,
            precoFrete: 0.0,
            idUsuario: sessionStorage.getItem("idCliente_Chat"),
        }
    }

    buscarUsuario = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/usuario/' + this.state.idUsuario, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ usuario: data[0] })
            })
            .catch(error => console.log(error))
    }

    changeMessage = (event) => {
        this.setState({ mensagem: event.target.value })
    }

    sendMessage = (event) => {
        event.preventDefault();
        let idMotoboy = sessionStorage.getItem("idEntregador_Chat");
        if (this.state.mensagem != "") {
            Axios.post("https://env-9048989.jelastic.saveincloud.net/api/ChatMotoboyUsuario", {
                idEntregador: parseJwt().jti,
                idUsuario: this.state.idUsuario,
                Mensagem: this.state.mensagem,
                Emissor: 1
            })
                .then(data => console.log(data.status))
                .catch(erro => console.log(erro))
            this.setState({ mensagem: "" });
        }
    }

    buscarMensagensDoChat = () => {
        if (this.state.idMotoboy != null && parseJwt().jti != null && localStorage.getItem("usuario-petfood")) {
            var chat = setInterval(() => fetch('https://env-9048989.jelastic.saveincloud.net/api/ChatMotoboyUsuario/countC?idEntregador=' + this.state.idMotoboy + '&idUsuario=' + this.state.idUsuario)
                .then(response => response.json())
                .then(data => {
                    if (data != 0) {
                        fetch('https://env-9048989.jelastic.saveincloud.net/api/ChatMotoboyUsuario?idEntregador=' + this.state.idMotoboy + '&idUsuario=' + this.state.idUsuario, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                this.setState({ chat: data })
                            })
                            .catch(error => clearInterval(chat))
                    }
                }), 1500);
        } else {
            clearInterval(chat);
            clearInterval(chat);
            clearInterval(0);
            clearInterval(1);
            clearInterval(2);
            clearInterval(3);
            clearInterval(4);
            clearInterval(5);
        }
    }

    carregarChat = () => {
        let idMotoboy = sessionStorage.getItem("idEntregador_Chat");

        fetch('https://env-9048989.jelastic.saveincloud.net/api/ChatMotoboyUsuario?idEntregador=' + idMotoboy + '&idUsuario=' + parseJwt().jti, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ chat: data })
            })
            .catch(error => console.log(error))
    }

    visualizarMensagem = (id) => {
        Axios.put('https://env-9048989.jelastic.saveincloud.net/api/ChatMotoboyUsuario/motoboy/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }})  
    }

    componentDidMount() {
        this.buscarUsuario();
        this.carregarChat();
        this.buscarMensagensDoChat();
    }

    render() {
        return (
            <div className="ChatCliente">

                <nav className="nav_Chat">
                    <div className="nav_ChatCliente">
                        <img src={Seta} className="icon_NavSacola" style={{ width: '1.5em' }} onClick={() => { this.props.history.push('/EntregaAceita') }} />

                        <div className="DivNav_ChatClienteH1">
                            <h2>{this.state.usuario.nome}</h2>
                        </div>
                    </div>
                </nav> 

                <main className="Main_ChatEntregador">
                    {
                        this.state.chat.map(x => {
                            if (x.visualizado != true) {
                                this.visualizarMensagem(x.idChat);
                            }
                            return (
                                x.emissor == 1 ? (
                                    <div className="divChat_Cliente">
                                        <div className="divMensagemDoCliente">
                                            <p>{x.mensagem}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="divChat_Petshop">
                                        <div className="divMensagemDoPetshop">
                                            <p>{x.mensagem}</p>
                                        </div>
                                    </div>
                                )

                            );
                        })
                    }
                    <div id="chat"></div>
                </main>
                <footer className="Footer_ChatCliente">

                    <form onSubmit={this.sendMessage} className="Form_ChatCliente">

                        <input
                            className="input_EnviarMensagem"
                            type="text"
                            onChange={this.changeMessage}
                            value={this.state.mensagem}
                        />

                        <button className="btn_chat"
                        >
                            <img src={Enter} />
                        </button>
                    </form>

                </footer>
            </div>
        )
    }
}
