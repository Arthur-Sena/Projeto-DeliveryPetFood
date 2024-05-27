import React, { Component } from 'react';
import Axios from 'axios';
import { parseJwt } from '../../services/auth';

import './NovosPedidos.css';
import Atualizar from '../../Assets/arrow-repeat.svg';
import Footer from './../../Component/FooterEntregador';

// ----------------------------------------------------------------
var geolocator = require("geolocator");
let localizacao = "desconhecida";

class NovosPedidos extends Component {

    constructor() {
        super();
        this.state = {
            DevoBuscarEntregas: false,
            chamadasDeEntregas: [],
            return: "",
            carregarTela: false,
        }
    }

    controlador = () => {
        var carregandoLocalizacao = setInterval(() => {
            if (localizacao != "desconhecida") {
                this.buscarPedidosProximos();
                this.setState({ carregarTela: true });
                clearInterval(carregandoLocalizacao);
            } else {
                console.log("loading");
            }
        }, 1000)
    }

    BuscarLocalizacaoDoUsuario = () => {
        var options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
        var watcher = geolocator.watch(options, function (err, location) {
            if (location == null || location == "") {
                geolocator.locateByIP(options, function (err, location) {
                    sessionStorage.setItem("latlng", [location.coords.latitude, location.coords.longitude]);
                    localizacao = "encontrada";
                });
            } else {
                sessionStorage.setItem("latlng", [location.coords.latitude, location.coords.longitude]);
                localizacao = "encontrada";
            }
        });
        watcher.clear(300000);
    }

    buscarPedidosProximos = () => {
        if (sessionStorage.getItem("latlng") != null) {

            let latlng = sessionStorage.getItem("latlng").split(",");
            let lat = latlng[0];
            let lng = latlng[1];
            fetch('https://env-9048989.jelastic.saveincloud.net/api/pedidos/ParaSeremEntregues,lat:' + lat + ',lng:' + lng + "?id=" + parseJwt().jti, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    // if (data.mensagem == "Você já tem uma entrega em andamento") {
                        this.setState({ return: data.mensagem });
                        this.setState({ chamadasDeEntregas: data.pedidos });
                        this.setState({ carregarTela: true });
                    // } else {
                    //     this.setState({ chamadasDeEntregas: data.pedidos });
                    //     this.setState({ carregarTela: true });
                    // }
                })
                .catch(error => console.log(error))
                
        } else {
            this.setState({ return: "Confira se a localização do dispositivo esta ativada" });
        }
    }

    CalcularDistanciaEntrePedidoEMotoboy = (latitude, longitude) => {
        let latlng = sessionStorage.getItem("latlng").split(",");
        let lat = latlng[0];
        let lng = latlng[1];

        var result = geolocator.calcDistance({
            from: {
                latitude: lat,
                longitude: lng
            },
            to: {
                latitude: latitude,
                longitude: longitude
            },
            formula: geolocator.DistanceFormula.HAVERSINE,
            unitSystem: geolocator.UnitSystem.METRIC
        });

        return result.toFixed(1);
    }

    AceitarPedido = (id) => {
        let motoboyId = parseJwt().jti;
        Axios.put("https://env-9048989.jelastic.saveincloud.net/api/pedidos/AceitoPeloMotoboy", {
            id: id,
            IdMotoboy: motoboyId,
        }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
            .then(response => {
                if (response.status === 200) {
                    this.props.history.push('/EntregaAceita');
                }
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        if (localStorage.getItem("usuario-petfood") && parseJwt().Permissao == "Motoboy") {
            this.BuscarLocalizacaoDoUsuario();
            this.controlador();
        } else {
            this.setState({ return: "Apenas usuário logado pode aceitar um pedido" });
        }
    }

    render() {
        return (

            <div className='NovosPedidos'>

                <nav className='navEntregador'>

                    <div className='divH1Nav'>
                        <h1>Novos Pedidos </h1>
                    </div>

                    {localStorage.getItem("usuario-petfood") && parseJwt().Permissao == "Motoboy" ? (
                        <button className="btnNav_NovosPedidos"
                            onClick={() => { this.buscarPedidosProximos() }}
                        >
                            Atualizar
                            <img src={Atualizar} style={{ height: '1.4em' }} />
                        </button>
                    ) : (
                        <button className="btnNav_NovosPedidos"
                            onClick={() =>  this.props.history.push('/LoginEntregador')}
                        >
                            Login
                            <img src={Atualizar} style={{ height: '1.4em' }} />
                        </button>
                    )
                    }
                </nav>

                <div className="DivPai_ReturnChamadasDeEntregas">
                    <div className='divListaNovosPedidos'
                        style={{ textAlign: 'center', fontWeight: 'bold' }}
                    >
                        <p>{this.state.return}</p>
                    </div>
                    {this.state.chamadasDeEntregas.map(x => {
                        return (
                            <div className="divPaiListaNovosPedidos">
                                <div className='divListaNovosPedidos'>
                                    <p><strong>Cliente: </strong>{x.cliente.nome}</p>
                                    <p><strong>Telefone: </strong>{x.cliente.telefone}</p>
                                    <p><strong>Petshop:</strong> {x.caminhoDaEntrega.from.petshop}</p>
                                    <p><strong>De:</strong> {x.caminhoDaEntrega.from.endereco}</p>
                                    {x.caminhoDaEntrega.to.complemento != null ? (
                                        <p><strong>Para: </strong>{x.caminhoDaEntrega.to.endereco} - {x.caminhoDaEntrega.to.complemento}</p>
                                    ) : (
                                        <p><strong>Para: </strong>{x.caminhoDaEntrega.to.endereco}</p>
                                    )}
                                    <p><strong>Distancia: </strong>{this.CalcularDistanciaEntrePedidoEMotoboy(x.caminhoDaEntrega.from.latitude, x.caminhoDaEntrega.from.longitude)}Km</p>
                                    <p><strong>Preço:</strong> R${x.preco}</p>
                                    {x.pagamento.tipo != "Cartão na Hora da Entrega" ? (
                                        <p><strong>Pagamento:</strong> {x.pagamento.tipo} - (Já esta pago)</p>
                                    ) : (
                                        <p><strong>Pagamento:</strong> Pagar na entrega - cartão</p>
                                    )}
                                    {x.pagamento.tipo == "Cartão na Hora da Entrega" ? (
                                        <p>PS* Pagamento será efetuado no CARTÃO durante a entrega</p>
                                    ) : (<div></div>)}
                                </div>
                                <div className="DivbtnAceitaEntrega">
                                    <button className="btnAceitarEngrega"
                                        onClick={() => { this.AceitarPedido(x.id) }}
                                    >Aceitar Entrega</button>
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

export default NovosPedidos;