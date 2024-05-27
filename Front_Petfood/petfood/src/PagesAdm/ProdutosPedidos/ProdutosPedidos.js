import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { parseJwt } from '../../services/auth';
import Menu from './../../Component/MenuAdm';
import './ProdutosPedidos.css';

let arrayProdutos = [];
let quantidade = [];
let produtoPorId = false;

class ProdutosPedidos extends Component {

    constructor() {
        super();
        this.state = {
            Produtos: [],
            Entrega: {},
            from: {},
            to: {},
            dropDown: false,
            data: [],
            imgPetshop: "",
        }
    }

    EntregasEmAndamento = () => {
        produtoPorId = false;
        arrayProdutos = [];

        fetch('https://env-9048989.jelastic.saveincloud.net/api/pedidos/' + localStorage.getItem("idPedido"), {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ Entrega: data[0] })
                this.setState({ from: data[0].caminhoDaEntrega.from })
                this.setState({ to: data[0].caminhoDaEntrega.to })
                this.setState({ EntregaEmAndamento: true })
                this.setState({ Produtos: data[0].listaProdutos })
                this.setState({ produtoRetirado: data[0].status })
                this.setState({ data: data[0].dataPedido.split(" ") })
                this.produtoPorId()
                if (parseJwt().Permissao != 'Petshop') {
                    this.BuscarImgPetshop(this.state.Entrega.idPetshop);
                }
            })
            .catch(error => console.log(error))


    }
    produtoPorId = () => {
        produtoPorId = true;
        let idProdutos = [];
        idProdutos = this.state.Produtos.map(element => {
            return element.idProduto;
        });
        quantidade = this.state.Produtos.map(element => {
            return element.quantidade;
        });
        idProdutos.map(x => {
            fetch('https://env-9048989.jelastic.saveincloud.net/api/produtos/' + x, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    arrayProdutos.push(data[0])
                })
                .catch(err => console.log(err))
        });
    }
    BuscarImgPetshop = (id) => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/petshop/' + id, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ imgPetshop: data[0].imgpetshops[0].img })
            })
            .catch(error => console.log(error))
    }
    componentDidMount() {
        this.EntregasEmAndamento();
        if (parseJwt().Permissao === 'Petshop') { this.BuscarImgPetshop(parseJwt().jti) };
    }
    changeEventKey = (event) => {
        this.setState({ dropDown: !this.state.dropDown });
        if (this.state.dropDown === false && produtoPorId === false) { this.produtoPorId() }
    }
    buscarQuantidade = (id) => {
        let qnt = this.state.Produtos.filter(element => {
            return element.idProduto == id;
        });
        return qnt[0];
    }

    render() {
        return (

            <div className='ProdutosPedidos'>

                <nav className='navDash'>
                    <Link
                        to="/Dash"
                        style={{ textDecoration: 'none', color: 'white' }}
                    >
                        <h1>DASHBOARD</h1>
                    </Link>
                </nav>

                <Menu />

                {/* ---------------------------------------------------------------------------- */}
                {/* <div className="divProdutosPedidos_Petshop"> */}
                <div>
                    <div className='boxPedidosRecentes_ProdutosPedidos'>
                        <div className='divImgPedido'>
                            <img src={this.state.imgPetshop} className='imgPedido' />
                        </div>

                        <div className='divText_ProdutosPedidos'>

                            <p><strong>{this.state.from.petshop}</strong></p>

                            <p>{this.state.data[0]}</p>
                            <p>{this.state.data[1]}</p>
                            <p>Frete: R${parseFloat(this.state.Entrega.frete).toFixed(2)}</p>
                            <p>Produto: R${parseFloat(this.state.Entrega.precoDoProduto).toFixed(2)}</p>
                        </div>
                        <div>
                            {
                                this.state.Entrega.status == "Em Analise" ? (
                                    <div>
                                        <div className='divStatus' style={{ color: 'white', backgroundColor: 'orange', borderRadius: '5px' }}>
                                            <p>{this.state.Entrega.status}</p>
                                        </div>
                                        <br></br>
                                        <div style={{ color: "rgb(110, 110, 110)" }}>
                                            <p>R${this.state.Entrega.preco}</p>
                                        </div>
                                    </div>
                                ) : (
                                    this.state.Entrega.status == 'Aceito' ? (
                                        <div>
                                            <div className='divStatus' style={{ color: 'white', backgroundColor: 'orange', borderRadius: '5px' }}>
                                                <p>{this.state.Entrega.status}</p>
                                            </div>
                                            <br></br>
                                            <div style={{ color: "rgb(110, 110, 110)" }}>
                                                <p>R${this.state.Entrega.preco.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        this.state.Entrega.status == 'Entregue' || this.state.Entrega.status == "Concluido" ? (
                                            <div>
                                                <div className='divStatus' style={{ color: 'white', backgroundColor: 'green', borderRadius: '5px' }}>
                                                    <p>{this.state.Entrega.status}</p>
                                                </div>
                                                <br></br>

                                                <div style={{ color: "rgb(110, 110, 110)" }}>
                                                    <p>R${this.state.Entrega.preco.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            this.state.Entrega.status == 'Entregando..' ? (
                                                <div>
                                                    <div className='divStatus' style={{ color: 'white', backgroundColor: 'orange', borderRadius: '5px' }}>
                                                        <p>{this.state.Entrega.status}</p>
                                                    </div>
                                                    <br></br>

                                                    <div style={{ color: "rgb(110, 110, 110)" }}>
                                                        <p>R${this.state.Entrega.preco.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                this.state.Entrega.status == 'Preparando Entrega' ? (
                                                    <div>
                                                        <div className='divStatus' style={{ color: 'white', backgroundColor: 'orange', borderRadius: '5px' }}>
                                                            <p>{this.state.Entrega.status}</p>
                                                        </div>
                                                        <br></br>

                                                        <div style={{ color: "rgb(110, 110, 110)" }}>
                                                            <p>R${this.state.Entrega.preco.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className='divStatus' style={{ color: 'white', backgroundColor: 'red', borderRadius: '5px' }}>
                                                            <p>{this.state.Entrega.status}</p>
                                                        </div>
                                                        <br></br>
                                                        <div style={{ color: "rgb(110, 110, 110)" }}>
                                                            <p>R${this.state.Entrega.preco}</p>
                                                        </div>
                                                    </div>
                                                )
                                            )
                                        )
                                    )
                                )
                            }
                        </div>
                    </div>
                </div>
                {this.state.dropDown === false ? (
                    <button className="btnVerProdutos_ProdutosPedidos"
                        onClick={() => { this.changeEventKey() }}
                    >
                        <h4>Ver Produtos Pedidos</h4>
                    </button>

                ) : (

                    <div className="divProdutosPedidos_Petshop">
                        {arrayProdutos.map(x => {
                            return (
                                <div className="divReturnProdutosPedidos_petshop">
                                    <img src={x.imgprodutos[0].img}
                                        className="ProdutosPedidos_Petshop"
                                    />
                                    <p><strong>{x.titulo}</strong></p>
                                    <p>Quantidade: {this.buscarQuantidade(x.idproduto).quantidade}</p>
                                    <p>Preço: {this.buscarQuantidade(x.idproduto).preco.toFixed(2)}</p>
                                </div>
                            )
                        })}
                        <button className="btnVerProdutos_ProdutosPedidos"
                            onClick={() => { this.changeEventKey() }}
                            style={{ marginTop:"1vh"}}
                        >
                            <h4>Fechar Lista De Produtos</h4>
                        </button>
                    </div>
                )}
            </div>
        )
    }
}

export default ProdutosPedidos;