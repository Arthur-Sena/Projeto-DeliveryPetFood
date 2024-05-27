import React, { Component } from 'react';
import Axios from 'axios';
import { parseJwt } from '../../services/auth';

//Css + images
import './AtualizarPerfil.css';
import petfood from '../../Assets/PetfoodNome.png';

class AtualizarPerfil extends Component {

    constructor(props) {
        super(props);
        this.state = {
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

    BuscarUsuario = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/usuario/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ email: data[0].email })
                this.setState({ senha: data[0].senha })
                this.setState({ senhaAntiga: data[0].senha })
                this.setState({ copySenha: data[0].senha })
                this.setState({ cpf: data[0].cpf })
                this.setState({ nome: data[0].nome })
                this.setState({ telefone: data[0].telefone })
            })
            .catch(error => console.log(error))
    }

    atualizarCadastro = (event) => {
        event.preventDefault();
        var CpfFoiValidado = this.validarCpf(this.state.cpf);
        if (CpfFoiValidado == true) {
            if (this.state.email.includes("@") & this.state.email.includes(".")) {
                Axios.put("https://env-9048989.jelastic.saveincloud.net/api/usuario/?senhaantiga="+ this.state.senhaAntiga + "&novasenha=" + this.state.novaSenha, {
                    idusuario: parseJwt().jti,
                    email: this.state.email.toLowerCase(),
                    senha: this.state.novaSenha,
                    nome: this.state.nome,
                    telefone: this.state.telefone,
                    cpf: this.state.cpf
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'ip_usuario': localStorage.getItem("ip_user"),
                    }
                })
                    .then(data => {
                        this.props.history.push('/User');
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
        this.BuscarUsuario();
    }

    render() {
        return (
            <div className="CadastroUsuario" >

                <div className="div_ImgCadastro">
                    <img src={petfood} />
                </div>

                <form onSubmit={this.atualizarCadastro} className="formCadastroUsuario" autocomplete="off">

                    <div className="meu-box">
                        <input
                            type="text"
                            id="nomeCompleto"
                            className="input-nome"
                            onChange={this.cadastroNome}
                            value={this.state.nome}
                            minLength="5"
                            placeholder=" "
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
                            placeholder=" "
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
                            placeholder=" "
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
                            placeholder=" "
                        />
                        <label for="cpf" class="label-nome">CPF</label>
                    </div>

                    <div className="divInputLogin">
                        <button type="submit" className="btn_CadastroUsuario">
                            Atualizar
                        </button >

                        <br></br>
                        <h4 style={{ color: '#FF2226' }}>{this.state.erro}</h4>

                    </div>
                </form>

            </div>
        );
    }
}

export default AtualizarPerfil;