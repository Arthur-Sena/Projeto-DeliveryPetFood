import React, { Component } from 'react';
import Axios from 'axios';
import { parseJwt } from '../../services/auth.js';

import './Estoque.css';
import HeaderPetshop from '../../Component/Petshop/NavPetshop/NavPetshopHome';

class Estoque extends Component {

    constructor() {
        super();
        this.state = {
            Petshop: {},
            Produtos: [],
            ProdutosFiltrados: [],
        }
    }

    //#region 'Filtros' 
    atualizaEstado(event) {
        this.setState({ buscar: event.target.value }, () => {
            this.FiltrarPesthop();
        })
    }

    FiltrarPesthop() {
        let listaFiltrada = this.state.Produtos;
        if (this.state.buscar != "") {

            listaFiltrada = listaFiltrada.filter(
                x =>
                    x.titulo.toLowerCase().includes(this.state.buscar.toLowerCase()) ||
                    x.descricao.toLowerCase().includes(this.state.buscar.toLowerCase())
            );
        }
        this.setState({ ProdutosFiltrados: listaFiltrada });
    }
    //#endregion

    //#region 'Requisiçoes'
    BuscarPetshop = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/petshop/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => this.setState({ Petshop: data[0] }))
            .catch(error => console.log(error))
    }

    listarProdutosDoPetshop = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/produtos/petshop/estoque/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => this.setState({ Produtos: data }) + this.setState({ ProdutosFiltrados: data }))
            .catch(error => console.log(error))
    }

    deletarProduto = (id) => {
        if (id != 0) {
            Axios.delete("https://env-9048989.jelastic.saveincloud.net/api/produtos/excluir/" + id, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json'
                },
            })
                .then(() => alert("Produto removido com sucesso"))
            window.location.reload();
        }
    }
    //#endregion

    componentDidMount() {
        this.BuscarPetshop();
        this.listarProdutosDoPetshop();
    }

    Change = (id) => {
        Axios.put("https://env-9048989.jelastic.saveincloud.net/api/produtos/disponibilidade", {
            Idproduto: id
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
            },
        }).catch(erro => console.log(erro))
    }

    deletarProduto = (id) => {
        if (id != 0) {
            Axios.delete("https://env-9048989.jelastic.saveincloud.net/api/produtos/excluir/" + id, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json'
                },
            })
                .then(() => alert("Produto removido com sucesso"))
            window.location.reload();
        }
    }

    render() {
        return (
            <body>
                <HeaderPetshop Titulo="Estoque" CadastrarProduto={true} />
                
                <div className="inputBusca">
                    <input
                        className="inputBuscar"
                        placeholder="Buscar Produto"
                        onChange={this.atualizaEstado.bind(this)}
                        type="search"
                    ></input>

                </div>

                <div className="Div_ListaComCardDosProdutos">
                    {
                        this.state.ProdutosFiltrados.map(x => {
                            return (
                                <div className='CardProduto_EstoquePetshop'>
                                    <div className="Card_InfoProduto_Estoque">
                                        <figure className="Card_DivImgProduto">
                                            <img src={x.imgprodutos[0].img}
                                                className="Card_ImgProdutoEstoque"
                                            />
                                        </figure>

                                        <section className="Card_DivInfoProdutoEstoque" >
                                            <p className="Text_TituloProduto"   >{x.titulo}</p>

                                            <div className="Card_DivPrecoCompraEstoque">

                                                <p className="Text_PrecoProduto">{x.preco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>

                                                <div className='Btns_CardProdutosEstoque'>
                                                    <button className='Btn_AtualizarProdutoEstoque'
                                                        onClick={() => localStorage.setItem("IdProduto", x.idproduto) + (window.location.href = ('/AtualizarProdutoPetshop'))}
                                                    >
                                                        Atualizar
                                                    </button>

                                                    <button className='Btn_DeletarProdutoEstoque'
                                                        onClick={() => {
                                                            const escolheu_deletar = window.confirm("Devo deletar o produto " + x.titulo + " ?");
                                                            if (escolheu_deletar == true) {
                                                                this.deletarProduto(x.idproduto);
                                                            }
                                                        }}
                                                    >
                                                        Deletar
                                                    </button>
                                                    <div class='div_switch'>
                                                        <div>
                                                            <p style={{ fontSize: '12px' }}>Mostrar<br />Produto</p>
                                                        </div>
                                                        <div class="switch__container switch--shadow--Produtos" style={{ marginBottom: '4px' }}>
                                                            <input
                                                                id={x.idproduto}
                                                                class="switch switch--shadow "
                                                                type="checkbox"
                                                                onChange={() => this.Change(x.idproduto)}
                                                                defaultChecked={x.disponivel}
                                                            />
                                                            <label for={x.idproduto}></label>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </section>
                                    </div>

                                </div>
                            )
                        })
                    }
                </div>

            </body>
        )
    }
}

export default Estoque