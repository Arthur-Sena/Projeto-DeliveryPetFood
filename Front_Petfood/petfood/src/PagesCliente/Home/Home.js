import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { parseJwt } from '../../services/auth';
import Titulo from './../../Component/Cliente/TituloDaDiv/TituloDiv';
import SlideProdutos from './../../Component/Cliente/SlideProdutos/SlideProdutos';
import SlidePromocao from './../../Component/Cliente/SlidePromocao/SlidePromocao';
import CardPetshop from './../../Component/Cliente/CardPetshop/CardPetshop';

import './Home.css';
import filtro from '../../Assets/Icons/filter.svg';
import estrela from '../../Assets/estrela.png';

import Footer from '../../Component/Cliente/FooterCliente/Footer';
import Petfood from './../../Assets/LogosPetfood/PetfoodNome.png';
import SetaPretaBaixo from './../../Assets/Icons/SetaPretaBaixo.svg';
import ErroPetshopNull from './../../Assets/Detalhes/Erro/MensagemErroSemPetshop.png';

var geolocator = require("geolocator");
let localizacao = false;

var distanciaSelecionada = "10Km";
var distancia;
var ip;

function salvarIp(retorno) {
    ip = retorno;
    localStorage.setItem("ip_user", ip);
}

class Home extends Component {

    constructor() {
        super();
        this.state = {
            //#region State.NavEndereco
            enderecos: [],
            enderecoSelecionado: {},
            escolherEndereco: false,
            enderecoDeslogado: '',
            //#endregion

            //#region State.SlideProdutos
            localizacaoCliente: JSON.parse(localStorage.getItem("localCliente")),
            produtos: [],
            //#endregion

            listaPetshop: [],
            petshopFiltrado: [],
            buscar: "",
            avaliacaoMin: 0,
            abrirFiltro: false,

            DistanciaFiltrada: null,
        }
    }

    //#region "Component Navigator Endereco"    
    NavEndereco() {
        return (
            <div className='NavEndereco_HomeCliente'>

                <nav className="Component_NavEndereco">
                    <button
                        onClick={() => this.setState({ escolherEndereco: !this.state.escolherEndereco })}
                        className="Component_BtnEscolherEndereco"
                    >{this.state.enderecoSelecionado == null || this.state.enderecoSelecionado.length == 0 ? (
                        <div className="Component_DivEnderecoSelecionado">
                            <Link to="/NovoEndereco" style={{ textDecoration: 'none' }}>
                                <p className='Text_TituloEntrega'>Nenhum endereço encontrado</p>
                                <p className='Text_EnderecoEntrega'>Cadastre um novo</p>
                            </Link>
                        </div>
                    ) : (
                        <div className="Component_DivEnderecoSelecionado">
                            <p className='Text_TituloEntrega'>Entrega para</p>
                            <div className="Div_TextImg_EnderecoEntrega">
                                {localStorage.getItem("usuario-petfood") ? (
                                    <p className='Text_EnderecoEntrega'>
                                        {this.state.enderecoSelecionado.enderecoRua} - {this.state.enderecoSelecionado.numero}
                                    </p>
                                ) : (
                                    <p className='Text_EnderecoEntrega'>
                                        {sessionStorage.getItem("endereco")}
                                    </p>
                                )}
                                <img src={SetaPretaBaixo} />
                            </div>
                        </div>
                    )
                        }
                    </button>

                    <Link to='Home'> <img src={Petfood} className='ComponentImg_LogoPetfood' /> </Link>
                </nav>

                {this.state.escolherEndereco === true ? (
                    <div className="Component_ListaParaEscolherEndereco">
                        {
                            this.state.enderecos.map(x => {
                                return (
                                    <div className="Component_SelecionarEndereco">
                                        <input
                                            className="Component_inputCheckBoxEndereco"
                                            type="radio"
                                            id={x.idendereco}
                                            name="scales"
                                            value={x.idendereco}
                                            onChange={this.enderecoSelecionado}
                                            defaultChecked={sessionStorage.getItem("IdEnderecoEscolhido") == x.idendereco ? (true) : (false)}
                                        />
                                        <label for={x.idendereco} className="Text_TituloEntrega">
                                            {x.enderecoRua}
                                        </label>
                                    </div>
                                )
                            })}
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        )
    }
    //#endregion

    //#region "NavEndereco"
    //#region "NavEndereco Com Login"
    BuscarEnderecos = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/endereco/usuario/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ enderecos: data })
                if (sessionStorage.getItem("IdEnderecoEscolhido") == null) {
                    this.setState({ enderecoSelecionado: data[0] })
                    sessionStorage.setItem("IdEnderecoEscolhido", data[0].idendereco)
                    this.listarImgProdutos(data[0].latitude, data[0].longitude);
                    this.listarPetshop(data[0].latitude, data[0].longitude);
                    localStorage.setItem("EnderecosUsuario", JSON.stringify(data));
                } else {
                    this.buscarEnderecoSelecionado();
                }
            })
            .catch(error => console.log(error))
    }

    buscarEnderecoSelecionado() {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/endereco/' + sessionStorage.getItem("IdEnderecoEscolhido"), {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then((data) => {
                this.setState({ enderecoSelecionado: data[0] });
                localStorage.setItem("localCliente", JSON.stringify(data[0]));
                this.listarImgProdutos(data[0].latitude, data[0].longitude);
                this.listarPetshop(data[0].latitude, data[0].longitude);
            })
            .catch(error => console.log(error))
    }

    enderecoSelecionado = (event) => {
        if (sessionStorage.getItem("IdEnderecoEscolhido") != null) {

            sessionStorage.setItem("IdEnderecoEscolhido", event.target.value)
            this.setState({ escolherEndereco: !this.state.escolherEndereco })
            this.buscarEnderecoSelecionado();
        }
    }
    //#endregion 

    //#region "NavEndereco Sem Login"
    BuscarLocalizacaoDoUsuario = () => {
        var options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
        var watcher = geolocator.watch(options, function (err, location) {
            if (!location) {
                geolocator.locateByIP(options, function (err, location) {
                    sessionStorage.setItem("lat", location.coords.latitude);
                    sessionStorage.setItem("lng", location.coords.longitude);
                    sessionStorage.setItem("endereco", location.address.city);
                    localizacao = true;
                });
            } else {
                sessionStorage.setItem("lat", location.coords.latitude);
                sessionStorage.setItem("lng", location.coords.longitude);
                localizacao = true;
            }
        });
        watcher.clear(5000);
    }

    BuscarEnderecoSemLogin = (lat, lng) => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/localizacao/Reverse?lat=' + lat + "&lng=" + lng, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.status == "OK") {
                    var adress = data.results[0].formatted_address.split("-");
                    sessionStorage.setItem("endereco", adress[0]);
                    this.setState({ enderecoDeslogado: adress[0] });
                }
            })
            .catch(error => console.log(error))

    }

    controladorEnderecos = () => {
        var carregandoLocalizacao = setInterval(() => {
            this.BuscarLocalizacaoDoUsuario();
            if (localizacao == true) {
                this.BuscarEnderecoSemLogin(sessionStorage.getItem("lat"), sessionStorage.getItem("lng"));
                this.listarPetshop(sessionStorage.getItem("lat"), sessionStorage.getItem("lng"));
                this.listarImgProdutos(sessionStorage.getItem("lat"), sessionStorage.getItem("lng"));
                clearInterval(carregandoLocalizacao);
            }
        }, 500)
    }
    //#endregion 
    //#endregion

    //#region "SlideProdutos"
    listarImgProdutos = (lat, lng) => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/produtos/20PetshopsNumRaioDe' + localStorage.getItem("DistanciaFiltrada") + ',lat:' + lat + ',lng:' + lng, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => this.setState({ produtos: data }))
            .catch(error => console.log(error))
    }
    //#endregion

    //#region "Filtros" 
    atualizaEstado(event) {
        this.setState({ buscar: event.target.value }, () => {
            this.FiltrarPesthop();
        })
    }
    atualizaEstadoAvaliacaoMinima(numero) {
        this.setState({ avaliacaoMin: numero }, () => {
            this.FiltrarPesthop();
        })
    }

    distanciaSelecionada = (event) => {
        distancia = event.target.value;
        if (distancia == 1) { localStorage.setItem("DistanciaFiltrada", "3Km"); this.setState({ DistanciaFiltrada: "3Km" }) }
        if (distancia == 2) { localStorage.setItem("DistanciaFiltrada", "7.5Km"); this.setState({ DistanciaFiltrada: "7.5Km" }) }
        if (distancia == 3) { localStorage.setItem("DistanciaFiltrada", "10Km"); this.setState({ DistanciaFiltrada: "10Km" }) }
        if (distancia == 4) { localStorage.setItem("DistanciaFiltrada", "15Km"); this.setState({ DistanciaFiltrada: "15Km" }) }

        let lat = this.state.enderecoSelecionado.latitude == null ? (sessionStorage.getItem("lat")) : (this.state.enderecoSelecionado.latitude);
        let lng = this.state.enderecoSelecionado.longitude == null ? (sessionStorage.getItem("lng")) : (this.state.enderecoSelecionado.longitude);
        this.listarPetshop(lat, lng);
        this.listarImgProdutos(lat, lng);
    }
    FiltrarPesthop() {
        let listaFiltrada = this.state.listaPetshop;
        if (this.state.buscar != "") {

            listaFiltrada = listaFiltrada.filter(
                x =>
                    x.nome.toLowerCase().includes(this.state.buscar.toLowerCase()) ||
                    x.endereco.toLowerCase().includes(this.state.buscar.toLowerCase())
            );
        }
        if (this.state.avaliacaoMin != 0) {
            listaFiltrada = listaFiltrada.filter(
                x => this.state.avaliacaoMin <= x.avaliacao
            );
        }
        this.setState({ petshopFiltrado: listaFiltrada });
    }
    //#endregion =====================================================================================//

    listarPetshop = (lat, lng) => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/petshop/raio=' + localStorage.getItem("DistanciaFiltrada") + ',lat:' + lat + ',lng:' + lng, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ listaPetshop: data.sort(function (x, y) { return (x.status === false) ? 0 : x ? -1 : 1; }) })
                this.setState({ petshopFiltrado: this.state.listaPetshop });
            })
            .catch(error => console.log(error))
    }

    abrirFiltro = () => {
        this.setState({ abrirFiltro: !this.state.abrirFiltro });
    }

    CalcularDistanciaUsuarioPetshop = (latitude, longitude) => {

        var result = geolocator.calcDistance({
            from: {
                latitude: this.state.enderecoSelecionado.latitude == null ? (sessionStorage.getItem("lat")) : (this.state.enderecoSelecionado.latitude),
                longitude: this.state.enderecoSelecionado.longitude == null ? (sessionStorage.getItem("lng")) : (this.state.enderecoSelecionado.longitude)
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

    nomeDoDispositivo = () => {
        if (localStorage.getItem("ip_user") == "" || localStorage.getItem("ip_user") == null) {
            geolocator.getIP(function (err, result) {
                if (result != null) {
                    salvarIp(result.ip);
                }
            });
        }
    }

    componentDidMount() {
        localStorage.setItem("DistanciaFiltrada", "10Km");
        this.setState({ "DistanciaFiltrada": localStorage.getItem("DistanciaFiltrada") });
        //#region DidMount.NavEndereco 
        localizacao = false;
        if (localStorage.getItem("usuario-petfood") && localStorage.getItem("usuario-petfood") != null) {
            this.nomeDoDispositivo();
            this.BuscarEnderecos();
        } else {
            this.controladorEnderecos();
        }
        //#endregion
    }

    render() {
        return (
            <div className="Home" >

                {/* Navigator Endereco do Usuario + Logo Petfood */}
                {this.NavEndereco()}

                {/* Input de buscar Produtos e Petshops */}
                <div className="inputBusca">
                    <input
                        className="inputBuscar"
                        placeholder="Encontre um pet shop"
                        onChange={this.atualizaEstado.bind(this)}
                        type="search"
                    ></input>
                </div>

                <Titulo titulo="Produtos em destaque" />

                <SlideProdutos produtos={this.state.produtos} />

                <SlidePromocao />


                {/* -------------------------------Lista de Petshops Proximo------------------------- */}
                <div className="divPetshop">

                    <div className="Div_FiltroHome">
                        <Titulo titulo="Lojas" />

                        <button className="btn_FiltroDeLojas" onClick={() => this.abrirFiltro()}>
                            <p>Filtro</p>
                            <img src={filtro} />
                        </button>

                    </div>
                    {(this.state.abrirFiltro == false) ? (<div></div>) : (

                        <div className="div_FiltrosDaHome">
                            <div>
                                <p style={{ fontSize: '12px' }}>Distancia: {this.state.DistanciaFiltrada}</p>
                                <input
                                    className="inputRangeFiltro"
                                    type="range"
                                    onChange={this.distanciaSelecionada}
                                    min="1"
                                    max="4"
                                    step="1"
                                    defaultValue="3"
                                    formatLabel="Distancia"
                                />

                                <datalist id="Distancia">
                                    <option value="3Km" label="3Km">3 Km</option>
                                    <option value="7.5Km" label="7.5Km">7.5 Km</option>
                                    <option value="10Km" label="10Km">10 Km</option>
                                    <option value="15Km" label="15Km">15 Km</option>
                                </datalist>
                            </div>

                            <div>
                                <p style={{ fontSize: '12px' }}>Avaliação:</p>
                                <div className="div_FiltrarPorNota">
                                    <button className="div_PorNota"
                                        type="button"
                                        onClick={() => {
                                            this.atualizaEstadoAvaliacaoMinima(1);
                                        }}
                                    >
                                        <p>1</p>
                                        <img src={estrela} height="14px" />
                                    </button>
                                    <button className="div_PorNota"
                                        onClick={() => {
                                            this.atualizaEstadoAvaliacaoMinima(2);
                                        }}                                    >
                                        <p>2</p>
                                        <img src={estrela} height="14px" />
                                    </button>
                                    <button className="div_PorNota"
                                        onClick={() => {
                                            this.atualizaEstadoAvaliacaoMinima(3);
                                        }}                                    >
                                        <p>3</p>
                                        <img src={estrela} height="14px" />
                                    </button>
                                    <button className="div_PorNota"
                                        onClick={() => {
                                            this.atualizaEstadoAvaliacaoMinima(4);
                                        }}                                    >
                                        <p>4</p>
                                        <img src={estrela} height="14px" />
                                    </button>
                                    <button className="div_PorNota"
                                        onClick={() => {
                                            this.atualizaEstadoAvaliacaoMinima(5);
                                        }}                                    >
                                        <p>5</p>
                                        <img src={estrela} height="14px" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {this.state.listaPetshop != null && this.state.listaPetshop.length != 0 ? (
                        <CardPetshop
                            petshop={this.state.petshopFiltrado}
                            latitude={(localStorage.getItem("usuario-petfood") && this.state.localizacaoCliente != null) ? (this.state.localizacaoCliente.latitude) : (sessionStorage.getItem("lat"))}
                            longitude={(localStorage.getItem("usuario-petfood") && this.state.localizacaoCliente != null) ? (this.state.localizacaoCliente.longitude) : (sessionStorage.getItem("lng"))}
                        />
                    ) : (
                        <img  src={ErroPetshopNull}  className="Home_ErroSemPetshop"/>
                    )}

                </div>

                <Footer page="Home" />
            </div>
        );
    }
}

export default Home;