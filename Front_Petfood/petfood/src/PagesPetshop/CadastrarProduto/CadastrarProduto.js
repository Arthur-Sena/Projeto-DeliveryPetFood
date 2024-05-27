import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Axios from 'axios';
import { parseJwt } from '../../services/auth.js';
import HeaderPetshop from '../../Component/Petshop/NavPetshop/NavPetshopHome';
import './CadastrarProduto.css';

class CadastrarProduto extends Component {

    constructor() {
        super();
        this.state = {
            categorias: [],
            titulo: null,
            preco: null,
            descricao: null,
            IdProduto: null,
            Img: "",
            idCategoria: 0,
        }
    }

    buscarCategorias() {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/produtos/categoria', {
            headers: {
                'Method': 'Get',
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then((data) => this.setState({ categorias: data }))
            .catch(error => console.log(error))
    }

    cadastroTitulo = (event) => {
        this.setState({ titulo: event.target.value })
    }
    cadastroPreco = (event) => {
        var valor = event.target.value;
        valor = valor + '';
        valor = parseInt(valor.replace(/[\D]+/g, ''));
        valor = valor + '';
        valor = valor.replace(/([0-9]{2})$/g, ".$1");
        this.setState({ preco: valor });
    }
    cadastroDescricao = (event) => {
        this.setState({ descricao: event.target.value })
    }
    cadastroImg = (event) => {
        let imageFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = new FileReader();
        reader.onload = x => {
            this.setState({ Img: x.target.result })
        }
        reader.readAsDataURL(imageFile)
    }

    cadastroCategoria = (event) => {
        this.setState({ idCategoria: event.target.value })
    }

    CadastrarProduto = (event) => {
        event.preventDefault();
        this.setState({ sucesso: "Carregando" })
        this.refs.btn.setAttribute("disabled", "disabled");

        Axios.post("https://env-9048989.jelastic.saveincloud.net/api/produtos", {
            Titulo: this.state.titulo,
            Preco: this.state.preco,
            Descricao: this.state.descricao,
            Idpetshop: parseJwt().jti,
            IdCategoria: this.state.idCategoria
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
            },
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({ IdProduto: response.data })

                    Axios.post("https://env-9048989.jelastic.saveincloud.net/api/produtos/img", {
                        IdProduto: this.state.IdProduto,
                        Img: this.state.Img
                    }, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                        },
                    }).then(response => {
                        this.setState({ sucesso: "Produto Cadastrado Com Sucesso" })
                    })
                        .catch(error => {
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

    componentDidMount() {
        this.buscarCategorias();
    }

    mensagemDeAtualizacao = () => {
        switch (this.state.sucesso) {
            case "Carregando":
                return <section className="Loading"><div className="c-loader"></div></section>;
            // CSS do loading: /AtualizarLoja.css
            case "Produto Cadastrado Com Sucesso":
                return <h5 style={{ color: 'green' }}>{this.state.sucesso}</h5>;
            default:
                return <h5 style={{ color: 'red' }}>{this.state.sucesso} </h5>;
        }
    }

    render() {
        return (
            <div className="Atualizar_ProdutosDoPetshop">
                <HeaderPetshop status={this.state.status} Titulo="Cadastrar Produto" />


                <form method="POST" onSubmit={this.CadastrarProduto} className="FormCadastro_ProdutoPetshop">
                    <div className="DivPetshop_AtualizarProduto">
                        <label>Titulo
                            <input
                                required
                                maxLength="90"
                                className="Input_AtualizarProduto"
                                type="text"
                                name="name"
                                onChange={this.cadastroTitulo}
                                value={this.state.titulo}
                            />
                        </label>
                    </div>

                    <div className="DivPetshop_AtualizarProduto">
                        <label>Preço</label>
                        <input
                            maxLength="7"
                            required
                            className="Input_AtualizarProduto"
                            type="numeric"
                            inputMode="numeric"
                            min="0.00"
                            step="0.01"
                            name="name"
                            onChange={this.cadastroPreco}
                            value={this.state.preco}
                        />
                    </div>

                    <div className="DivPetshop_AtualizarProduto">
                        <label>Descrição
                            <input
                                required
                                className="Input_AtualizarProduto"
                                type="text"
                                name="name"
                                onChange={this.cadastroDescricao}
                                value={this.state.descricao}
                            />
                        </label>
                    </div>

                    <div className="DivPetshop_AtualizarProduto">
                        <label style={{ marginTop: '5px' }} className="label_maiorinputimg">Imagem
                            <label className="input_img">Escolher Imagem
                                <input
                                    type="file"
                                    className="input_img"
                                    accept="image/png, image/jpeg"
                                    onChange={this.cadastroImg}
                                />
                            </label>
                        </label>
                    </div>

                    <div className="DivPetshop_AtualizarProduto" style={{ marginBottom: "4vh" }}>
                        <label>Categoria Do Produto</label>
                        <select onChange={this.cadastroCategoria} required className='select_input'>
                            <option disabled selected >Categoria Do Produto</option>
                            {this.state.categorias.map(element => {
                                return (
                                    <option value={element.idCategoria} key={element.idCategoria}>{element.categoria}</option>
                                );
                            })}
                        </select>
                    </div>

                    <button type="submit" className="btn_AtualizarProduto" ref="btn">
                        Cadastrar
                    </button >
                    <div style={{ textAlign: 'center' }}>
                        {this.mensagemDeAtualizacao()}
                    </div>
                </form>
            </div>
        );
    }
}

export default CadastrarProduto;