import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Axios from 'axios';

//Css + images
import './RecuperarSenhaPetshop.css';
import petfood from '../../Assets/PetfoodNome.png';
import HeaderLogin from '../../Component/TopoLogin/NavLogin';
import TituloLogin from '../../Component/TituloLoginCadastro/TituloLogin';

class RecuperarSenhaPetshop extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            erro: "",
            verSenha: "password",
        }
    } 

    recuperarEmail = (event) => {
        this.setState({ email: event.target.value.trim().toLowerCase() });
    }

    recuperarSenha = (event) => {
        event.preventDefault();
        this.refs.btn.setAttribute("disabled", "disabled");
        this.setState({ erro: "Recuperando Senha..." });
        Axios.put("https://env-9048989.jelastic.saveincloud.net/api/petshop/RecuperarSenha/email:" + this.state.email, {
            email: this.state.email
        }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
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
            default:
                return <h4>{this.state.erro}</h4>;
        }
    }

    render() {
        return (
            <div className="LoginUsuario" >

                <HeaderLogin />
                <TituloLogin titulo="Recuperar Senha" href="LoginPetshop"/>

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

                    <br></br>

                    <div className="divInputLogin">
                        <button type="submit" className="btn_LoginUsuario" ref="btn">
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

export default RecuperarSenhaPetshop;