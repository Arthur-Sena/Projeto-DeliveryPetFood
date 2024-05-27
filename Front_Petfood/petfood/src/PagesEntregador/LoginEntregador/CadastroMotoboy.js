import React, { Component } from 'react';
import Axios from 'axios';
//Css + images
import './LoginEntregador.css';
import petfood from '../../Assets/PetfoodNome.png';
import Termos from './../../Component/TermosPrivacidade';
var geolocator = require("geolocator");
var ip;

function salvarIp(retorno) {
    ip = retorno;
}
class CadastroMotoboy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            senha: null,
            copySenha: null,
            nome: null,
            cpf: null,
            telefone: null,
            erro: "",
            aceitarTermos: false,
            abrirTermos: false,
            dispositivo: null,
            imgMotoboy: null,
        }
    }

    cadastroEmail = (event) => {
        this.setState({ email: event.target.value.trim().toLowerCase() })
    }
    cadastroSenha = (event) => {
        this.setState({ senha: event.target.value })
    }
    cadastroCopySenha = (event) => {
        this.setState({ copySenha: event.target.value })
    }
    cadastroNome = (event) => {
        this.setState({ nome: event.target.value })
    }
    cadastroCpf = (event) => {
        this.setState({ cpf: event.target.value })
    }
    cadastroTelefone = (event) => {
        this.setState({ telefone: event.target.value })
    }
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

    cadastroImg = (event) => {
        let imageFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = new FileReader();
        reader.onload = x => {
            this.setState({ imgMotoboy: x.target.result })
        }
        reader.readAsDataURL(imageFile)
    }

    efetuarCadastro = (event) => {
        event.preventDefault();
        this.refs.btn.setAttribute("disabled", "disabled");
        this.setState({ erro: "Cadastrando" });
        var CpfFoiValidado = this.validarCpf(this.state.cpf);
        if (CpfFoiValidado == true) {

            if (this.state.senha == this.state.copySenha) {

                if (this.state.email.includes("@") & this.state.email.includes(".")) {
                    if (this.state.imgMotoboy != null && this.state.imgMotoboy.length >= 1) {

                        Axios.post("https://env-9048989.jelastic.saveincloud.net/api/motoboy", {
                            email: this.state.email.trim().toLowerCase(),
                            senha: this.state.senha,
                            nome: this.state.nome.trim(),
                            telefone: this.state.telefone.trim(),
                            cpf: this.state.cpf.trim(),
                            Foto: {
                                Img: this.state.imgMotoboy
                            },
                            termos: {
                                data: (new Date()).toLocaleString(),
                                ipDoMotoboy: ip,
                                navegadorDoMotoboy: this.state.dispositivo,
                            }
                        })
                            .then(data => {
                                this.setState({ erro: "Cadastro Enviado Para Aprovação\nEnviaremos um Email Após a Analise" });
                            })
                            .catch(erro => {
                                this.setState({ erro: erro.response.data.mensagem })
                                this.refs.btn.removeAttribute("disabled");
                            })
                    } else {
                        this.setState({ erro: "Selecione uma Foto para concluir o cadastro" });
                        this.refs.btn.removeAttribute("disabled");
                    }
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
    }

    abrirTermos = (event) => {
        this.setState({ abrirTermos: !this.state.abrirTermos })
    }

    mensagemDeAtualizacao = () => {
        switch (this.state.erro) {
            case "Cadastrando":
                return <section className="Loading"><div className="c-loader"></div></section>;
            // Css loading esta na pagina AtualizarLoja.css
            default:
                return <h4 style={{ color: 'red' }}>{this.state.erro}</h4>;
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

                <div className="div_ImgCadastroEntregador">
                    <img src={petfood} />
                </div>

                <form onSubmit={this.efetuarCadastro} className="formCadastroUsuario" autocomplete="off">

                    <div className="divInputLogin"  >
                        <input
                            className="inputCadastroMotoboy"
                            placeholder="Nome"
                            onChange={this.cadastroNome}
                            value={this.state.nome}
                            minLength="5"
                            maxLength="90"
                            required
                        />
                    </div>

                    <div className="divInputLogin">
                        <input
                            className="inputCadastroMotoboy"
                            onChange={this.cadastroEmail}
                            value={this.state.email}
                            placeholder="E-mail"
                            minLength="8"
                            maxLength="90"
                            required
                        />
                    </div>

                    <div className="divInputLogin">
                        <input
                            className="inputCadastroMotoboy"
                            placeholder="Senha"
                            type="password"
                            onChange={this.cadastroSenha}
                            value={this.state.senha}
                            minLength="8"
                            maxLength="10"
                            required
                        />
                    </div>

                    <div className="divInputLogin">
                        <input
                            className="inputCadastroMotoboy"
                            placeholder="Confirmar Senha"
                            type="password"
                            onChange={this.cadastroCopySenha}
                            value={this.state.copySenha}
                            minLength="8"
                            maxLength="10"
                            required
                        />
                    </div>

                    <div className="divInputLogin">
                        <input
                            className="inputCadastroMotoboy"
                            placeholder="Telefone"
                            type="tel"
                            onChange={this.cadastroTelefone}
                            value={this.state.telefone}
                            minLength="8"
                            maxLength="20"
                            required
                            pattern="[0-9]+$"
                        />
                    </div>

                    <div className="divInputLogin">
                        <input
                            className="inputCadastroMotoboy"
                            placeholder="Cpf (apenas numeros)"
                            onChange={this.cadastroCpf}
                            value={this.state.cpf}
                            minLength="11"
                            maxLength="11"
                            required
                        />
                    </div>

                    <div className="divInputLogin" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', marginTop: '1vh' }}>
                        <label>Foto Do Entregador</label>
                        <input
                            type="file"
                            name="arquivos"
                            className="btnCadastroImgMotoboy"
                            accept="image/png, image/jpeg"
                            onChange={this.cadastroImg}
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

export default CadastroMotoboy;