import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Axios from 'axios';

//Css + images
// import './RecuperarSenha.css';
import HeaderLogin from './../../Component/TopoLogin/NavLogin';
import petfood from '../../Assets/PetfoodNome.png';
import TituloLogin from './../../Component/TituloLoginCadastro/TituloLogin';

var geolocator = require("geolocator");
var ip;

function salvarIp(retorno) {
    ip = retorno;
}
class RecuperarSenha extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            cpf: null,
            erro: " ",
            verSenha: "password",
        }
    }

    recuperarEmail = (event) => {
        this.setState({ email: event.target.value });
    }

    recuperarCpf = (event) => {
        this.setState({ cpf: event.target.value })
    }

    recuperarSenha = (event) => {
        event.preventDefault();
        this.refs.btn.setAttribute("disabled", "disabled");
        this.setState({ erro: "Recuperando Senha..." });
        Axios.put("https://env-9048989.jelastic.saveincloud.net/api/usuario/RecuperarSenha/cpf:" + this.state.cpf + ",email:" + this.state.email, {
            email: this.state.email,
            senha: this.state.senha
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'ip_usuario': ip,
            }
        })
            .then(data => this.setState({ erro: data.data }))
            .catch(erro => {
                this.setState({ erro: "Ocorreu um erro, tente novamente" });
                this.refs.btn.removeAttribute("disabled");
            })
    }

    mensagemDeAtualizacao = () => {
        switch (this.state.erro) {
            case "Recuperando Senha...":
                return <section className="Loading"><div className="c-loader"></div></section>;
            // Css loading esta na pagina AtualizarLoja.css
            default:
                return <h4>{this.state.erro}</h4>;
        }
    }

    nomeDoDispositivo = () => {
        geolocator.getIP(function (err, result) {
            if(result != null){
                salvarIp(result.ip);
            }
        });
    }

    componentDidMount() {
        this.nomeDoDispositivo();
    }

    render() {
        return (
            <div className="LoginUsuario" >

                <HeaderLogin />
                <TituloLogin titulo="Recuperar Senha" href=""/>

                <form onSubmit={this.recuperarSenha} className="formLoginUsuario">
                    <div className="divInputLogin">
                        <input
                            className="Login_InputUsuario"
                            onChange={this.recuperarEmail}
                            value={this.state.email}
                            placeholder="E-mail"
                            minLength="8"
                            required
                        />
                    </div>
                    <div className="divInputLogin" >
                        <input
                            className="Login_InputUsuario"
                            placeholder="Cpf (apenas numeros)"
                            type="tel"
                            onChange={this.recuperarCpf}
                            value={this.state.cpf}
                            minLength="11"
                            maxLength="11"
                            required
                            pattern="[0-9]+$"
                        />
                    </div>

                    <br></br>

                    <div className="divInputLogin">
                        <button type="submit" className="btn_LoginUsuario" ref="btn">
                            Recuperar Senha
                        </button >

                        <br></br>

                        {this.mensagemDeAtualizacao()}

                        <br></br>
                    </div>
                </form>
            </div>
        );
    }
}

export default RecuperarSenha;