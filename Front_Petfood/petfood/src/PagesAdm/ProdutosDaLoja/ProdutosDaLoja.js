import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Axios from 'axios';

//Css + images
import './ProdutosDaLoja.css';

import Menu from './../../Component/MenuAdm';

class ProdutosDaLoja extends Component {

    constructor() {
        super();
        this.state = {
            IdPetshop: localStorage.getItem("IdPetshop"),
            Petshop: {},
            Produtos: [],
            ProdutosFiltrados: [],
        }
    }
    // ---------------------------------------------Filtro------------------------------------------------------------
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
    // ---------------------------------------------------------------------------------------------------------------
    BuscarPetshop = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/petshop/' + this.state.IdPetshop, {
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
        fetch('https://env-9048989.jelastic.saveincloud.net/api/produtos/petshop/estoque/' + this.state.IdPetshop, {
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
    // ---------------------------------------------------------------------------------------------------------------

    componentDidMount() {
        this.BuscarPetshop();
        this.listarProdutosDoPetshop();
    }

    Change = (id) => {
        Axios.put("https://env-9048989.jelastic.saveincloud.net/api/produtos/disponibilidade", {
            Idproduto : id
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
            },
        })
            .then(response => {
                if (response.status === 200) {
                    console.log("OK");
                    // window.location.reload();
                }
            })
            .catch(erro => console.log(erro))
    }

    render() {
        return (
            <div className="DivProdutosDaLoja">
 
                <nav className='navEstoque'>
                    <Link
                        to="/Dash"
                        style={{ textDecoration: 'none', color: 'white' }}
                    >
                        <h1>{this.state.Petshop.nome} - Estoque</h1>
                    </Link>

                    <button className="btnNavEstoque"
                        onClick={() =>
                            this.props.history.push('/GerarPedido')
                        }
                    >
                        Criar Pedido
                    </button>

                    <button className="btnNavEstoque"
                        onClick={() =>
                            this.props.history.push('/CadastrarProduto')
                        }
                    >
                        Cadastrar Produto
                    </button>
                </nav>

                <Menu />

                {/* ---------------------------------------------------INPUT BUSCAR PRODUTO----------------------------------------------------------------- */}
                <div className="divBusca_ADM">
                    <input
                        className="inputBuscar_ADM"
                        placeholder="   Buscar Produto"
                        onChange={this.atualizaEstado.bind(this)}
                    ></input>
                </div>

                {/* ----------------------------------------------------LISTAR PRODUTOS-------------------------------------------------------------------- */}

                <div className="listaProdutos">
                    {this.state.ProdutosFiltrados.map(x => {
                        return (
                            <div className="divProduto">
                                <img src={x.imgprodutos[0].img} className="imgProdutoDaListagemAdm" />
                                <div className='cardListLojas'>

                                    <p><strong>{x.titulo}</strong></p>

                                    <div className="divBtnListLojas">
                                        <button className='BtnListLojas'
                                            style={{marginBottom: '4px'}}
                                            onClick={() => { 
                                                const r = window.confirm("Devo deletar o produto " + x.titulo + " ?");
                                                if (r == true) {
                                                    this.deletarProduto(x.idproduto);
                                                }
                                            }}
                                        >
                                            Deletar
                                        </button>
                                        
                                        <button className="BtnListLojas"
                                            style={{marginBottom: '4px'}}
                                            onClick={() =>
                                                localStorage.setItem("IdProduto", x.idproduto)
                                                +
                                                this.props.history.push('/AtualizarProduto')
                                            }
                                        >
                                            Atualizar
                                        </button>

                                        <p  className='switch_text'>Produto Disponivel?</p>
                                        <div style={{ display:'flex', flexDirection:'row', justifyContent:'space-between', padding: '0px 10px' }}>
                                            <p className='switch_text'>Não</p>
                                            <p className='switch_text'>Sim</p>
                                        </div>
                                        <div class="switch__container switch--shadow--Produtos"  style={{marginBottom: '4px'}}>
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
                        )
                    })}

                </div>

            </div>
        );
    }
}

export default ProdutosDaLoja;