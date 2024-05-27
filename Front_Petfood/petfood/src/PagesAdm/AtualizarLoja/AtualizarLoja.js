import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { parseJwt } from './../../services/auth.js';
import Axios from 'axios';

//Css + images
import './AtualizarLoja.css';

import Menu from './../../Component/MenuAdm';

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
            logisticaSelecionada: null,
            logistica: [],
        }
    }
    Logistica = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/dashboard/logistica', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            this.setState({ logistica : data });
        })
        .catch(error => console.log(error))
    }

    cadastroNome = (event) => { this.setState({ Nome: event.target.value }) }
    cadastroEmail = (event) => { this.setState({ Email: event.target.value.trim().toLowerCase() }) }
    cadastroSenha = (event) => { this.setState({ Senha: event.target.value }) }
    cadastroTelefone = (event) => { this.setState({ Telefone: event.target.value }) }
    cadastroEndereco = (event) => { this.setState({ Endereco: event.target.value }) }
    cadastroBairro = (event) => { this.setState({ Bairro: event.target.value }) }
    cadastroNumero = (event) => { this.setState({ Numero: event.target.value }) }
    cadastroCep = (event) => { this.setState({ Cep: event.target.value }) }
    cadastroCidade = (event) => { this.setState({ Cidade: event.target.value }) }
    cadastroEstado = (event) => { this.setState({ Estado: event.target.value }) }
    cadastroHoraabertura = (event) => { this.setState({ Horaabertura: event.target.value }) }
    cadastroHorafechamento = (event) => { this.setState({ Horafechamento: event.target.value }) }
    cadastroLogistica = (event) => { this.setState({ logisticaSelecionada: event.target.value }) }
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
        var idPet = parseJwt().Permissao === 'Administrador' || parseJwt().Permissao === 'Diretor' ? (localStorage.getItem("IdPetshop")) : (parseJwt().jti);
        fetch('https://env-9048989.jelastic.saveincloud.net/api/petshop/' + idPet, {
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
                this.setState({ logisticaSelecionada: data[0].Logistica})
            })
            .catch(error => console.log(error))
    }

    AtualizarLoja = (event) => {
        event.preventDefault();
        this.refs.btn.setAttribute("disabled", "disabled");
        var idPet = parseJwt().Permissao === 'Administrador' || parseJwt().Permissao === 'Diretor'? (localStorage.getItem("IdPetshop")) : (parseJwt().jti);
        this.setState({ sucesso: "Atualizando Petshop.." })

        if (this.state.Cep1 !== this.state.Cep) {
            fetch("https://env-9048989.jelastic.saveincloud.net/api/localizacao?endereco=" + this.state.Endereco + "&bairro=" + this.state.Bairro + "&cidade=" + this.state.Cidade + "&estado=" + this.state.Estado + "&cep=" + this.state.Cep, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }}
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
            IdPetshop: idPet,
            Email: this.state.Email.trim().toLowerCase(),
            Senha: this.state.Senha.trim(),
            Nome: this.state.Nome.trim(),
            Telefone: this.state.Telefone.trim(),
            Endereco: this.state.Endereco.trim(),
            Cep: this.state.Cep.trim(),
            Cidade: this.state.Cidade.trim(),
            Estado: this.state.Estado,
            Longitude: long,
            Latitude: lat,
            Horaabertura: this.state.Horaabertura,
            Horafechamento: this.state.Horafechamento,
            logistica: this.state.logisticaSelecionada
        }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                this.state.img != "" ?(
                    this.setState({ sucesso: "Carregando" }) 
                ):(  
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
                IdPetshop: idPet,
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
        this.Logistica();
        this.BuscarPetshop();
    }

    mensagemDeAtualizacao = () => {
        switch(this.state.sucesso){
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
            <div className="DivAtualizarLoja">
                <nav className='navDash'>
                    <Link
                        to="/Dash"
                        style={{ textDecoration: 'none', color: 'white' }}
                    >
                        <h1>{this.state.Petshop.nome}</h1>
                    </Link>
                </nav>

                <Menu />

                {/* -------------------------------------Form----------------------------------------------------------------------- */}

                <form method="POST" onSubmit={this.AtualizarLoja} className="FormCadastro_Loja">
                    {/* <h1>Cadastrar Petshop</h1> */}

                    <div className="item">
                        <label>Nome</label>
                        <input
                            className="input__Cadastro"
                            type="text"
                            name="name"
                            onChange={this.cadastroNome}
                            value={this.state.Nome}
                        />
                    </div>

                    <div className="item">
                        <label>Email</label>
                        <input
                            className="input__Cadastro"
                            type="text"
                            name="name"
                            onChange={this.cadastroEmail}
                            value={this.state.Email}
                        />
                    </div>

                    <div className="item">
                        <label>Senha</label>
                        <input
                            className="input__Cadastro"
                            type="password"
                            name="name"
                            onChange={this.cadastroSenha}
                            value={this.state.Senha}
                        />
                    </div>

                    <div className="item">
                        <label>Endereco</label>
                        <input
                            className="input__Cadastro"
                            type="text"
                            name="name"
                            onChange={this.cadastroEndereco}
                            value={this.state.Endereco}
                        />
                    </div>

                    <div className="item">
                        <label>Bairro</label>
                        <input
                            required
                            className="input__Cadastro"
                            type="text"
                            name="name"
                            onChange={this.cadastroBairro}
                            value={this.state.Bairro}
                        />
                    </div>

                    <div className="item">
                        <label>Telefone</label>
                        <input
                            className="input__Cadastro"
                            type="tel"
                            name="name"
                            onChange={this.cadastroTelefone}
                            value={this.state.Telefone}
                        />
                    </div>

                    <div className="item">
                        <label>Cep</label>
                        <input
                            className="input__Cadastro"
                            type="tel"
                            name="name"
                            onChange={this.cadastroCep}
                            value={this.state.Cep}
                        />
                    </div>

                    <div className="item">
                        <label>Estado</label>
                        <input
                            className="input__Cadastro"
                            type="tel"
                            name="name"
                            onChange={this.cadastroEstado}
                            value={this.state.Estado}
                        />
                    </div>

                    <div className="item">
                        <label>Cidade</label>
                        <input
                            className="input__Cadastro"
                            type="tel"
                            name="name"
                            onChange={this.cadastroCidade}
                            value={this.state.Cidade}
                        />
                    </div>

                    <div className="item1">

                        <div className="ssitem1">
                            <label>Abertura </label>
                            <input
                                className="input__Cadastro1"
                                type="time"
                                name="name"
                                onChange={this.cadastroHoraabertura}
                                value={this.state.Horaabertura}
                            />
                        </div>

                        <div className="ssitem1">
                            <label>Fechamento</label>
                            <input
                                className="input__Cadastro1"
                                type="time"
                                name="name"
                                onChange={this.cadastroHorafechamento}
                                value={this.state.Horafechamento}
                            />
                        </div>

                    </div>

                    <div className="divImg">
                        <label>Imagem</label>
                        <input
                            type="file"
                            name="arquivos"
                            className="btnCadastroImg"
                            accept="image/png, image/jpeg"
                            onChange={this.cadastroImg}
                            filename={this.state.DadosImg}
                        />
                    </div>

                    <div className="item1" style={{ display: "grid", placeItems:"center" }}>
                        <select onChange={this.cadastroLogistica} >
                            <option disabled selected>Modelo De Entrega</option>
                            {this.state.logistica.map(element => {
                                return (
                                    <option value={element.id} key={element.id}>{element.tipoFrete}</option>
                                );
                            })}
                        </select>
                    </div>

                    <button type="submit" className="btn_Cadastro" ref="btn">
                        Atualizar
                    </button >

                    {this.mensagemDeAtualizacao()}
                </form>

            </div>
        );
    }
}

export default AtualizarLoja;