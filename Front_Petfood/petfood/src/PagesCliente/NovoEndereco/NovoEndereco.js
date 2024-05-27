import React, { Component } from 'react';
import { parseJwt } from '../../services/auth';
import Axios from 'axios';

//Css + images
import './NovoEndereco.css';
import Usuario from '../../Assets/person.svg';
import Footer from '../../Component/Cliente/FooterCliente/Footer';


class NovoEndereco extends Component {

    constructor() {
        super();
        this.state = {
            erro: "",
            endereco: "",
            numero: null,
            cep: null,
            bairro: null,
            cidade: null,
            complemento: null,
            estado: null,
            latitude: "",
            longitude: "",
            usuario: {},
        }
    }

    setEndereco = (event) => {
        this.setState({ endereco: event.target.value })
    }
    setNumero = (event) => { this.setState({ numero: event.target.value }) }
    setCep = (event) => { this.setState({ cep: event.target.value }) }
    setBairro = (event) => { this.setState({ bairro: event.target.value }) }
    setCidade = (event) => { this.setState({ cidade: event.target.value }) }
    setEstado = (event) => { this.setState({ estado: event.target.value }) }
    setComplemento = (event) => { this.setState({ complemento: event.target.value }) }

    cadastrarEndereco = (event) => {
        event.preventDefault();
        fetch("https://env-9048989.jelastic.saveincloud.net/api/localizacao?numero=" + this.state.numero + "&endereco=" + this.state.endereco + "&bairro=" + this.state.bairro + "&cidade=" + this.state.cidade + "&estado=" + this.state.estado + "&cep=" + this.state.cep, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'ip_usuario': localStorage.getItem("ip_user"),
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
                        bairro: this.state.bairro,
                        cep: this.state.cep,
                        cidade: this.state.cidade,
                        estado: this.state.estado,
                        complemento: this.state.complemento,
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        idusuario: parseJwt().jti
                    }, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                    }).then(response => {
                        this.setState({ erro: "Endereço Cadastrado Com Sucesso" })
                        if (response.status === 200) {
                            alert("Endereço cadastrado com sucesso")
                            this.props.history.push('/User')
                        }
                    })
                        .catch(error => {
                            this.setState({ erro: "Erro ao Cadastrar" });
                        })
                } else {
                    this.setState({ erro: "Erro ao Cadastrar" });
                }
            })
            .catch(error => console.log(error))
    }

    BuscarUsuario = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/usuario/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',

            },
        })
            .then(response => response.json())
            .then(data => this.setState({ usuario: data[0] }))
            .catch(error => console.log(error))
    }

    componentDidMount = () => {
        this.BuscarUsuario();
    }

    render() {
        return (
            <div className="NovoEndereco" >

                <div className='infoUser_AtualizarEndereco'  style={{height: '15vh'}}>
                    <div className='dadosUser'>
                        <h1 style={{ color: 'black' }}>{this.state.usuario.nome}</h1>
                        <br></br>
                        <p>{this.state.usuario.telefone}</p>
                        <p>{this.state.usuario.email}</p>
                    </div>
                    <img src={Usuario} className="fotoUser" ></img>
                </div>

                <form onSubmit={this.cadastrarEndereco} className="form">

                    <div className="divInputCadastroEndereco">
                        <input
                            required
                            className="inputCadastroNovoEndereco"
                            placeholder="Endereco"
                            type="text"
                            onChange={this.setEndereco}
                            value={this.state.endereco}
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
                        />
                    </div>
                    
                    <div className="divInputCadastroEndereco">
                        <input
                            className="inputCadastroNovoEndereco"
                            placeholder="Complemento"
                            type="text"
                            maxLength="255"
                            onChange={this.setComplemento}
                            value={this.state.complemento}
                        />
                    </div>


                    <div className="div_BtnEndereco">
                        <button type="submit" className="btn_CadastrarNovoEndereco">
                            Cadastrar
                        </button >

                        <br></br>
                        {this.state.sucesso === "Erro ao Cadastrar" ? (
                            <h5 style={{ color: 'red' }}>{this.state.erro}</h5>
                        ) : (
                            <h5 style={{ color: 'green' }}>{this.state.erro}</h5>
                        )}
                    </div>
                </form>


                <Footer />
            </div>
        );
    }
}

export default NovoEndereco;