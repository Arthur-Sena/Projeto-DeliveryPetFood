import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from "react-router-dom";
import { parseJwt } from '../../services/auth';

//Css + images
import './AtualizarMotoboy.css';

import Footer from './../../Component/FooterEntregador';

class AtualizarMotoboy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            motoboy: {},
            email: null,
            senha: null,
            senhaAntiga: null,
            novaSenha: null,
            nome: null,
            telefone: null,
            cpf: null,
            erro: "",
        }
    }

    cadastroEmail = (event) => { this.setState({ email: event.target.value.toLowerCase() }) }
    cadastroSenhaAntiga = (event) => { this.setState({ senhaAntiga: event.target.value }) }
    cadastroNovaSenha = (event) => { this.setState({ novaSenha: event.target.value }) }
    cadastroNome = (event) => { this.setState({ nome: event.target.value }) }
    cadastroTelefone = (event) => { this.setState({ telefone: event.target.value }) }
    cadastroCpf = (event) => { this.setState({ cpf: event.target.value }) }

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

    BuscarEntregador = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/motoboy/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ motoboy: data[0] })
                this.setState({ email: data[0].email })
                this.setState({ senha: data[0].senha })
                this.setState({ senhaAntiga: data[0].senha })
                this.setState({ copySenha: data[0].senha })
                this.setState({ cpf: data[0].cpf })
                this.setState({ nome: data[0].nome })
                this.setState({ telefone: data[0].telefone })
            })
    }

    AtualizarMotoboy = (event) => {
        event.preventDefault();
        var CpfFoiValidado = this.validarCpf(this.state.cpf);
        if (CpfFoiValidado == true) {
            if (this.state.email.includes("@") & this.state.email.includes(".")) {
                    Axios.put("https://env-9048989.jelastic.saveincloud.net/api/motoboy/?senha=" + this.state.novaSenha + "&SenhaAntiga=" + this.state.senhaAntiga, {
                        idmotoboy: parseJwt().jti,
                        email: this.state.email.toLowerCase(),
                        senha: this.state.novaSenha,
                        nome: this.state.nome,
                        telefone: this.state.telefone,
                        cpf: this.state.cpf
                    },{
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        }
                    })
                        .then(data => {
                            this.setState({ erro: "Atualizado com sucesso" })
                        })
                        .catch(erro => {
                            this.setState({ erro: "Erro ao atualizar, tente novamente" })
                        })
            } else {
                this.setState({ erro: "E-mail inválido" });
            }
        } else {
            this.setState({ erro: "Cpf inválido" });
        }
    }

    componentDidMount() {
        this.BuscarEntregador();
    }

    render() {
        return (
            <div className="HomeEntregador">

                <nav className='navEntregador' >
                    <div className='divH1Nav'>
                        <h1>{this.state.motoboy.nome}</h1>
                    </div>
                </nav>

                <section    className="Section_AtualizarMotoboy">
                    <form onSubmit={this.AtualizarMotoboy} className="form_AtualizarMotoboy">

                        <div className="meu-box">
                            <input
                                type="text"
                                id="nomeCompleto"
                                className="input-nome"
                                onChange={this.cadastroNome}
                                value={this.state.nome}
                                minLength="5"
                                placeholder="Digite seu Nome Completo"
                                required
                            />
                            <label for="nomeCompleto" class="label-nome">Nome Completo</label>
                        </div>

                        <div className="meu-box">
                            <input
                                id="email"
                                className="input-nome"
                                onChange={this.cadastroEmail}
                                value={this.state.email}
                                placeholder="E-mail"
                                minLength="8"
                                required
                                placeholder="Digite seu Email"
                            />
                            <label for="email" class="label-nome">Email</label>
                        </div>

                        <div className="meu-box">
                            <input
                                id="Senha"
                                className="input-nome"
                                type="new-password"
                                onChange={this.cadastroSenhaAntiga}
                                minLength="6"
                                required
                                placeholder="Digite Sua Senha Antiga"
                            />
                            <label for="Senha" class="label-nome">Digite Sua Senha Antiga</label>

                        </div>
                        <div className="meu-box">
                            <input
                                id="2Senha"
                                className="input-nome"
                                type="new-password"
                                onChange={this.cadastroNovaSenha}
                                minLength="8"
                                required
                                placeholder="Digite Sua Nova Senha"
                            />
                            <label for="2Senha" class="label-nome">Digite Sua Nova Senha </label>

                        </div>

                        <div className="meu-box">
                            <input
                                id="telefone"
                                className="input-nome"
                                type="tel"
                                onChange={this.cadastroTelefone}
                                value={this.state.telefone}
                                minLength="8"
                                required
                                pattern="[0-9]+$"
                                placeholder="Digite seu Telefone"
                            />
                            <label for="telefone" class="label-nome">Telefone</label>
                        </div>

                        <div className="meu-box">
                            <input
                                id="cpf"
                                value={this.state.cpf}
                                className="input-nome"
                                type="tel"
                                onChange={this.cadastroCpf}
                                minLength="11"
                                maxLength="11"
                                required
                                pattern="[0-9]+$"
                                placeholder="Digite seu CPF"
                            />
                            <label for="cpf" class="label-nome">CPF</label>
                        </div>

                        <div className="divInputLogin">
                            <button type="submit" className="btn_AtualizarMotoboy">
                                Atualizar
                            </button >

                            <br></br>
                            <h4 style={{ color: '#FF2226' }}>{this.state.erro}</h4>

                        </div>

                    </form>
                </section>

                <Footer />

            </div>
        );
    }
}

export default AtualizarMotoboy;