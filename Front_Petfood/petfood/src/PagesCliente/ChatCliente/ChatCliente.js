import React, { Component } from 'react';
import { parseJwt } from '../../services/auth';
import Axios from 'axios';
//Css + images
import './ChatCliente.css';
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
            petshop: {},
            imgpetshop: {},
            mensagem: "",
            chat: [],
            idPetshop: sessionStorage.getItem("idPetshop_Chat"),
            enderecoSelecionado: {},
            distancia: null,
            precoFrete: 0.0,
            idUsuario:parseJwt().jti,
        }
    }

    buscarPetshop = () => {
        let idPetshop = sessionStorage.getItem("idPetshop_Chat");

        fetch('https://env-9048989.jelastic.saveincloud.net/api/petshop/' + idPetshop, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ petshop: data[0] })
                this.setState({ imgpetshop: data[0].imgpetshops[0] })
                this.CalcularDistanciaUsuarioPetshop(data[0].latitude, data[0].longitude, this.state.enderecoSelecionado.latitude, this.state.enderecoSelecionado.longitude);
            })
            .catch(error => console.log(error))
    }

    changeMessage = (event) => {
        this.setState({ mensagem: event.target.value })
    }

    sendMessage = (event) => {
        event.preventDefault();
        let idPetshop = sessionStorage.getItem("idPetshop_Chat");
        if (this.state.mensagem != "") {
            Axios.post("https://env-9048989.jelastic.saveincloud.net/api/chat", {
                idPetshop: idPetshop,
                idUsuario: parseJwt().jti,
                Mensagem: this.state.mensagem,
                Emissor: 2
            })
                .then(data => console.log(data.status))
                .catch(erro => console.log(erro))
            this.setState({ mensagem: "" });
        }
    }

    buscarMensagensDoChat = () => {

        if (this.state.idPetshop != null && parseJwt().jti != null && localStorage.getItem("usuario-petfood")) {
            var chat = setInterval(() => fetch('https://env-9048989.jelastic.saveincloud.net/api/chat/countC?idPetshop=' + this.state.idPetshop + '&idUsuario=' + this.state.idUsuario)
                .then(response => response.json())
                .then(data => {
                    if (data != 0) {
                        fetch('https://env-9048989.jelastic.saveincloud.net/api/chat?idPetshop=' + this.state.idPetshop + '&idUsuario=' + this.state.idUsuario, {
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
                }), 2000);
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
        let idPetshop = sessionStorage.getItem("idPetshop_Chat");

        fetch('https://env-9048989.jelastic.saveincloud.net/api/chat?idPetshop=' + idPetshop + '&idUsuario=' + parseJwt().jti, {
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
        Axios.put('https://env-9048989.jelastic.saveincloud.net/api/chat/cliente/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }})  
    }

    buscarEnderecoSelecionado() {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/endereco/' + sessionStorage.getItem("IdEnderecoEscolhido"), {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then((data) => {
                this.setState({ enderecoSelecionado: data[0] });
                this.buscarPetshop();
            })
            .catch(error => console.log(error))
    }

    CalcularDistanciaUsuarioPetshop = (latitude, longitude) => {

        var result = geolocator.calcDistance({
            from: {
                latitude: this.state.enderecoSelecionado.latitude,
                longitude: this.state.enderecoSelecionado.longitude
            },
            to: {
                latitude: latitude,
                longitude: longitude
            },
            formula: geolocator.DistanceFormula.HAVERSINE,
            unitSystem: geolocator.UnitSystem.METRIC
        });
        this.setState({ distancia: result.toFixed(1) });

        fetch('https://env-9048989.jelastic.saveincloud.net/api/dashboard/frete', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then((data) => {
                let frete = data.find(element => element.distancia > result.toFixed(1));
                this.setState({ precoFrete: frete.preco });
            })
            .catch(error => console.log(error))

        return result.toFixed(1);
    }

    componentDidMount() {
        this.buscarEnderecoSelecionado();
        this.carregarChat();
        this.buscarMensagensDoChat();
        // setInterval(() => this.buscarMensagensDoChat(), 1000);
    }

    render() {
        return (
            <div className="ChatCliente">

                <nav className="nav_Chat">
                    <div className="nav_ChatCliente">
                        <img src={Seta} className="icon_NavSacola" style={{ width: '1.5em' }} onClick={() => { this.props.history.push('/sacola') }} />

                        <div className="DivNav_ChatClienteH1">
                            <h2>{this.state.petshop.nome}</h2>
                        </div>
                    </div>

                    <div className="divNav_ChatCliente">

                        <div className="imgNavPetshop">
                            <img src={this.state.imgpetshop.img} className="imgPetshopChat" />
                        </div>

                        <div className="infoNavPetshop">
                            <p>{this.state.petshop.endereco}</p>
                            <div className="div_avaliacaoDoPetshop">
                                <p>{this.state.petshop.avaliacao} -</p>
                                <Avaliador avaliacao={this.state.petshop.avaliacao} style={{ height: '1.75vh' }} />
                            </div>
                            <section className="div_paiInfoPetshop">
                                {/* <div className="div_infoPetshop50">
                                    <img src={Tel} height="16px" />
                                    <p>{this.state.petshop.telefone}</p>
                                </div> */}

                                <div className="div_infoPetshop30">
                                    <img src={Entregador} height="16px" />
                                    <p>R${this.state.precoFrete}</p>
                                </div>
                                <div className="div_infoPetshop30">
                                    <img src={Local} height="16px" />
                                    <p>{this.state.distancia}Km</p>
                                </div>
                            </section>

                            <section className="div_paiInfoPetshop">
                                <div className="div_infoPetshop50">
                                    <img src={Hora} height="16px" />
                                    <p>{this.state.petshop.status == true ? ("Aberto") : ("Fechado")}</p>
                                    {/* <p>{this.state.petshop.horaabertura}-{this.state.petshop.horafechamento} ({this.state.petshop.status == true ? ("Aberto") : ("Fechado")})</p> */}
                                </div>

                            </section>
                        </div>

                    </div>
                </nav>

                <main className="Main_ChatCliente">
                    {
                        this.state.chat.map(x => {
                            if (x.visualizado != true) {
                                this.visualizarMensagem(x.idChat);
                            }
                            return (
                                x.emissor == 2 ? (
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
