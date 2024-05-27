import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { parseJwt } from '../../services/auth';

import Seta from '../../Assets/chevron-left.svg';
import './MeusPedidos.css';
import filtro from '../../Assets/iconFiltro.png';

class MeusPedidos extends Component {

    constructor() {
        super();
        this.state = {
            mensagens: [],
            UltimosPedidos: [],
            UltimosPedidosFiltrados: [],
            qntProdutos: [],
            notaPetshop: 3,
            notaEntregador: 3,
            novaMensagem: null,
            abrirFiltro: false,
        }
    }

    listarUltimosPedidos = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/pedidos/usuario/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ UltimosPedidos: data.reverse() })
                this.setState({ UltimosPedidosFiltrados: data });

            })
            .catch(error => console.log(error))
    }

    abrirFiltro = () => {
        this.setState({ abrirFiltro: !this.state.abrirFiltro });
    }

    FiltrarPedido(filtro) {
        let listaFiltrada = this.state.UltimosPedidos;
        if (filtro == 1) {
            listaFiltrada = listaFiltrada.filter(
                x => x.status == 'Entregue' || x.status == 'Concluido'
            );
        }
        if (filtro == 2) {
            listaFiltrada = listaFiltrada.filter(
                x => x.status == 'Cancelado'
            );
        }
        if (filtro == 3) {
            listaFiltrada = listaFiltrada.filter(
                x => x.status == 'Aceito' || x.status == 'Entregando..' || x.status == "Preparando Entrega" || x.status == "Em Analise" || x.status == "Aceito"
            );
        }
        this.setState({ UltimosPedidosFiltrados: listaFiltrada });
    }

    componentDidMount() {
        localStorage.removeItem('idPedido')
        this.listarUltimosPedidos();
    }

    render() {
        return (
            <div className="MeusPedidos_Div" >
                <div className="divSacola">
                    <img src={Seta} className="icon_NavSacola" style={{ width: '1.5em' }} onClick={() => { this.props.history.push('/home') }} />

                    <div className="DivSacolaH1">
                        <h2>Meus Pedidos</h2>
                    </div>
                </div>

                <div className="div_FiltrosMeusPedidos">
                    <div
                        style={{
                            marginTop: '5px',
                            display: 'grid',
                            placeItems: "center"

                        }}>
                        <button className="btn_FiltroDePedidos" onClick={() => this.abrirFiltro()}>
                            <p>Filtro</p>
                            <img src={filtro} height="20" />
                        </button>
                    </div>

                    {(this.state.abrirFiltro == false) ? (<div></div>) : (
                        <div >
                            <div className="div_FiltrarPorNota">
                                <button className="div_PorNota" style={{ width: "33%" }}
                                    onClick={() => {
                                        this.FiltrarPedido(1);
                                    }}
                                >
                                    <p>Entregues</p>
                                </button>
                                <button className="div_PorNota" style={{ width: "33%" }}
                                    onClick={() => {
                                        this.FiltrarPedido(2);
                                    }}>
                                    <p>Cancelados</p>
                                </button>
                                <button className="div_PorNota" style={{ width: "33%" }}
                                    onClick={() => {
                                        this.FiltrarPedido(3);
                                    }}>
                                    <p>Pendentes</p>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                {/* ------------------------------------- */}

                <div className="DivPai_ReturnUltimosPedidos_MeusPedidos">

                    {this.state.UltimosPedidosFiltrados.map(x => {
                        let data = x.horaDeEntrega_Retirada.horarioDoPedido.split(" ");
                        return (
                            <div className="Div_BoxSacola">
                                <div className='boxSacola' >
                                    <Link to="/ProdutosComprados"
                                        onClick={() => { sessionStorage.setItem("idPedido", x.id) }}
                                        style={{ textDecoration: "none" }}
                                        className="div_FirstInformacoesDoPedido"
                                    >
                                        <div className="div_TextTitulo">
                                            <h3>{x.caminhoDaEntrega.from.petshop}</h3>
                                        </div>
                                        <div className='divText'>
                                            <p><strong>De:</strong> {x.caminhoDaEntrega.from.endereco}</p>
                                            <p><strong>Para: </strong>{x.caminhoDaEntrega.to.endereco}</p>
                                        </div>
                                    </Link>

                                    <div className="div_statusPedido">
                                        {
                                            x.status == "Em Analise" || x.status == "Aceito" ? (
                                                <div >
                                                    <div className='divStatus' style={{ backgroundColor: '#FF8700' }}>
                                                        <p>Pendente</p>
                                                    </div>
                                                    <div className="subdiv_StatusPedido">
                                                        <p>{data[1].substr(0, 5).replace(":", "h").concat("min")}</p>
                                                        <p>R${x.preco.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                x.status == 'Entregue' || x.status == 'Aceito' || x.status == 'Entregando..' || x.status == "Preparando Entrega" || x.status == 'Concluido' ? (
                                                    <div >
                                                        <div className='divStatus' style={{ backgroundColor: '#04E762' }}>
                                                            <p>{x.status == 'Entregue' || x.status == 'Concluido' ? ("Entregue") : ("Aceito")}</p>
                                                        </div>

                                                        <div className="subdiv_StatusPedido">
                                                            <p>R${x.preco.toFixed(2)}</p>
                                                            <p>{data[0].substr(0, 5)}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div >
                                                        <div className='divStatus' style={{ backgroundColor: '#FF2226' }}>
                                                            <p>{x.status}</p>
                                                        </div>
                                                        <div className="subdiv_StatusPedido">
                                                            <p>R${x.preco.toFixed(2)}</p>
                                                            <p>{data[0].substr(0, 5).replace("h", ":")}</p>
                                                        </div>
                                                    </div>
                                                )
                                            )

                                        }
                                    </div>
                                </div>
                            </div>

                        )
                    })
                    }
                    <br></br>
                </div>
            </div>
        );
    }
}

export default MeusPedidos;