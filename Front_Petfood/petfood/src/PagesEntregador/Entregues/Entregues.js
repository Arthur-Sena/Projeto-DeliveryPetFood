import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { parseJwt } from '../../services/auth';

import './Entregues.css';

import Footer from './../../Component/FooterEntregador';

import Atualizar from '../../Assets/arrow-repeat.svg';

class Entregues extends Component {

    constructor() {
        super();
        this.state = {
            pedidosEntregues: [],
        }
    }

    ListarEntregasConcluidas = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/pedidos/entregues/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ pedidosEntregues: data })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.ListarEntregasConcluidas();
    }

    render() {
        return (

            <div className='Entregues'>

                <nav className='navEntregador'>
                    <div className='divH1Nav'>
                        <h1>Pedidos Entregues</h1>
                    </div>

                    <button className="btnNav"

                    >
                        Atualizar
                        <img src={Atualizar} style={{ height: '1.4em' }} />
                    </button>

                </nav>

                <div className="DivPai_ReturnEntregasConcluidas">
                    {this.state.pedidosEntregues.map(x => {
                        let horaInicial = x.horaDeEntrega_Retirada.horarioEmQueFoiAceitoPeloEntregador.split(" ");
                        let horaInicialH_MIN = horaInicial[1].split(":");
                        let horaFinal = x.horaDeEntrega_Retirada.horarioDaEntrega.split(" ");
                        let horaFinalH_MIN = horaFinal[1].split(":");

                        return (
                            <div className="divPaiListaNovosPedidos">
                                <div className='divListaNovosPedidos'>
                                    <p><strong>Código:</strong> {x.id}</p>
                                    <p><strong>Petshop:</strong> {x.caminhoDaEntrega.from.petshop}</p>
                                    <p><strong>De:</strong> {x.caminhoDaEntrega.from.endereco}</p>
                                    <p><strong>Para: </strong>{x.caminhoDaEntrega.to.endereco}</p>
                                    <p><strong>Preço:</strong> R${x.preco}</p>
                                    <p><strong>Data:</strong> {horaInicial[0]}  ( {horaInicialH_MIN[0]}:{horaInicialH_MIN[1]} - {horaFinalH_MIN[0]}:{horaFinalH_MIN[1]} ) </p>
                                </div>
                            </div>
                        )
                    })
                    }
                </div>


                <Footer />
            </div>
        )
    }
}

export default Entregues;