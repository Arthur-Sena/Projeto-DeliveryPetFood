import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Axios from 'axios';

//Css + images
import './AtualizarProduto.css';

import Menu from './../../Component/MenuAdm';

class AtualizarProduto extends Component {

    constructor() {
        super();
        this.state = {
            categorias: [],
            idCategoria: 0,
            sucesso: "",
            IdProduto: localStorage.getItem("IdProduto"),
            Produto: {},
            DadosImg: {},
            titulo: "",
            preco: null,
            descricao: "",
            img: "",
        }
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
        this.setState({ preco: valor })
    }
    cadastroDescricao = (event) => {
        this.setState({ descricao: event.target.value })
    }
    cadastroImg = (event) => {

        let imageFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = new FileReader();
        reader.onload = x => {
            this.setState({ img: x.target.result })
        }
        reader.readAsDataURL(imageFile)

    }

    cadastroCategoria = (event) => {
        this.setState({ idCategoria: event.target.value })
    }
    // ---------------------------------------------------------------------------------------------------------------
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

    AtualizarProduto = (event) => {
        event.preventDefault();
        this.refs.btn.setAttribute("disabled", "disabled");
        this.setState({ sucesso: "Carregando" })

        const formData = new FormData();
        formData.append('img', this.state.img);

        Axios.put("https://env-9048989.jelastic.saveincloud.net/api/produtos/", {
            IdProduto: this.state.IdProduto,
            Titulo: this.state.titulo,
            preco: this.state.preco,
            descricao: this.state.descricao,
            idpetshop: this.state.Produto.idpetshop,
            idCategoria: this.state.idCategoria
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('usuario-petfood')
            }
        })
            .then(response => {
                if(this.state.img == ""){  
                    this.setState({ sucesso: "Produto Atualizado Com Sucesso" })
                }
                this.refs.btn.removeAttribute("disabled");
            })
            .catch(error => {
                this.setState({ sucesso: error.response.data.mensagem });
                this.refs.btn.removeAttribute("disabled");
            })

        if (this.state.img != null && this.state.img != "") {
            this.setState({ sucesso: "Carregando" })

            Axios.put("https://env-9048989.jelastic.saveincloud.net/api/produtos/img", {
                IdImg: this.state.DadosImg.idimg,
                IdProduto: this.state.IdProduto,
                Img: this.state.img
            }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                    this.setState({ sucesso: "Produto Atualizado Com Sucesso" })
                    this.refs.btn.removeAttribute("disabled");
            })
            .catch(error => {
                console.log(error);
                this.setState({ sucesso: error.response.data.mensagem });
                this.refs.btn.removeAttribute("disabled");
            })
        }
    }

    // ---------------------------------------------------------------------------------------------------------------
    buscarProduto = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/produtos/' + this.state.IdProduto, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {

                this.setState({ Produto: data[0] })
                this.setState({ titulo: data[0].titulo })
                this.setState({ preco: data[0].preco })
                this.setState({ descricao: data[0].descricao })
                this.setState({ titulo: data[0].titulo })
                this.setState({ idCategoria: data[0].idCategoria })
                this.setState({ DadosImg: data[0].imgprodutos[0] })
                // this.setState({ img: data[0].imgprodutos[0].img })
            })

            .catch(error => console.log(error))
    }
    // ---------------------------------------------------------------------------------------------------------------

    componentDidMount() {
        this.buscarProduto();
        this.buscarCategorias();
        console.log("IMG",this.state.img);
    }
    mensagemDeAtualizacao = () => {
        switch (this.state.sucesso) {
            case "Carregando":
                return <section className="Loading"><div className="c-loader"></div></section>;
            // CSS do loading: /AtualizarLoja.css
            case "Produto Atualizado Com Sucesso":
                return <h5 style={{ color: 'green' }}>{this.state.sucesso}</h5>;
            default:
                return <h5 style={{ color: 'red' }}>{this.state.sucesso} </h5>;
        }
    }

    render() {
        return (
            <div className="DivProdutosDaLoja">
                <nav className='navDash'>
                    <Link
                        to="/Dash"
                        style={{ textDecoration: 'none', color: 'white' }}
                    >
                        <h1>Atualizar Produto - {this.state.Produto.titulo}</h1>
                    </Link>
                </nav>

                <Menu />

                <form method="POST" onSubmit={this.AtualizarProduto} className="FormCadastro_Produto">

                    <div className="divInput_Produto">
                        <div className="item_formproduto1">
                            <label>Titulo</label>
                            <input
                                required
                                maxLength="90"
                                className="input__CadastroProduto"
                                type="text"
                                name="name"
                                onChange={this.cadastroTitulo}
                                value={this.state.titulo}
                            />
                        </div>

                        <div className="item_formproduto1">
                            <label>Preço</label>
                            <input
                                maxLength="7"
                                required
                                className="input__CadastroProduto"
                                type="numeric"
                                inputMode="numeric"
                                min="0.00"
                                step="0.01"
                                name="name"
                                onChange={this.cadastroPreco}
                                value={this.state.preco}
                            />
                        </div>
                    </div>

                    <div className="item_formproduto1">
                        <label>Descrição</label>
                        <input
                            required
                            className="input__CadastroProduto1"
                            type="text"
                            name="name"
                            onChange={this.cadastroDescricao}
                            value={this.state.descricao}
                        />
                    </div>

                    <div className="divInput_Produto">
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

                    <div className="item_formproduto1" style={{ marginBottom: "4vh" }}>
                        <select onChange={this.cadastroCategoria} required>
                            <option disabled selected >Categoria Do Produto</option>
                            {this.state.categorias.map(element => {
                                return (
                                    <option value={element.idCategoria} key={element.idCategoria}>{element.categoria}</option>
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

export default AtualizarProduto;