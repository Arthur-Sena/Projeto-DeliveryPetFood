import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Axios from 'axios';

//Css + images
import './Cadastro.css';
import petfood from '../../Assets/PetfoodNome.png';
import Termos from './../../Component/TermosPrivacidade';
// import Termos from './../../Component/Termos_Condicoes';
var geolocator = require("geolocator");
var ip;

function salvarIp(retorno) {
    ip = retorno;
}

class Cadastro extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            senha: null,
            copySenha: null,
            nome: null,
            telefone: null,
            cpf: null,
            erro: "",
            aceitarTermos: false,
            abrirTermos: false,
            dispositivo: null,
        }
    }

    cadastroEmail = (event) => { this.setState({ email: event.target.value.replace(/\s/g, '').toLowerCase() }) }
    cadastroSenha = (event) => { this.setState({ senha: event.target.value.trim() }) }
    cadastroCopySenha = (event) => { this.setState({ copySenha: event.target.value.trim() }) }
    cadastroNome = (event) => { this.setState({ nome: event.target.value }) }
    cadastroTelefone = (event) => { this.setState({ telefone: event.target.value }) }
    cadastroCpf = (event) => { this.setState({ cpf: event.target.value.replace(/\s/g, '') }) }
    changeTermos = (event) => { this.setState({ aceitarTermos: !this.state.aceitarTermos }) }
    validarCpf = (strCPF) => {
        var Soma;
        var Resto;
        let i;
        Soma = 0;
        if (strCPF == "00000000000") return false;

        for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(strCPF.substring(9, 10))) return false;

        Soma = 0;
        for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(strCPF.substring(10, 11))) return false;
        return true;
    }

    efetuarCadastro = (event) => {
        event.preventDefault();
        this.refs.btn.setAttribute("disabled", "disabled");
        this.setState({ erro: "Carregando" })

        var CpfFoiValidado = this.validarCpf(this.state.cpf);
        if (this.state.aceitarTermos == true) {
            if (CpfFoiValidado == true) {
                if (this.state.senha == this.state.copySenha) {
                    if (this.state.email.includes("@") & this.state.email.includes(".")) {
                        Axios.post("https://env-9048989.jelastic.saveincloud.net/api/usuario", {
                            email: this.state.email.toLowerCase(),
                            senha: this.state.senha,
                            nome: this.state.nome.trim(),
                            telefone: this.state.telefone.trim(),
                            cpf: this.state.cpf,
                            termos: {
                                data: (new Date()).toLocaleString(),
                                ipDoUsuario: ip,
                                navegadorDoUsuario: this.state.dispositivo,
                            }
                        }, {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'ip_usuario': ip,
                            }
                        })
                            .then(data => {
                                console.log(data)
                                this.setState({ erro: "Usuario Cadastrado" })
                                sessionStorage.setItem("usuario-petfood", data.data)
                                this.props.history.push('/CadastroEndereco');
                            })
                            .catch(erro => {
                                console.log(erro.response)
                                this.setState({ erro: erro.response.data })
                                this.refs.btn.removeAttribute("disabled");
                            })
                    } else {
                        this.setState({ erro: "E-mail inválido" });
                        this.refs.btn.removeAttribute("disabled");
                    }
                } else {
                    this.setState({ erro: "As senhas não estão iguais" });
                    this.refs.btn.removeAttribute("disabled");
                }
            } else {
                this.setState({ erro: "Cpf inválido" });
                this.refs.btn.removeAttribute("disabled");
            }
        } else {
            this.setState({ erro: "Aceite os termos de uso para cadastrar-se" });
        }
    }

    abrirTermos = (event) => {
        this.setState({ abrirTermos: !this.state.abrirTermos })
    }

    mensagemDeAtualizacao = () => {
        switch (this.state.erro) {
            case "Carregando":
                return <section className="Loading"><div className="c-loader"></div></section>;
            // CSS do loading: /AtualizarLoja.css
            default:
                return <h4 style={{ color: '#FF2226' }}>{this.state.erro}</h4>;
        }
    }

    nomeDoDispositivo = () => {
        var uagent = navigator.userAgent.toLowerCase();
        this.setState({ dispositivo: uagent });

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
            <div className="CadastroUsuario" >

                {this.state.abrirTermos == true ? (
                    <div>
                        <Termos abrirTermos={this.state.abrirTermos} />
                        <button
                            className="FecharTermos"
                            onClick={this.abrirTermos}
                        >Fechar</button>
                    </div>
                ) : (<div></div>)}

                <div className="div_ImgCadastro">
                    <img src={petfood} />
                </div>
                <form onSubmit={this.efetuarCadastro} className="formCadastroUsuario" autocomplete="off">
                    <div className="divInputLogin">
                        <input
                            className="inputCadastroUsuario"
                            placeholder="Nome Completo"
                            onChange={this.cadastroNome}
                            value={this.state.nome}
                            minLength="5"
                            maxLength="20"
                            required
                        />
                    </div>

                    <div className="divInputLogin">
                        <input
                            className="inputCadastroUsuario"
                            onChange={this.cadastroEmail}
                            value={this.state.email}
                            placeholder="E-mail"
                            maxLength="90"
                            minLength="8"
                            required
                        />
                    </div>

                    <div className="divInputLogin">
                        <input
                            className="inputCadastroUsuario"
                            placeholder="Senha"
                            type="password"
                            onChange={this.cadastroSenha}
                            value={this.state.senha}
                            maxLength="20"
                            minLength="8"
                            required
                        />
                    </div>
                    <div className="divInputLogin">
                        <input
                            className="inputCadastroUsuario"
                            placeholder="Confirmar Senha"
                            type="password"
                            onChange={this.cadastroCopySenha}
                            value={this.state.copySenha}
                            maxLength="20"
                            minLength="8"
                            required
                        />
                    </div>

                    <div className="divInputLogin">
                        <input
                            className="inputCadastroUsuario"
                            placeholder="Telefone"
                            type="tel"
                            onChange={this.cadastroTelefone}
                            value={this.state.telefone}
                            minLength="8"
                            required
                            pattern="[0-9]+$"
                        />
                    </div>

                    <div className="divInputLogin">
                        <input
                            className="inputCadastroUsuario"
                            placeholder="Cpf (apenas numeros)"
                            type="tel"
                            onChange={this.cadastroCpf}
                            value={this.state.cpf}
                            minLength="11"
                            maxLength="11"
                            required
                            pattern="[0-9]+$"
                        />
                    </div>
                    <div className="div_TermosCondicoes">
                        <input
                            type="checkbox"
                            onChange={this.changeTermos}
                            required
                        />
                        <label style={{ fontSize: '14px', fontWeight: "bold" }}
                        >  LI E ACEITO OS <span style={{ textDecorationColor: "#FF2226", color: "#FF2226" }}
                            onClick={this.abrirTermos}>TERMOS E CONDIÇÕES</span>
                        </label>
                    </div>


                    <div className="divInputLogin">
                        <button type="submit" className="btn_CadastroUsuario" ref="btn">
                            Cadastrar
                        </button >

                        {this.mensagemDeAtualizacao()}

                    </div>
                </form>

            </div>
        );
    }
}

export default Cadastro;