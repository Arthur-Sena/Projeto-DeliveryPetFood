import React, { Component } from 'react';
import Menu from './../../Component/MenuAdm';
import { parseJwt } from './../../services/auth.js';
import { Link } from "react-router-dom";
//Css + images
import './PedidosDaLoja.css';

class PedidosDaLoja extends Component {

    constructor() {
        super();
        this.state = {
            UltimosPedidos: [],
            infoPetshop: "",
            imgPetshop: "",
        }
    }

    listarUltimosPedidos = () => {
        if (parseJwt().Permissao === 'Petshop') {
            fetch('https://env-9048989.jelastic.saveincloud.net/api/pedidos/petshop/' + parseJwt().jti, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    this.setState({ UltimosPedidos: data });
                })
                .catch(error => console.log(error))
        } else {
            fetch('https://env-9048989.jelastic.saveincloud.net/api/pedidos', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    this.setState({ UltimosPedidos: data });
                })
                .catch(error => console.log(error))
        }
    }

    BuscarImgPetshop = (id) => { 
        var imgPetshop = [];

        if (parseJwt().Permissao === 'Petshop') {
            fetch('https://env-9048989.jelastic.saveincloud.net/api/petshop/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => this.setState({ imgPetshop: data[0].imgpetshops[0].img }) + this.setState({ infoPetshop: data[0].nome }))
                .catch(error => console.log(error))
        } else {
            fetch('https://env-9048989.jelastic.saveincloud.net/api/petshop/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => { 
                    imgPetshop.push(data[0].imgpetshops[0]);
                })
                .catch(error => console.log(error))
                 var img = imgPetshop.filter(element => {
                    return element.idpetshop == id;
                });
                return img;
        }
    }

    componentDidMount() {
        this.listarUltimosPedidos();
        if (parseJwt().Permissao === 'Petshop') {
            this.BuscarImgPetshop(parseJwt().jti);
        }
    }

    render() {
        return (
            <div className="PedidosDaLoja">

                <nav className='navDash'>
                    <Link to="/Dash" style={{ textDecoration: "none", color: "white" }}><h1>DASHBOARD</h1></Link>
                </nav>

                <Menu />

                <div className="PedidosDaLoja_Main">

                    <h2 className='h2Pedidos'>Histórico de Pedidos</h2>

                    <div className="divUltimosPedidos_List">
                        {this.state.UltimosPedidos.map(x => {
                            let data = x.dataPedido.split(" ");
                            // var petshop = this.buscarPetshopTelaDeAdm(x.idPetshop);

                            return (
                                <Link to="/ProdutosPedidos"
                                    onClick={() => { localStorage.setItem("idPedido", x.id) }}
                                    style={{ textDecoration: "none" }}
                                >
                                    <div className='boxPedidosRecentes'>
                                        <div className='divImgPedido'>
                                            {parseJwt().Permissao === 'Petshop' ? (
                                                <img src={this.state.imgPetshop} className='imgPedido' />
                                            ) : (
                                                // <img  src={this.BuscarImgPetshop(x.idPetshop)}  />
                                                <div>
                                                </div>                                                
                                            )}
                                        </div>

                                        <div className='divText_ProdutosPedidos'>
                                            {parseJwt().Permissao === 'Petshop' ? (
                                                <p><strong>{this.state.infoPetshop}</strong></p>
                                            ) : (
                                                <p><strong>{x.caminhoDaEntrega.from.petshop}</strong></p>
                                            )}

                                            <p>{data[0]}</p>
                                            <p>{data[1]}</p>

                                        </div>
                                        <div>
                                            { 
                                                x.status == "Em Analise" ? (
                                                    <div>
                                                        <div className='divStatus' style={{ color: 'white', backgroundColor: 'orange', borderRadius: '5px' }}>
                                                            <p>{x.status}</p>
                                                        </div>
                                                        <br></br>
                                                        <div style={{ color: "rgb(110, 110, 110)" }}>
                                                            <p>R${x.preco}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    x.status == 'Aceito' || x.status == 'Entregando..' || x.status == "Preparando Entrega" ? (
                                                        <div>
                                                            <div className='divStatus' style={{ color: 'white', backgroundColor: 'orange', borderRadius: '5px' }}>
                                                                <p>{x.status}</p>
                                                            </div>
                                                            <br></br>
                                                            <div style={{ color: "rgb(110, 110, 110)" }}>
                                                                <p>R${x.preco}</p>
                                                            </div>
                                                        </div>

                                                    ) : (
                                                        x.status == 'Entregue' || x.status == 'Concluido' ? (
                                                            <div>
                                                                <div className='divStatus' style={{ color: 'white', backgroundColor: 'green', borderRadius: '5px' }}>
                                                                    <p>{x.status}</p>
                                                                </div>
                                                                <br></br>

                                                                <div style={{ color: "rgb(110, 110, 110)" }}>
                                                                    <p>R${x.preco}</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            x.status == 'Entregando..' ? (
                                                                <div>
                                                                    <div className='divStatus' style={{ color: 'white', backgroundColor: 'orange', borderRadius: '5px' }}>
                                                                        <p>{x.status}</p>
                                                                    </div>
                                                                    <br></br>

                                                                    <div style={{ color: "rgb(110, 110, 110)" }}>
                                                                        <p>R${x.preco}</p>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <div className='divStatus' style={{ color: 'white', backgroundColor: 'red', borderRadius: '5px' }}>
                                                                        <p>{x.status}</p>
                                                                    </div>
                                                                    <br></br>
                                                                    <div style={{ color: "rgb(110, 110, 110)" }}>
                                                                        <p>R${x.preco}</p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )
                                                    )
                                                )
                                            }
                                        </div>

                                    </div>
                                </Link>
                            )
                        })}


                    </div>
                </div>
            </div>
        );
    }
}

export default PedidosDaLoja;