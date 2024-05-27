import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from "react-router-dom";
import { Chart } from "react-google-charts";
import { parseJwt } from '../../services/auth';
import { Helmet } from "react-helmet";

//Css + images
import './HomeEntregador.css';

import Footer from './../../Component/FooterEntregador';
import Avaliador from './../../Component/AvaliadorPetshop';

import Sair from '../../Assets/box-arrow-right.svg';
import Conta from '../../Assets/person-lines-fill.svg';

function AuthorizeNotificacao() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position);
            Axios.post("https://env-9048989.jelastic.saveincloud.net/api/motoboy/PostLocalizacao", {
                Latitude: position.coords.latitude,
                Longitude: position.coords.longitude,
                idMotoboy: parseJwt().jti,
            })
        }, function (error) {
            console.log(error);
        })
    } else {
        console.log("Error Geolocation");
    }
}

class HomeEntregador extends Component {

    constructor() {
        super();
        this.state = {
            motoboy: {},
            faturamento: {},
            media: null,
        }
    }

    BuscarEntregador = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/motoboy/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => this.setState({ motoboy: data[0] }))
    }

    FaturamentoDoEntregador = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/dashboard/FaturamentoMotoboy?idMotoboy=' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ faturamento: data });
                var stateMedia = ((
                    this.state.faturamento.a6DiasAtras +
                    this.state.faturamento.a5DiasAtras +
                    this.state.faturamento.a4DiasAtras +
                    this.state.faturamento.a3DiasAtras +
                    this.state.faturamento.a2DiasAtras +
                    this.state.faturamento.a1DiasAtras +
                    this.state.faturamento.hoje
                ) / 7).toFixed(2);
                this.setState({ media: stateMedia });

            })
    }

    componentDidMount() {
        if (localStorage.getItem("usuario-petfood") && parseJwt().Permissao == "Motoboy") {
            this.BuscarEntregador();
            this.FaturamentoDoEntregador();
            AuthorizeNotificacao();
        } else {
            var json = {
                a6DiasAtras: 0,
                a5DiasAtras: 0,
                a4DiasAtras: 0,
                a3DiasAtras: 0,
                a2DiasAtras: 0,
                a1DiasAtras: 0
            }
            this.setState({ faturamento: json });
            this.setState({ media: 0 });
        }
    }

    render() {
        return (
            <div className="HomeEntregador">
                <nav className='navEntregador' >
                    <div className='divH1Nav'>
                        <h1>Bem-Vindo {this.state.motoboy.nome}</h1>
                    </div>

                    <div className="div_MotoboyHome">
                        <button className="btnNav" onClick={() =>
                            localStorage.removeItem('usuario-petfood') +
                            sessionStorage.removeItem('Sw') +
                            navigator.serviceWorker.getRegistrations().then(function (registrations) { for (let registration of registrations) { registration.unregister(); } }) +
                            this.props.history.push('/LoginEntregador')
                        }>
                            Sair do Delivery
                            <img src={Sair} />
                        </button>
                        <button className="btnNav" onClick={() => { this.props.history.push('/AtualizarMotoboy') }}>
                            Atualizar Conta
                            <img src={Conta} />
                        </button>
                    </div>

                </nav>

                <div className="div_avaliacaoMotoboy">
                    <Avaliador avaliacao={this.state.motoboy.avaliacao} />
                </div>


                <div style={{ display: 'flex', maxWidth: '80vw' }} className='Grafico'>

                    <Chart
                        width={'90vw'}
                        height={'350px'}
                        stroke={'#191933'}
                        chartType="AreaChart"
                        // loader={<div>Loading Chart</div>}
                        data={[
                            ['Dia', 'Lucro'],
                            ['D -6', this.state.faturamento.a6DiasAtras],
                            ['D -5', this.state.faturamento.a5DiasAtras],
                            ['D -4', this.state.faturamento.a4DiasAtras],
                            ['D -3', this.state.faturamento.a3DiasAtras],
                            ['D -2', this.state.faturamento.a2DiasAtras],
                            ['D -1', this.state.faturamento.a1DiasAtras],
                            ['Hoje', this.state.faturamento.hoje],
                        ]}
                        options={{
                            annotations: {
                                boxStyle: {
                                    stroke: '#191933'
                                }
                            },
                            legend: { position: 'top' },
                            title: 'Earnings',
                            vAxis: { minValue: 0 },
                            chartArea: { width: '85%', height: '70%' },
                            // lineWidth: 25
                        }}
                    />
                </div>


                <div className='divLucro'>

                    <div className='suvdivLucro'>
                        <h3>R${this.state.media}</h3>
                        <p> Média de lucro </p>
                    </div>

                    <div>
                        <h3>R$ ---</h3>
                        <p>Carteira</p>
                    </div>

                </div>

                <Footer />

            </div>
        );
    }
}

export default HomeEntregador;