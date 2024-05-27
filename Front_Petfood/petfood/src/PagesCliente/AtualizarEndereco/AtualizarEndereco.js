import React, { Component } from 'react';
import { parseJwt } from '../../services/auth';
import Axios from 'axios';

//Css + images
import Usuario from '../../Assets/person.svg';

import Footer from '../../Component/Cliente/FooterCliente/Footer';


class AtualizarEndereco extends Component {

    constructor() {
        super();
        this.state = {
            idEndereco: sessionStorage.getItem("IdEndereco"),
            endereco: [],
            usuario: {},
            rua: null,
            numero: null,
            cep: null,
            cep1: null,
            sucesso: "",
            cidade: null,
            complemento: null,
            bairro: null,
            estado: null,
            latitude: null,
            longitude: null,
        }
    }

    setEndereco = (event) => { this.setState({ rua: event.target.value }) }
    setNumero = (event) => { this.setState({ numero: event.target.value }) }
    setCep = (event) => { this.setState({ cep: event.target.value }) }
    setCidade = (event) => { this.setState({ cidade: event.target.value }) }
    setEstado = (event) => { this.setState({ estado: event.target.value }) }
    setBairro = (event) => { this.setState({ bairro: event.target.value }) }
    setComplemento = (event) => { this.setState({ complemento: event.target.value }) }

    BuscarEndereco = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/endereco/' + this.state.idEndereco, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ endereco: data[0] })
                this.setState({ rua: data[0].enderecoRua })
                this.setState({ numero: data[0].numero })
                this.setState({ cep: data[0].cep })
                this.setState({ cep1: data[0].cep })
                this.setState({ cidade: data[0].cidade })
                this.setState({ bairro: data[0].bairro })
                this.setState({ estado: data[0].estado })
                this.setState({ complemento: data[0].complemento })
                this.setState({ latitude: data[0].latitude })
                this.setState({ longitude: data[0].longitude })
            })
            .catch(error => console.log(error))
    }

    BuscarUsuario = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/usuario/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'ip_usuario': localStorage.getItem("ip_user"),
            },
        })
            .then(response => response.json())
            .then(data => this.setState({ usuario: data[0] }))
            .catch(error => console.log(error))
    }

    AtualizarEndereco = () => {
        this.refs.btn.setAttribute("disabled", "disabled");
        this.setState({ sucesso: "Carregando" });
        fetch("https://env-9048989.jelastic.saveincloud.net/api/localizacao?numero=" + this.state.numero + "&endereco=" + this.state.endereco + "&bairro=" + this.state.bairro + "&cidade=" + this.state.cidade + "&estado=" + this.state.estado + "&cep=" + this.state.cep,{
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'ip_usuario': localStorage.getItem("ip_user"),

            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ latitude: data.results[0].geometry.location.lat })
                this.setState({ longitude: data.results[0].geometry.location.lng })

                if (data.status == "OK") {

                    Axios.put("https://env-9048989.jelastic.saveincloud.net/api/endereco/", {
                        idendereco: sessionStorage.getItem("IdEndereco"),
                        enderecoRua: this.state.rua,
                        numero: this.state.numero,
                        cep: this.state.cep,
                        cidade: this.state.cidade,
                        bairro: this.state.bairro,
                        estado: this.state.estado,
                        complemento: this.state.complemento,
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                    }, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                            'ip_usuario': localStorage.getItem("ip_user"),
                        },
                    }).then(response => {
                            this.setState({ sucesso: "Endereco Atualizado Com Sucesso" })
                            alert("Endereco Atualizado Com Sucesso")
                            this.props.history.push('/User')
                    })
                } else {
                    this.setState({ sucesso: "Erro ao atualizar endereço" })
                    this.refs.btn.removeAttribute("disabled");
                }
            })
    }

    deletarEndereco = (id) => {
        this.refs.btn.setAttribute("disabled", "disabled");
        this.setState({ sucesso: "Carregando" });
        Axios.delete("https://env-9048989.jelastic.saveincloud.net/api/endereco/" + id, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'ip_usuario': localStorage.getItem("ip_user"),
            }
        })
            .then(response => {
                if (response.status === 200) {
                    alert("Endereco removido com sucesso")
                    this.props.history.push('/User')
                }
            })
    }

    componentDidMount() {
        this.BuscarUsuario();
        this.BuscarEndereco();
    }

    mensagemDeAtualizacao = () => {
        switch(this.state.sucesso){
            case "Carregando":
                return <section className="Loading"><div className="c-loader"></div></section>;
            default:
                return <h4>{this.state.sucesso}</h4>;
        }
    }

    render() {
        return (
            <div className="AtualizarEndereco" >

                <div className='infoUser_AtualizarEndereco' style={{height: '15vh'}}>
                    <div className='dadosUser'>
                        <h1 style={{ color: 'black' }}>{this.state.usuario.nome}</h1>
                        <p>{this.state.usuario.telefone}</p>
                        <p>{this.state.usuario.email}</p>
                    </div>
                    <img src={Usuario} className="fotoUser" ></img>
                </div>

                <form  className="formAtualizarUsuario">

                    <div className="divInputCadastroEndereco">
                        <input
                            className="inputCadastroNovoEndereco"
                            placeholder="Endereço"
                            type="text"
                            onChange={this.setEndereco}
                            defaultValue={this.state.rua}
                        />
                    </div>

                    <div className="divInputCadastroEndereco">
                        <input
                            className="inputCadastroNovoEndereco"
                            placeholder="Numero"
                            type="numeric"
                            onChange={this.setNumero}
                            value={this.state.numero}
                        />
                    </div>

                    <div className="divInputCadastroEndereco">
                        <input
                            className="inputCadastroNovoEndereco"
                            placeholder="Cep"
                            type="cep"
                            onChange={this.setCep}
                            defaultValue={this.state.cep}
                            minLength="8"
                            maxLength="9"
                        />
                    </div>

                    <div className="divInputCadastroEndereco">
                        <input
                            className="inputCadastroNovoEndereco"
                            placeholder="Bairro"
                            type="text"
                            onChange={this.setBairro}
                            value={this.state.bairro}
                            minLength="2"
                        />
                    </div>

                    <div className="divInputCadastroEndereco">
                        <input
                            className="inputCadastroNovoEndereco"
                            placeholder="Estado"
                            type="text"
                            onChange={this.setEstado}
                            value={this.state.estado}
                            maxLength="2"
                            minLength="2"
                        />
                    </div>

                    <div className="divInputCadastroEndereco">
                        <input
                            className="inputCadastroNovoEndereco"
                            placeholder="Cidade"
                            type="text"
                            onChange={this.setCidade}
                            value={this.state.cidade}
                        />
                    </div>

                    <div className="divInputCadastroEndereco">
                        <input
                            required
                            className="inputCadastroNovoEndereco"
                            placeholder="Complemento"
                            type="text"
                            onChange={this.setComplemento}
                            value={this.state.complemento}
                            maxLength="255"
                        />
                    </div>

                    {this.mensagemDeAtualizacao()}

                    <div className="div_BtnEndereco" >
                        <button type="button" onClick={() => { this.AtualizarEndereco() }} className="btn_CadastroNovoEndereco"
                            style={{ backgroundColor: "#04E762" }}
                            ref="btn"
                        >
                            Atualizar
                        </button >

                        <button type="submit" className="btn_CadastroNovoEndereco"
                            onClick={() => {
                                const r = window.confirm("Deseja deletar esse endereço ?");
                                if (r == true) {
                                    this.deletarEndereco(this.state.endereco.idendereco);
                                }
                            }}
                            style={{ backgroundColor: '#FF2226' }}
                            ref="btn"
                        >
                            Deletar
                        </button >
                    </div>
                </form>

                <Footer />
            </div>
        );
    }
}

export default AtualizarEndereco;