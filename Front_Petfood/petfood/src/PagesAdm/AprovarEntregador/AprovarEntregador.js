import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Axios from 'axios';
import Menu from '../../Component/MenuAdm';
import './AprovarEntregador.css';

class AprovarEntregador extends Component {

    constructor() {
        super();
        this.state = {
            Entregadores: [],
        }
    }

    listarEntregadoresSemAprovacao = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/administrador/EntregadorSemAprovacao', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => this.setState({ Entregadores: data }))
            .catch(error => console.log(error))
    }

    ReprovarEntregador = (id) => {
        Axios.get('https://env-9048989.jelastic.saveincloud.net/api/administrador/ReprovarEntregador/' + id, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json'
            },
        })
            .then(() => {
                alert("Entregador Reprovado")
                window.location.reload();
            })
            .catch(error => console.log(error))
    }

    AprovarEntregador = (id) => {
        Axios.get('https://env-9048989.jelastic.saveincloud.net/api/administrador/AprovarEntregador/' + id, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json'
            },
        })
            .then(() => {
                alert("Entregador Aprovado")
                window.location.reload();
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.listarEntregadoresSemAprovacao();
    }

    render() {
        return ( 
            <div className="Dash">
                <nav className='navDash'>
                    <Link
                        to="/Dash"
                        style={{ textDecoration: 'none', color: 'white' }}
                    >
                        <h1>Aprovar Entregador</h1>
                    </Link>
                </nav>

                <Menu />

                <div className='Lista_EntregadorSemAprovacao'>
                    {this.state.Entregadores.map(x => {
                        return (
                            <div className='Card_EntregadorSemAprovacao'>
                                <div className='CardDados_Entregador'>
                                    <div className='divImg_EntregadorSemAprovacao'>
                                        {x.imgmotoboy[0] ? (
                                            <img src={x.imgmotoboy[0].img} height={192} width={144} className='img_EntregadorSemAprovacao' />
                                            ):(
                                            <p className='divSemImg_EntregadorSemAprovacao'>Entregador sem foto cadastrada</p>
                                        )}
                                    </div>
                                    <div className='info_EntregadorSemAprovacao'>
                                        <p><strong>Nome:</strong> {x.nome}</p>
                                        <p><strong>Tel :</strong> {x.telefone}</p>
                                        <p><strong>Cpf :</strong> {x.cpf}</p>
                                        {/* <p>{x.email}</p> */}
                                    </div>
                                </div>
                                <div className='DivBtns_EntregadorSemAprovacao'>

                                    <button
                                        className="btn_EntregadorSemAprovacao"
                                        style={{ backgroundColor: 'green' }}
                                        onClick={() => { this.AprovarEntregador(x.idmotoboy)}}
                                    >
                                        Aprovar
                                    </button>
                                    <button
                                        className="btn_EntregadorSemAprovacao"
                                        style={{ backgroundColor: 'red' }}
                                        onClick={() => {
                                            const r = window.confirm("Devo Reprovar o Entregador?");
                                            if (r == true) {
                                                this.ReprovarEntregador(x.idmotoboy);
                                            }
                                        }}
                                    >
                                        Reprovar
                                    </button>

                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        );
    }
}

export default AprovarEntregador;