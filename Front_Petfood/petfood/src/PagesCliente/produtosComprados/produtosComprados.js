import React, { Component } from 'react';
import Seta from '../../Assets/chevron-left.svg';
import dropDown from './../../Assets/chevron-down.svg';
import dropDown1 from './../../Assets/chevron-up.svg';

import './produtosComprados.css';
let arrayProdutos = [];
let produtoPorId = false;

class produtosComprados extends Component {

    constructor() {
        super();
        this.state = {
            Produtos: [],
            Entrega: {},
            from: {},
            to: {},
            dropDown: false,
            carregado: false,
        }
    }

    EntregasEmAndamento = () => {
        produtoPorId = false;
        arrayProdutos = [];

        fetch('https://env-9048989.jelastic.saveincloud.net/api/pedidos/' + sessionStorage.getItem("idPedido"), {
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
                // data.push(data.dataPedido.split(" "));
                this.produtoPorId();
            })
            .catch(error => console.log(error))
    }

    produtoPorId = () => {
        this.setState({ carregado: true })
        produtoPorId = true;
        let idProdutos = [];
        idProdutos = this.state.Produtos.map(element => {
            return element.idProduto;
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

    componentDidMount() {
        this.EntregasEmAndamento();
    }

    buscarQuantidade = (id) => {
        let qnt = this.state.Produtos.filter(element => {
            return element.idProduto == id;
        });
        return qnt[0];
    }

    changeEventKey = (event) => {
        this.setState({ dropDown: !this.state.dropDown });
        if (this.state.dropDown === false && produtoPorId === false) { this.produtoPorId() }
    }

    render() {
        return (

            <div className='Sacola'>

                <div className="divSacola">
                    <img src={Seta} className="icon_navProdutosComprados" style={{ width: '1.5em' }} onClick={() => { this.props.history.push('/sacola'); }} />

                    <div className="DivSacolaH1">
                        <h1>Sacola</h1>
                    </div>
                </div>

                {/* ---------------------------------------------------------------------------- */}

                <div className="div_telaProdutosComprados">
                    <div className="Div_BoxSacolaComProdutos">
                        <div className='boxSacola'   >

                            <div className="div_FirstInformacoesDoPedido">

                                <div className="div_TextTitulo">
                                    <h3>{this.state.from.petshop}</h3>
                                </div>

                                <div className='divText'>
                                    <p><strong>De:</strong> {this.state.from.endereco}</p>
                                    <p><strong>Para: </strong>{this.state.to.endereco}</p>
                                </div>

                            </div>


                            <div className="div_statusPedido">
                                {
                                    this.state.Entrega.status == "Em Analise"  ? (
                                        <div >
                                            <div className='divStatus' style={{ backgroundColor: '#FF8700' }}>
                                                <p>Pendente</p>
                                            </div>
                                            <div className="subdiv_StatusPedido">
                                                {/* <p>{data[1].substr(0, 5).replace(":", "h").concat("min")}</p> */}
                                                <p>R${this.state.Entrega.preco}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        this.state.Entrega.status == 'Entregue' || this.state.Entrega.status == 'Aceito' || this.state.Entrega.status == 'Entregando..' || this.state.Entrega.status == "Preparando Entrega" || this.state.Entrega.status == 'Concluido'  ? (
                                            <div >
                                                <div className='divStatus' style={{ backgroundColor: '#04E762' }}>
                                                    <p>{this.state.Entrega.status == 'Entregue' || this.state.Entrega.status == 'Concluido' ?("Entregue"):("Aceito") }</p>
                                                </div>

                                                <div className="subdiv_StatusPedido">
                                                    <p>R${this.state.Entrega.preco}</p>
                                                    {/* <p>{data[0].substr(0, 5)}</p> */}
                                                </div>
                                            </div>
                                        ) : (
                                            <div >
                                                <div className='divStatus' style={{ backgroundColor: '#FF2226' }}>
                                                    <p>Cancelado</p>
                                                </div>
                                                <div className="subdiv_StatusPedido">
                                                    <p>R${this.state.Entrega.preco}</p>
                                                    {/* <p>{data[0].substr(0, 5).replace("h", ":")}</p> */}
                                                </div>
                                            </div>
                                        )
                                    )

                                }
                            </div>

                        </div>
                    </div>
                    {this.state.dropDown === true ? (
                        <div    className="div_dropDownProdutosComprados">

                            <div className="divPai_ProdutosComprados">
                                {arrayProdutos.map(x => {
                                    return (
                                        <div className="divProdutosCompradosCliente">
                                            <img src={x.imgprodutos[0].img}
                                                className="ProdutosComprados_Cliente"
                                            />
                                            <p ><strong>{x.titulo}</strong></p>
                                            <p>Quantidade: {this.buscarQuantidade(x.idproduto).quantidade}</p>
                                            <p>Preço: {this.buscarQuantidade(x.idproduto).preco.toFixed(2)}</p>
                                        </div>
                                    )
                                })}

                            </div>

                            <div className="Divbtn_DropDown">
                                <button className="Divbtn_verProdutos"
                                    onClick={() => { this.changeEventKey() }}
                                >
                                    <h4>Produtos Pedidos</h4>
                                    <img src={dropDown1} />
                                </button>
                            </div>
                        </div>

                    ) : (
                        <div className="Divbtn_DropDown"
                        >
                            <button className="Divbtn_verProdutos"
                                onClick={() => this.changeEventKey()}
                            >
                                <h4>Produtos Pedidos</h4>

                                <img src={dropDown} />
                            </button>
                        </div>
                    )}

                </div>

            </div>
        )
    }
}

export default produtosComprados;
