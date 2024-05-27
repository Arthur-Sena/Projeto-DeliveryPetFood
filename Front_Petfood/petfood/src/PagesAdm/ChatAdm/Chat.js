import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { parseJwt } from '../../services/auth';
import Axios from 'axios';
//Css + images
import './Chat.css';
import Seta from '../../Assets/chevron-left.svg';
import Enter from '../../Assets/enterChat.svg';

export default class ChatAdm extends Component {

    constructor() {
        super();
        this.state = {
            usuario: {},
            mensagem: "",
            chat: [],
            pedidosDoUsuario: [],
            idCliente : sessionStorage.getItem("idCliente"),
            idPetshop: parseJwt().jti
        }
    }

    buscarUsuario = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/usuario/' + sessionStorage.getItem("idCliente"), {
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

    listaDePedidosDesseUsusario = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/pedidos/DoUsuario:' + sessionStorage.getItem("idCliente") + '/Para:' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ pedidosDoUsuario: data })
            })
            .catch(error => console.log(error))
    }

    changeMessage = (event) => {
        this.setState({ mensagem: event.target.value })
    }

    sendMessage = (event) => {
        event.preventDefault();
        let idUsuario = sessionStorage.getItem("idCliente");
        if (this.state.mensagem != "") {
            Axios.post("https://env-9048989.jelastic.saveincloud.net/api/chat", {
                idPetshop: parseJwt().jti,
                idUsuario: idUsuario,
                Mensagem: this.state.mensagem,
                Emissor: 1
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            })
                .then(data => data)
                .catch(erro => console.log(erro))
            this.setState({ mensagem: "" });
        }
    }

    buscarMensagensDoChat = () => {

        if (this.state.idCliente != null) {
            var chat = setInterval(() => fetch('https://env-9048989.jelastic.saveincloud.net/api/chat/countP?idPetshop=' + this.state.idPetshop + '&idUsuario=' + this.state.idCliente, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data != 0) {
                        fetch('https://env-9048989.jelastic.saveincloud.net/api/chat?idPetshop=' + this.state.idPetshop + '&idUsuario=' + this.state.idCliente, {
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
                }), 1000);
        } else {
            clearInterval(chat);
            clearInterval(0);
            clearInterval(1);
            clearInterval(2);
            clearInterval(3); 
            clearInterval(4); 
            clearInterval(5); 
        }
    }

    visualizarMensagem = (id) => {
        Axios.put('https://env-9048989.jelastic.saveincloud.net/api/chat/petshop/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
    }

    carregarChat = () => {
        let idCliente = sessionStorage.getItem("idCliente");

        fetch('https://env-9048989.jelastic.saveincloud.net/api/chat?idPetshop=' + parseJwt().jti + '&idUsuario=' + idCliente, {
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

    componentDidMount() {
        this.buscarUsuario();
        this.carregarChat();
        this.listaDePedidosDesseUsusario();
        this.buscarMensagensDoChat();
    }

    render() {
        return (
            <div className="ChatCliente">

                <nav className="nav_ChatAdm">
                    <div className="nav_ChatCliente">
                        <img src={Seta} ClassName="icon" style={{ width: '1.5em' }} onClick={() => { this.props.history.push('/dash') }} />

                        <div className="DivNav_ChatPetshopH1">
                            <h1 style={{color:"white"}}>{this.state.usuario.nome}</h1>
                        </div>
                    </div>

                    {/* - - -Lista De Pedidos DO Usuario--------------------------------------------- */}
                    <div className="div_ListaDePedidosDesseUsuario">
                        {this.state.pedidosDoUsuario.map(x => {
                            let data = x.horaDeEntrega_Retirada.horarioDoPedido.split(" ");

                            return (
                                <div>
                                    <div className='boxPedidosRecentes_chat'>
                                        <Link to="/ProdutosPedidos"
                                            onClick={() => { localStorage.setItem("idPedido", x.id) }}
                                            style={{ textDecoration: "none" }}
                                        >
                                            <div className='divText_Chat'>
                                                <p><strong>{x.caminhoDaEntrega.from.petshop}</strong></p>
                                                <p>{data[0]}</p>
                                                <p>{data[1]}</p>
                                                <p><strong>Id:</strong> {x.id}</p>
                                            </div>
                                        </Link>
                                        <div>
                                            {
                                                x.status == "Em Analise" ? (
                                                    // -------------------------------
                                                    <div>
                                                        <div className='divStatus' style={{ color: 'white', backgroundColor: 'orange', borderRadius: '5px' }}>
                                                            <p>{x.status}</p>
                                                        </div>
                                                        <br></br>
                                                        <div style={{ color: "rgb(110, 110, 110)" }}>
                                                            <p>R${x.preco.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                    // -------------------------------
                                                ) : (
                                                    x.status == 'Aceito' ? (
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
                                                        x.status == 'Concluido' ? (
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
                                            }
                                        </div>
                                    </div>

                                </div>
                            )
                        })
                        }

                    </div>

                </nav>

                <main className="Main_ChatPetshop">
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
                <footer className="Footer_ChatPetshop">

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
