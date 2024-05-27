import React, { Component } from 'react';
import { Route, Link, BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import Axios from 'axios';
import IconVerSenha from '../../Assets/alerta.svg';

//Css + images
// import './RecuperarSenha.css';
import petfood from '../../Assets/PetfoodNome.png';

class RecuperarSenhaMotoboy extends Component {

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
        this.setState({ erro: "Recuperando Senha..." });
        this.refs.btn.setAttribute("disabled", "disabled");
        Axios.put("https://env-9048989.jelastic.saveincloud.net/api/motoboy/RecuperarSenha/cpf:" + this.state.cpf + ",email:" + this.state.email, {
            email: this.state.email,
            senha: this.state.senha
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(data => this.setState({ erro: data.data }))
            .catch(erro => {
                this.setState({ erro: "Ocorreu um erro, tente novamente" });
                this.refs.btn.removeAttribute("disabled");
            })
    }

    mensagemDeAtualizacao = () => {
        switch(this.state.erro){
            case "Recuperando Senha...":
                return <section className="Loading"><div className="c-loader"></div></section>;
                // Css loading esta na pagina AtualizarLoja.css
            default:
                return <h4>{this.state.erro}</h4>;
        }
    }

    render() {
        return (
            <div className="LoginUsuario" >

                <div className="div_ImgLogin">
                    <img src={petfood} />
                </div>

                <form onSubmit={this.recuperarSenha} className="formLoginUsuario">

                    <h1
                        style={{
                            textAlign: "center",
                            color: "#FFCE00"
                        }}
                    >Recuperar Senha</h1>

                    <div className="divInputLogin">
                        <input
                            className="inputCadastroUsuario"
                            onChange={this.recuperarEmail}
                            value={this.state.email}
                            placeholder="E-mail"
                            minLength="8"
                            required
                        />
                    </div>
                    <div className="divInputLogin" >
                        <input
                            className="inputCadastroUsuario"
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
                        <button type="submit" className="btn_Login" ref="btn">
                            Recuperar Senha
                        </button >

                        <br></br>
                        
                        {this.mensagemDeAtualizacao()}

                    </div>
                </form>
            </div>
        );
    }
}

export default RecuperarSenhaMotoboy;