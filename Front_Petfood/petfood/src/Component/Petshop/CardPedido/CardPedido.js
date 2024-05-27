import React, { Component } from 'react';
import Axios from 'axios';
import { parseJwt } from './../../../services/auth';

import './CardPedido.css';
import Preco from './../../../Assets/Icons/preco.svg';
import Data from './../../../Assets/Icons/calendario.svg';
import Hora from './../../../Assets/Icons/Hora.svg';
import Endereco from './../../../Assets/Icons/Footer/homeVermelho.svg';
import Cliente from './../../../Assets/Icons/Footer/perfilVermelho.svg';

let arrayProdutos = [];

class CardPedido extends Component {

    constructor(props) {
        super(props);
        this.state = {
            btnClicado: false,
            dropDown: false,
            produtoPorId: false
        }
    }


    AceitarPedido = (id) => {
        if (this.state.btnClicado == false) {
            this.setState({ btnClicado: true })

            Axios.put("https://env-9048989.jelastic.saveincloud.net/api/pedidos/AceitoPeloPetshop", {
                Id: id
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'ip_usuario': localStorage.getItem("ip_user"),
                },
            })
                .then(response => {
                    this.setState({ btnClicado: false })
                    this.setState({ QntPedidosEmAndamento: this.state.QntPedidosEmAndamento + 1 })
                    window.location.reload();
                })
                .catch(error => this.setState({ btnClicado: false }))
        }
    }

    RecusarPedido = (id) => {
        if (this.state.btnClicado == false) {
            this.setState({ btnClicado: true })

            Axios.put("https://env-9048989.jelastic.saveincloud.net/api/pedidos/RecusadoPeloPetshop", {
                Id: id
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'ip_usuario': localStorage.getItem("ip_user"),
                },
            })
                .then(response => {
                    this.setState({ btnClicado: false })
                    this.setState({ QntPedidosEmAndamento: this.state.QntPedidosEmAndamento - 1 });
                    window.location.reload();
                })
                .catch(error => this.setState({ btnClicado: false }))
        }
    }

    RetornoStatus = () => {
        switch (this.props.Status) {
            case 'Em Analise':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '60px' }}>
                        <div className='DivStatus_CardPedidoPetshop'
                            onClick={() => this.AceitarPedido(this.props.id)}
                            style={{ backgroundColor: '#98CE00', height: '25px', marginBottom: '10px' }}>
                            <p>Aceitar</p>
                        </div>
                        <div className='DivStatus_CardPedidoPetshop'
                            onClick={() => this.RecusarPedido(this.props.id)}
                            style={{ backgroundColor: '#DD1C1A', height: '25px' }}>
                            <p>Recusar</p>
                        </div>
                    </div>
                )
            case 'Aceito':
                return (<div className='DivStatus_CardPedidoPetshop' style={{ backgroundColor: '#98CE00' }}>
                    <p>Aceito</p>
                </div>);
            case 'Concluido':
            case 'Entregue':
                return (<div className='DivStatus_CardPedidoPetshop' style={{ backgroundColor: '#98CE00' }}>
                    <p>Entregue</p>
                </div>);
            case 'Entregando..'://Em Analise
                return (<div className='DivStatus_CardPedidoPetshop' style={{ backgroundColor: '#FE724C' }}>
                    <p>Entregando</p>
                </div>);
            case 'Preparando Entrega':
            case 'Pronto para Retirar':
                return (<div className='DivStatus_CardPedidoPetshop' style={{ backgroundColor: '#FE724C' }}>
                    <p>Preparando Entrega</p>
                </div>);
            default:
                return (<div className='DivStatus_CardPedidoPetshop' style={{ backgroundColor: '#DD1C1A' }}>
                    <p>{this.props.Status}</p>
                </div>)
        }
        ;
    }

    changeEventKey = (event) => {
        this.state.produtoPorId == false ? (
            this.produtoPorId()
        ) : (
            this.setState({ dropDown: !this.state.dropDown })
        );
    }

    produtoPorId = async () => {
        this.setState({ produtoPorId: true })
        let idProdutos = [];
        idProdutos = await this.props.listaProdutos.map(element => {
            return ({ 'idProduto': element.idProduto, 'quantidade': element.quantidade });
        });
        idProdutos.map(x => {
            fetch('https://env-9048989.jelastic.saveincloud.net/api/produtos/' + x.idProduto, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    arrayProdutos.push({ 'produto': data[0], 'id': x.idProduto, 'quantidade': x.quantidade })
                })
                .catch(err => console.log(err))
        });
        this.setState({ dropDown: !this.state.dropDown });
    }

    ClienteRetirouOProduto = (id) => {
        if (this.state.btnClicado == false) {
            this.setState({ btnClicado: true })

            Axios.put("https://env-9048989.jelastic.saveincloud.net/api/pedidos/ClienteRetirouOProduto?idPedido=" + id, {}, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'ip_usuario': localStorage.getItem("ip_user"),
                },
            })
                .then(response => {
                    window.location.reload();
                })
                .catch(error => console.log(error))
        }
    }

    PetshopIniciaEntrega = (id) => {
        if (this.state.btnClicado == false) {
            this.setState({ btnClicado: true })

            Axios.put("https://env-9048989.jelastic.saveincloud.net/api/pedidos/EntregaIniciadaPeloPetshop", {
                Id: id
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'ip_usuario': localStorage.getItem("ip_user"),
                },
            })
                .then(response => {
                    window.location.reload();
                })
                .catch(error => console.log(error))
        }
    }

    PetshopEntregouPedido = (id) => {
        if (this.state.btnClicado == false) {
            this.setState({ btnClicado: true })

            Axios.put("https://env-9048989.jelastic.saveincloud.net/api/pedidos/PedidoEntreguePeloPetshop", {
                Id: id
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'ip_usuario': localStorage.getItem("ip_user"),
                },
            })
                .then(response => {
                    window.location.reload();
                })
                .catch(error => console.log(error))
        }
    }

    render() {
        return (
            <main className='Component_CardPedidoPetshop'>
                <body className="Body_CardPedidoPetshop">
                    <figure className='Figure_CardPedidoPetshop'
                        onClick={this.props.Produtos == false ? (() => {
                            window.location.href = ('/ProdutosDoPedido');
                            localStorage.setItem('idPedido', this.props.id)
                        }) : (null)}>
                        <img src={this.props.Img} />
                    </figure>
                    <section className='Section_CardPedidoPetshop'>

                        <section className='Informacao_CardPedidoPetshop'>
                            <p className='TextoNegrito_CardPedidoPetshop'>{this.props.Nome}</p>
                            <div className='Div_CardPedidoPetshop'>
                                <img src={Data} height='10px' width='10px' />
                                <p className='TextoBasico_CardPedidoPetshop'>{this.props.Data} - {this.props.Hora}</p>
                            </div>
                            <div className='Div_CardPedidoPetshop'>
                                <img src={Endereco} height='10px' width='10px' />
                                <p className='TextoBasico_CardPedidoPetshop'>{this.props.Endereco}</p>
                            </div>
                            <div className='Div_CardPedidoPetshop'>
                                <img src={Cliente} height='10px' width='10px' />
                                <p className='TextoBasico_CardPedidoPetshop'>{this.props.Cliente}</p>
                            </div>
                            <div className='Div_CardPedidoPetshop'>
                                {/* <img src={Cliente} height='10px' width='10px' /> */}
                                <p className='TextoBasico_CardPedidoPetshop'>{this.props.Tel}</p>
                            </div>
                        </section>

                        <section className='Status_CardPedidoPetshop'>
                            {this.RetornoStatus()}

                            <div className='Div_CardPedidoPetshop'>
                                <img src={Preco} height='10px' width='10px' />
                                <p className='TextoNegrito_CardPedidoPetshop' style={{ marginLeft: '6px' }}>{this.props.Preco}</p>
                            </div>
                        </section>

                    </section>
                </body>
                        <br></br>
                {this.props.retirarNaLoja == true && this.props.Status == 'Pronto para Retirar' ? (
                    <footer>
                        <button className='BtnChat_CardPedidoPetshop'
                            onClick={() => {
                                const r = window.confirm("O Cliente Retirou o Produto?");
                                if (r == true) {
                                    this.ClienteRetirouOProduto(this.props.id);
                                }
                            }
                            }
                        >
                            Cliente Retirou o Produto
                        </button>
                    </footer>
                ) : (null)}

                {this.props.Logistica ? (
                    this.props.Logistica != 1 && this.props.Status == "Aceito" ? (

                        <footer>
                            <button className='BtnChat_CardPedidoPetshop'
                                onClick={() => {
                                    const r = window.confirm("A Entrega Foi Iniciada?");
                                    if (r == true) {
                                        this.PetshopIniciaEntrega(this.props.id);
                                    }
                                }
                                }
                            >
                                Iniciar Entrega Do Pedido
                            </button>
                        </footer>
                    ) : (this.props.Logistica != 1 && this.props.Status == "Entregando.." ? (

                        <footer>
                            <button className='BtnChat_CardPedidoPetshop'
                                onClick={() => {
                                    const r = window.confirm("A Entrega Foi Concluida?");
                                    if (r == true) {
                                        this.PetshopEntregouPedido(this.props.id);
                                    }
                                }
                                }
                            >
                                Pedido Entregue
                            </button>
                        </footer>
                    ) : (<div></div>))
                ) : (<div></div>)}

                {this.props.Chat == true ? (
                    <footer>
                        <button className='BtnChat_CardPedidoPetshop' onClick={() => sessionStorage.setItem("idCliente", this.props.idUsuario) + (window.location.href=('/ChatAdm'))}>
                            Chat com Cliente
                        </button>
                    </footer>
                ) : (null)}

                {this.props.Produtos == true && this.props.listaProdutos != null ? (
                    <footer>
                        {this.state.dropDown == false ? (

                            <button className='BtnVerProdutos_CardPedidoPetshop' onClick={() => this.changeEventKey()}>
                                Ver Produtos
                            </button>
                        ) : (
                            <div >

                                <div className='Divisao_Card_Produtos'></div>

                                <p className='Title_ProdutosPedidos'>Produtos Pedidos</p>
                                <div className="Card_ProdutosPedidosPetshop">

                                    {arrayProdutos.map(x => {
                                        return (
                                            <div className="divReturnProdutosPedidos_petshop">
                                                <img src={x.produto.imgprodutos[0].img}
                                                    className="ProdutosPedidos_Petshop"
                                                />
                                                <br></br>
                                                <p><strong>{x.produto.titulo}</strong></p>
                                                <p>Quantidade: {x.quantidade}</p>
                                                <p>Preço: {x.produto.preco.toFixed(2)}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                                <button className='BtnVerProdutos_CardPedidoPetshop' onClick={() => this.changeEventKey()}>
                                    Fechar Lista De Produtos
                                </button>
                            </div>
                        )}
                    </footer>
                ) : (null)}
            </main>
        )
    }
}

export default CardPedido