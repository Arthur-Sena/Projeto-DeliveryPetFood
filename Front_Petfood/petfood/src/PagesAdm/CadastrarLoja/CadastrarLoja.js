import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Axios from 'axios';
import Menu from './../../Component/MenuAdm';
import './CadastrarLoja.css';

class CadastrarLoja extends Component {

    constructor() {
        super();
        this.state = {
            Nome: null,
            Email: null,
            Senha: null,
            Telefone: null,
            Endereco: null,
            Numero: null,
            Bairro: null,
            Cep: "",
            Cidade: null,
            Estado: null,
            longitude: null,
            latitude: null,
            Horaabertura: null,
            Horafechamento: null,
            sucesso: "",
            localizacao: [],
            logistica: [],
            Img: null,
            IdPetshop: null,
            logisticaSelecionada: null,
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

    componentDidMount(){
        this.Logistica();
    }

    cadastroNome = (event) => { this.setState({ Nome: event.target.value }) }
    cadastroEmail = (event) => { this.setState({ Email: event.target.value.replace(/\s/g, '').toLowerCase() }) }
    cadastroSenha = (event) => { this.setState({ Senha: event.target.value.trim() }) }
    cadastroTelefone = (event) => { this.setState({ Telefone: event.target.value.trim() }) }
    cadastroEndereco = (event) => { this.setState({ Endereco: event.target.value}) }
    cadastroBairro = (event) => { this.setState({ Bairro: event.target.value}) }
    cadastroNumero = (event) => { this.setState({ Numero: event.target.value.trim() }) }
    cadastroCep = (event) => {  this.setState({ Cep: event.target.value }) }
    cadastroCidade = (event) => { this.setState({ Cidade: event.target.value }) }
    cadastroEstado = (event) => { this.setState({ Estado: event.target.value.trim()}) }
    cadastroLongitude = (event) => { this.setState({ longitude: event.target.value }) }
    cadastroLatitude = (event) => { this.setState({ latitude: event.target.value }) }
    cadastroHoraabertura = (event) => { this.setState({ Horaabertura: event.target.value }) }
    cadastroHorafechamento = (event) => { this.setState({ Horafechamento: event.target.value }) }
    cadastroLogistica = (event) => { this.setState({ logisticaSelecionada: event.target.value }) }
    cadastroImg = (event) => {
        let imageFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = new FileReader();
        reader.onload = x => {
            console.log( x.target.result)
            this.setState({ Img: x.target.result })
        }
        reader.readAsDataURL(imageFile)
    }

    CadastrarLoja = (event) => {
        event.preventDefault();
        this.refs.btn.setAttribute("disabled", "disabled");
        this.setState({sucesso: "Carregando"})

        fetch("https://env-9048989.jelastic.saveincloud.net/api/localizacao?numero=" + this.state.Numero + "&endereco=" + this.state.Endereco + "&bairro=" + this.state.Bairro + "&cidade=" + this.state.Cidade + "&estado=" + this.state.Estado + "&cep=" + this.state.Cep, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('usuario-petfood')
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ latitude: data.results[0].geometry.location.lat })
                this.setState({ longitude: data.results[0].geometry.location.lng })

                if (data.status == "OK") {
                    Axios.post("https://env-9048989.jelastic.saveincloud.net/api/petshop", {
                        Email: this.state.Email.trim().toLowerCase(),
                        Senha: this.state.Senha.trim(),
                        Nome: this.state.Nome.trim(),
                        Telefone: this.state.Telefone,
                        Endereco: this.state.Endereco.trim() + " - " + this.state.Numero,
                        Cep: this.state.Cep.trim(),
                        Cidade: this.state.Cidade.trim(),
                        Estado: this.state.Estado,
                        Longitude: this.state.longitude,
                        Latitude: this.state.latitude,
                        Horaabertura: this.state.Horaabertura,
                        Horafechamento: this.state.Horafechamento,
                        logistica: this.state.logisticaSelecionada
                    }, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('usuario-petfood')
                        },
                    })
                        .then(response => {
                            if (response.status === 200) {
                                this.setState({ IdPetshop: response.data })
                                Axios.post("https://env-9048989.jelastic.saveincloud.net/api/petshop/img", {
                                    Idpetshop: this.state.IdPetshop,
                                    Img: this.state.Img
                                }, {
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + localStorage.getItem('usuario-petfood')
                                    },

                                }).then(response => {
                                    if (response.status === 200) {
                                        this.setState({ sucesso: "Petshop Cadastrado Com Sucesso" })
                                    }
                                    this.refs.btn.removeAttribute("disabled");
                                }).catch(error => {
                                    this.setState({ sucesso: error.response.data.mensagem });
                                    this.refs.btn.removeAttribute("disabled");
                                })
                            }
                        })
                        .catch(error => {
                            this.setState({ sucesso: error.response.data.mensagem });
                            this.refs.btn.removeAttribute("disabled");
                        })
                }
            })
    }

    mensagemDeAtualizacao = () => {
        switch(this.state.sucesso){
            case "Carregando":
                return <section className="Loading"><div className="c-loader"></div></section>;
                // CSS do loading: /AtualizarLoja.css
            case "Petshop Cadastrado Com Sucesso":
                return <h5 style={{ color: 'green' }}>{this.state.sucesso}</h5>;
            default:
                return <h5 style={{ color: 'red' }}>{this.state.sucesso} </h5>;
        }
    }

    render() {
        return (

            <div className='DivCadastroPetshop'>

                <nav className='navDash'>
                    <Link
                        to="/Dash"
                        style={{ textDecoration: 'none', color: 'white' }}
                    >
                        <h1>CADASTRAR PETSHOP</h1>
                    </Link>
                </nav>

                <Menu />

                {/* ---------------Form---------------- */}
                <form method="POST" onSubmit={this.CadastrarLoja} className="FormCadastro_Loja">
                    {/* <h1>Cadastrar Petshop</h1> */}

                    <div className="item">
                        <label>Nome</label>
                        <input
                            required
                            className="input__Cadastro"
                            type="text"
                            name="name"
                            onChange={this.cadastroNome}
                            value={this.state.Nome}
                            maxLength="100"
                        />
                    </div>

                    <div className="item">
                        <label>Email</label>
                        <input
                            required
                            className="input__Cadastro"
                            type="text"
                            name="name"
                            onChange={this.cadastroEmail}
                            value={this.state.Email}
                            maxLength="90"
                        />
                    </div>

                    <div className="item">
                        <label>Senha</label>
                        <input
                            required
                            className="input__Cadastro"
                            type="password"
                            name="name"
                            onChange={this.cadastroSenha}
                            value={this.state.Senha}
                            minLength="6"
                            maxLength="10"
                        />
                    </div>

                    <div className="item">
                        <label>Cep</label>
                        <input
                            required
                            className="input__Cadastro"
                            type="tel"
                            name="name"
                            onChange={this.cadastroCep}
                            value={this.state.Cep}
                            minLength="8"
                            maxLength="10"
                        />
                    </div>

                    <div className="item">
                        <label>Endereco</label>
                        <input
                            required
                            className="input__Cadastro"
                            type="text"
                            name="name"
                            onChange={this.cadastroEndereco}
                            value={this.state.Endereco}
                            maxLength="120"
                        />
                    </div>
                    
                    <div className="item">
                        <label>Numero</label>
                        <input
                            required

                            className="input__Cadastro"
                            type="number"
                            name="name"
                            onChange={this.cadastroNumero}
                            value={this.state.Numero}
                            maxLength="6"
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
                            maxLength="30"
                        />
                    </div>
                    
                    <div className="item1">
                        <div className="ssitem1">
                            <label>Cidade</label>
                            <input
                                required
                                className="input__Cadastro1"
                                type="text"
                                name="name"
                                onChange={this.cadastroCidade}
                                value={this.state.Cidade}
                                maxLength="75"
                            />
                        </div>

                        <div className="ssitem1">
                            <label>Estado</label>
                            <input
                                required
                                className="input__Cadastro1"
                                type="text"
                                name="name"
                                onChange={this.cadastroEstado}
                                value={this.state.Estado}
                                maxLength="2"
                            />
                        </div>

                    </div>

                    <div className="item">
                        <label>Telefone</label>
                        <input
                            required
                            className="input__Cadastro"
                            type="tel"
                            name="name"
                            onChange={this.cadastroTelefone}
                            value={this.state.Telefone}
                            maxLength="20"
                        />
                    </div>

                    <div className="item1">

                        <div className="ssitem1">
                            <label>Abertura </label>
                            <input
                                required
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
                                required
                                className="input__Cadastro1"
                                type="time"
                                name="name"
                                onChange={this.cadastroHorafechamento}
                                value={this.state.Horafechamento}
                            />
                        </div>
                    </div>
                    <div className="item1" style={{ display: "grid", placeItems:"center" }}>
                        <select onChange={this.cadastroLogistica} >
                            <option disabled selected >Modelo De Entrega</option>
                            {this.state.logistica.map(element => {
                                return (
                                    <option value={element.id} key={element.id}>{element.tipoFrete}</option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="divImg">
                        <label>Imagem</label>
                        <input
                            type="file"
                            name="arquivos"
                            className="btnCadastroImg"
                            accept="image/png, image/jpeg"
                            onChange={this.cadastroImg}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn_Cadastro"
                        ref="btn"
                    >
                        Cadastrar
                    </button >

                    {this.mensagemDeAtualizacao()}

                </form>

            </div>
        )
    }
}

export default CadastrarLoja;