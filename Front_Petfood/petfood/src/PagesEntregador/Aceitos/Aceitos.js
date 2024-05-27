import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { parseJwt } from '../../services/auth';
import Axios from 'axios';

import './Aceitos.css';

import Footer from './../../Component/FooterEntregador';
import dropDown from './../../Assets/chevron-down.svg';
import dropDown1 from './../../Assets/chevron-up.svg';

let arrayProdutos = [];
let produtoPorId = false;

function start() {
    let context = new AudioContext(),
        oscillator = context.createOscillator(),
        contextGain = context.createGain();

    oscillator.type = 'sine';
    oscillator.connect(contextGain);
    contextGain.connect(context.destination);
    oscillator.start(0);
    contextGain.gain.exponentialRampToValueAtTime(
        0.00001, context.currentTime + 2
    )
}

class EntregaAceita extends Component {

    constructor() {
        super();
        this.state = {
            Entrega: [],
            EntregaEmAndamento: null,
            dropDown: false,
            pedidoDropDown: '',
            mensagensEntregador: [],
            quantidadeDeMensagemNovaEntregador: 0,
        }
    }

    EntregasEmAndamento = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/pedidos/emandamento/motoboy/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ Entrega: data })
                this.setState({ from: data[0].caminhoDaEntrega.from })
                this.setState({ to: data[0].caminhoDaEntrega.to })
                this.setState({ EntregaEmAndamento: true })
                this.setState({ Produtos: data[0].listaProdutos })
                this.setState({ produtoRetirado: data[0].status })
                this.produtoPorId();
            })
            .catch(error => console.log(error))

    }

    produtoPorId = () => {
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
        this.novasMensagensEntregador();
        this.contarNovasMensagensEntregador();
    }

    changeEventKey = (event) => {
        this.setState({ dropDown: !this.state.dropDown });
        if (this.state.dropDown === false && produtoPorId === false) { this.produtoPorId() }
    }

    ProdutoJaFoiRetirado = (idRecebido) => {
        Axios.put("https://env-9048989.jelastic.saveincloud.net/api/pedidos/ProdutosJaRetirado", {
            id: idRecebido
        }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
            .then(response => {
                if (response.status === 200) {
                    window.location.reload();
                }
            })
            .catch(error => console.log(error))
    }

    EntregaConcluida = (idRecebido) => {
        Axios.put("https://env-9048989.jelastic.saveincloud.net/api/pedidos/PedidoEntregue", {
            id: idRecebido,
        }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
            .then(response => {
                if (response.status === 200) {
                    window.location.reload();
                }
            })
            .catch(error => console.log(error))
    }

    buscarQuantidade = (id) => {
        let qnt = this.state.Produtos.filter(element => {
            return element.idProduto == id;
        });
        return qnt[0];
    }

    novasMensagensEntregador = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/ChatMotoboyUsuario/NovasMensagens?idEntregador=' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ mensagensEntregador: data });
            })
            .catch(error => console.log(error))
    }
    contarNovasMensagensEntregador = () => {
        let autorizacao = localStorage.getItem("usuario-petfood");
        if (autorizacao != null) {
            var novasMensagensEntregador = setInterval(() => fetch('https://env-9048989.jelastic.saveincloud.net/api/ChatMotoboyUsuario/NovasMensagens/Count?idEntregador=' + parseJwt().jti, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    this.setState({ qntMensagens: data });
                    if (this.state.qntMensagens != this.state.mensagensEntregador.length) {
                        this.novasMensagensEntregador();
                    }
                })
                .catch(error => clearInterval(novasMensagensEntregador)), 4000)
        } else {
            clearInterval(novasMensagensEntregador);
            clearInterval(0);
            clearInterval(1);
            clearInterval(2);
            clearInterval(3);
        }
        if (this.state.qntMensagensEntregador != this.state.mensagensEntregador.length) {
            this.novasMensagensEntregador();
        }
    }
    verificarNovaMensagemEntregador = (id) => {
        const novaMensagemEntregador = this.state.mensagensEntregador.filter(x => {
            return x.idUsuario == id;
        });
        if (novaMensagemEntregador.length != 0) {
            if (this.state.quantidadeDeMensagemNovaEntregador != novaMensagemEntregador.length) {
                this.setState({ quantidadeDeMensagemNovaEntregador: novaMensagemEntregador.length })
                start();
            }
            return novaMensagemEntregador.length + " Novas"
        } else {
            return ""
        }
    }
    render() {
        return (

            <div className='Aceito'>

                <nav className='navEntregador'>
                    <div className='divH1Nav'>
                        <h1>Pedidos aceitos{this.produtoRetirado}</h1>
                    </div>
                </nav>

                {/* ---------------------------------------------------------------------------- */}

                <div ClassName="divPaiListaNovosPedidos">

                    {this.state.EntregaEmAndamento === true ? (

                        this.state.Entrega.map(x => {
                            return (
                                <div className='divListaNovosPedidos'
                                    style={{ fontWeight: 'inherit', padding: '8px', marginBottom: '12px' }}
                                >
                                    <div className='Div_BtnPedidosAceitos'>
                                        {x.status == "Entregando.." ? (
                                            <button className="btnNav"
                                                onClick={() => {
                                                    const r = window.confirm("O produto já foi entregue ?");
                                                    if (r == true) {
                                                        this.EntregaConcluida(x.id);
                                                    }
                                                }}
                                            >
                                                Entrega Concluida
                                            </button>
                                        ) : (
                                            <button className="btnNav"
                                                onClick={() => {
                                                    const r = window.confirm("O produto já foi retirado ?");
                                                    if (r == true) {
                                                        this.ProdutoJaFoiRetirado(x.id);
                                                    }
                                                }}
                                            >
                                                Produto Retirado
                                            </button>
                                        )}

                                        <button className="btnNav"
                                            onClick={() => {
                                                sessionStorage.setItem("idCliente_Chat", x.idUsuario);
                                                this.props.history.push('/ChatEntregador');
                                            }}
                                            style={{ display: 'flex', flexDirection: 'column' }}>
                                            Chat Com Cliente
                                            <p style={{ textAlign: 'center', fontSize: 'small' }}>{this.verificarNovaMensagemEntregador(x.idMotoboy)}</p>
                                        </button>
                                    </div>
                                    <p><strong>Código:</strong> {x.id}</p>
                                    <p><strong>Cliente: </strong>{x.cliente.nome}</p>
                                    <p><strong>Telefone: </strong>{x.cliente.telefone}</p>
                                    <p><strong>Petshop: </strong>{x.caminhoDaEntrega.from.petshop}</p>
                                    <p><strong>De: </strong>{x.caminhoDaEntrega.from.endereco}</p>
                                    {x.caminhoDaEntrega.to.complemento != null ? (
                                        <p><strong>Para: </strong>{x.caminhoDaEntrega.to.endereco} - {x.caminhoDaEntrega.to.complemento}</p>
                                    ) : (
                                        <p><strong>Para: </strong>{x.caminhoDaEntrega.to.endereco}</p>
                                    )}                                    <p><strong>Preço:</strong> R$ {x.preco}</p>
                                    <p><strong>Preço:</strong> R$ {x.preco}</p>
                                    {x.pagamento.tipo != "Cartão na Hora da Entrega" ? (
                                        <p><strong>Pagamento:</strong> {x.pagamento.tipo} - (Já esta pago)</p>
                                    ) : (
                                        <p><strong>Pagamento:</strong> Pagar na entrega - cartão</p>
                                    )}
                                    {x.pagamento.tipo == "Cartão na Hora da Entrega" ? (
                                        <p>PS* Pagamento será efetuado no CARTÃO durante a entrega</p>
                                    ) : (<div></div>)}
                                </div>
                            )
                        })
                    ) : (
                        <div className='divListaNovosPedidos'
                            style={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                            <p>Ainda não há entregas em andamento</p>
                        </div>
                    )}

                </div>

                <Footer />
            </div>
        )
    }
}

export default EntregaAceita;