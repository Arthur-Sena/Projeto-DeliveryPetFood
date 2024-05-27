import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { parseJwt } from './../../services/auth.js';
import Axios from 'axios';
import './AtualizarLoja.css';

import HeaderPetshop from '../../Component/Petshop/NavPetshop/NavPetshopHome';

class AtualizarLoja extends Component {

    constructor() {
        super();
        this.state = {
            Petshop: {},
            Nome: null,
            Email: null,
            Senha: null,
            Telefone: null,
            Endereco: null,
            Bairro: null,
            Numero: null,
            Cep1: null,
            Cep: null,
            Cidade: null,
            Estado: null,
            longitude: null,
            latitude: null,
            Horaabertura: null,
            Horafechamento: null,
            sucesso: "",
            img: "",
            DadosImg: {},
        }
    }

    cadastroNome = (event) => { this.setState({ Nome: event.target.value }) }
    cadastroEmail = (event) => { this.setState({ Email: event.target.value.toLowerCase() }) }
    cadastroSenha = (event) => { this.setState({ Senha: event.target.value }) }
    cadastroTelefone = (event) => { this.setState({ Telefone: event.target.value }) }
    cadastroEndereco = (event) => { this.setState({ Endereco: event.target.value }) }
    // cadastroBairro = (event) => { this.setState({ Bairro: event.target.value }) }
    cadastroNumero = (event) => { this.setState({ Numero: event.target.value }) }
    cadastroCep = (event) => { this.setState({ Cep: event.target.value }) }
    cadastroCidade = (event) => { this.setState({ Cidade: event.target.value }) }
    cadastroEstado = (event) => { this.setState({ Estado: event.target.value }) }
    cadastroHoraabertura = (event) => { this.setState({ Horaabertura: event.target.value }) }
    cadastroHorafechamento = (event) => { this.setState({ Horafechamento: event.target.value }) }
    cadastroImg = (event) => {
        let imageFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = new FileReader();
        reader.onload = x => {
            this.setState({ img: x.target.result })
        }
        reader.readAsDataURL(imageFile)
    }

    BuscarPetshop = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/petshop/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ Petshop: data[0] })
                this.setState({ Nome: data[0].nome })
                this.setState({ Email: data[0].email })
                this.setState({ Senha: data[0].senha })
                this.setState({ Telefone: data[0].telefone })
                this.setState({ Endereco: data[0].endereco })
                this.setState({ Numero: data[0].numero })
                this.setState({ Cep: data[0].cep })
                this.setState({ Cep1: data[0].cep })
                this.setState({ Cidade: data[0].cidade })
                this.setState({ Estado: data[0].estado })
                this.setState({ longitude: data[0].longitude })
                this.setState({ latitude: data[0].latitude })
                this.setState({ Horaabertura: data[0].horaabertura })
                this.setState({ Horafechamento: data[0].horafechamento })
                this.setState({ DadosImg: data[0].imgpetshops[0] })
            })
            .catch(error => console.log(error))
    }

    AtualizarLoja = (event) => {
        event.preventDefault();
        this.refs.btn.setAttribute("disabled", "disabled");
        this.setState({ sucesso: "Atualizando Petshop.." })

        if (this.state.Cep1 !== this.state.Cep) {
            fetch("https://env-9048989.jelastic.saveincloud.net/api/localizacao?endereco=" + this.state.Endereco + "&bairro=" + //this.state.Bairro + 
            "&cidade=" + this.state.Cidade + "&estado=" + this.state.Estado + "&cep=" + this.state.Cep, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }
            )
                .then(response => response.json())
                .then(data => {
                    this.setState({ latitude: data.results[0].geometry.location.lat })
                    this.setState({ longitude: data.results[0].geometry.location.lng })
                })
        }

        let long = this.state.longitude;
        let lat = this.state.latitude;

        Axios.put("https://env-9048989.jelastic.saveincloud.net/api/petshop/", {
            IdPetshop: parseJwt().jti,
            Nome: this.state.Nome.trim(),
            Endereco: this.state.Endereco.trim(),
            Cep: this.state.Cep.trim(),
            Cidade: this.state.Cidade.trim(),
            Estado: this.state.Estado,
            Longitude: long,
            Latitude: lat,
            Telefone: this.state.Telefone.trim(),
            Horaabertura: this.state.Horaabertura,
            Horafechamento: this.state.Horafechamento,
            Email: this.state.Email.trim(),
            Senha: this.state.Senha.trim(),
        }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                this.state.img != "" ? (
                    this.setState({ sucesso: "Carregando" })
                ) : (
                    this.setState({ sucesso: "Petshop Atualizado Com Sucesso" })
                );
                this.refs.btn.removeAttribute("disabled")
            })
            .catch(error => {
                this.setState({ sucesso: "Erro ao Atualizar" });
                this.refs.btn.removeAttribute("disabled");
            })

        if (this.state.img != null && this.state.img != "") {
            Axios.put("https://env-9048989.jelastic.saveincloud.net/api/petshop/img", {
                Idimgpetshop: this.state.DadosImg.idimgpetshop,
                IdPetshop: parseJwt().jti,
                Img: this.state.img
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                },

            }).then(response => {
                this.setState({ sucesso: "Petshop Atualizado Com Sucesso" })
                this.refs.btn.removeAttribute("disabled");
            }).catch(error => {
                this.setState({ sucesso: error.response.data.mensagem });
                this.refs.btn.removeAttribute("disabled");
            })
        }
    }

    componentDidMount() {
        this.BuscarPetshop();
    }

    mensagemDeAtualizacao = () => {
        switch (this.state.sucesso) {
            case "Erro ao Atualizar":
            case "Erro ao Atualizar Imagem":
                return <h5 style={{ color: 'red' }}>{this.state.sucesso} </h5>;
            case "Petshop Atualizado Com Sucesso":
                return <h5 style={{ color: 'green' }}>{this.state.sucesso}</h5>;
            case "Carregando":
            case "Atualizando Petshop..":
                return <div class="c-loader"></div>;
            default:
                return <h5 style={{ color: 'red' }}>{this.state.sucesso} </h5>;
        }
    }

    render() {
        return (
            <div className="Atualizar_ProdutosDoPetshop">
                <HeaderPetshop status={this.state.status} Titulo="Atualizar Loja" />

                <form method="POST" onSubmit={this.AtualizarLoja} className="FormCadastro_ProdutoPetshop">

                    <div className="DivPetshop_AtualizarProduto">
                        <label>Nome</label>
                        <input
                            className="Input_AtualizarProduto"
                            type="text"
                            name="name"
                            onChange={this.cadastroNome}
                            value={this.state.Nome}
                        />
                    </div>

                    <div className="DivPetshop_AtualizarProduto">
                        <label>Email</label>
                        <input
                            className="Input_AtualizarProduto"
                            type="text"
                            name="name"
                            onChange={this.cadastroEmail}
                            value={this.state.Email}
                        />
                    </div>

                    <div className="DivPetshop_AtualizarProduto">
                        <label>Senha</label>
                        <input
                            className="Input_AtualizarProduto"
                            type="password"
                            name="name"
                            onChange={this.cadastroSenha}
                            value={this.state.Senha}
                        />
                    </div>

                    <div className="DivPetshop_AtualizarProduto">
                        <label>Endereco</label>
                        <input
                            className="Input_AtualizarProduto"
                            type="text"
                            name="name"
                            onChange={this.cadastroEndereco}
                            value={this.state.Endereco}
                        />
                    </div>

                    {/* <div className="DivPetshop_AtualizarProduto">
                        <label>Bairro</label>
                        <input
                            required
                            className="Input_AtualizarProduto"
                            type="text"
                            name="name"
                            onChange={this.cadastroBairro}
                            value={this.state.Bairro}
                        />
                    </div> */}

                    <div className="DivPetshop_AtualizarProduto">
                        <label>Telefone</label>
                        <input
                            className="Input_AtualizarProduto"
                            type="tel"
                            name="name"
                            onChange={this.cadastroTelefone}
                            value={this.state.Telefone}
                        />
                    </div>

                    <div className="DivPetshop_AtualizarProduto">
                        <label>Cep</label>
                        <input
                            className="Input_AtualizarProduto"
                            type="tel"
                            name="name"
                            onChange={this.cadastroCep}
                            value={this.state.Cep}
                        />
                    </div>

                    <div className="DivPetshop_AtualizarProduto">
                        <label>Estado</label>
                        <input
                            className="Input_AtualizarProduto"
                            type="tel"
                            name="name"
                            onChange={this.cadastroEstado}
                            value={this.state.Estado}
                        />
                    </div>

                    <div className="DivPetshop_AtualizarProduto">
                        <label>Cidade</label>
                        <input
                            className="Input_AtualizarProduto"
                            type="tel"
                            name="name"
                            onChange={this.cadastroCidade}
                            value={this.state.Cidade}
                        />
                    </div>

                    <div className="DivPetshop_AtualizarProduto">

                        <label>Abertura </label>
                        <input
                            className="Input_AtualizarProduto"
                            type="time"
                            name="name"
                            onChange={this.cadastroHoraabertura}
                            value={this.state.Horaabertura}
                        />
                    </div>

                    <div className="DivPetshop_AtualizarProduto">
                        <label>Fechamento</label>
                        <input
                            className="Input_AtualizarProduto"
                            type="time"
                            name="name"
                            onChange={this.cadastroHorafechamento}
                            value={this.state.Horafechamento}
                        />
                    </div>

                    <div className="DivPetshop_AtualizarProduto">
                        <label style={{ marginTop: '5px' }} className="label_maiorinputimg">Imagem
                            <label className="input_img">Escolher Imagem
                                <input
                                    type="file"
                                    name="arquivos"
                                    className="btnCadastroImg"
                                    accept="image/png, image/jpeg"
                                    onChange={this.cadastroImg}
                                    filename={this.state.DadosImg}
                                />
                            </label>
                        </label>
                    </div>

                    <button type="submit" className="btn_AtualizarProduto" ref="btn">
                        Atualizar
                    </button >

                    <div style={{ textAlign: 'center' }}>
                        {this.mensagemDeAtualizacao()}
                    </div>
                </form>

            </div>
        );
    }
}

export default AtualizarLoja;