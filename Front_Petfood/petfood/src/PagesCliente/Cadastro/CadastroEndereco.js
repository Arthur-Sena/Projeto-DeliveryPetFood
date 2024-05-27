import React, { Component } from 'react';
import Axios from 'axios';

//Css + images
import './Cadastro.css';
import petfood from '../../Assets/PetfoodNome.png';
var geolocator = require("geolocator");
var ip;

function salvarIp(retorno) {
    ip = retorno;
}
class CadastroEndereco extends Component {

    constructor() {
        super();
        this.state = {
            erro: "",
            endereco: "",
            numero: null,
            cep: null,
            cidade: null,
            estado: null,
            bairro: null,
            complemento: null,
            latitude: "",
            longitude: "",
        }
    }

    setEndereco = (event) => { this.setState({ endereco: event.target.value }) }
    setNumero = (event) => { this.setState({ numero: event.target.value }) }
    setCep = (event) => { this.setState({ cep: event.target.value }) }
    setCidade = (event) => { this.setState({ cidade: event.target.value }) }
    setEstado = (event) => { this.setState({ estado: event.target.value }) }
    setBairro = (event) => { this.setState({ bairro: event.target.value }) }
    setComplemento = (event) => { this.setState({ complemento: event.target.value }) }

    cadastrarEndereco = (event) => {
        event.preventDefault();
        this.refs.btn.setAttribute("disabled", "disabled");
        this.setState({ erro: "Carregando" })

        fetch("https://env-9048989.jelastic.saveincloud.net/api/localizacao?numero=" + this.state.numero + "&endereco=" + this.state.endereco + "&bairro=" + this.state.bairro + "&cidade=" + this.state.cidade + "&estado=" + this.state.estado + "&cep=" + this.state.cep, {
            headers: {
                // 'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ latitude: data.results[0].geometry.location.lat })
                this.setState({ longitude: data.results[0].geometry.location.lng })

                if (data.status == "OK") {
                    Axios.post("https://env-9048989.jelastic.saveincloud.net/api/endereco/", {
                        enderecoRua: this.state.endereco,
                        numero: this.state.numero,
                        cep: this.state.cep,
                        cidade: this.state.cidade,
                        bairro: this.state.bairro,
                        estado: this.state.estado,
                        complemento: this.state.complemento,
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        idusuario: sessionStorage.getItem("usuario-petfood")
                    }, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'ip_usuario': ip,
                        }
                    }).then(response => {
                        this.setState({ erro: "Endereço Cadastrado Com Sucesso" })
                        if (response.status === 200) {
                            alert("Endereço cadastrado com sucesso")
                            this.props.history.push('/')
                        } else {
                            this.setState({ erro: "Erro ao Cadastrar" });
                            this.refs.btn.removeAttribute("disabled");
                        }
                    })
                        .catch(error => {
                            this.refs.btn.removeAttribute("disabled");
                        })
                }
                else {
                    this.setState({ erro: "Erro ao Cadastrar" });
                    this.refs.btn.removeAttribute("disabled");
                }
            })
            .catch(error => {
                this.setState({ erro: "Erro ao Cadastrar" })
                this.refs.btn.removeAttribute("disabled")
            })
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
            <div className="CadastrarNovoEndereco" >

                <div className="div_ImgCadastro">
                    <img src={petfood} />
                </div>

                <form onSubmit={this.cadastrarEndereco} className="formCadastroNovoEndereco" autoComplete="off">

                    <div className="divInputCadastroEndereco">
                        <input
                            required
                            className="inputCadastroNovoEndereco"
                            placeholder="Endereco"
                            type="text"
                            onChange={this.setEndereco}
                            value={this.state.endereco}
                            maxLength="90"
                        />
                    </div>

                    <div className="divInputCadastroEndereco">
                        <input
                            required
                            className="inputCadastroNovoEndereco"
                            placeholder="Numero"
                            type="number"
                            onChange={this.setNumero}
                            value={this.state.numero}
                            maxLength="9"
                        />
                    </div>

                    <div className="divInputCadastroEndereco">
                        <input
                            required
                            className="inputCadastroNovoEndereco"
                            placeholder="Bairro"
                            type="text"
                            onChange={this.setBairro}
                            value={this.state.bairro}
                            maxLength="90"
                        />
                    </div>

                    <div className="divInputCadastroEndereco">
                        <input
                            required
                            className="inputCadastroNovoEndereco"
                            placeholder="Cep"
                            type="tel"
                            onChange={this.setCep}
                            value={this.state.cep}
                            minLength="8"
                            maxLength="9"
                        />
                    </div>

                    <div className="divInputCadastroEndereco">
                        <input
                            required
                            className="inputCadastroNovoEndereco"
                            placeholder="Estado"
                            type="text"
                            onChange={this.setEstado}
                            value={this.state.estado}
                            maxLength="2"
                        />
                    </div>

                    <div className="divInputCadastroEndereco">
                        <input
                            required
                            className="inputCadastroNovoEndereco"
                            placeholder="Cidade"
                            type="text"
                            onChange={this.setCidade}
                            value={this.state.cidade}
                            maxLength="75"
                        />
                    </div>
                    <div className="divInputCadastroEndereco">
                        <input
                            className="inputCadastroNovoEndereco"
                            placeholder="Complemento"
                            type="text"
                            onChange={this.setComplemento}
                            value={this.state.complemento}
                            maxLength="255"
                        />
                    </div>

                    <div className="divInputCadastroEndereco">
                        <button type="submit" className="btn_CadastroNovoEndereco" ref="btn">
                            Cadastrar
                        </button >

                        {this.mensagemDeAtualizacao()}
                    </div>
                </form>

            </div>
        );
    }
}

export default CadastroEndereco;