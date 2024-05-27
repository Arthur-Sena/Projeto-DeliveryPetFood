import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Axios from 'axios';
import Menu from '../../Component/MenuAdm';
//Css + images
import './Dashboard.css';
import Tel from './../../Assets/telefoneIcon.png';
import Local from './../../Assets/localizacao.png';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart, Legend } from 'recharts';
 
let widthGrafico = window.screen.width;
let widthDefinida;
 
class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            listaPetshop: [],
            petshopFiltrado: [],
            buscar: "",
            petshopSelecionado: null,
            dadosPetshopSelecionado: {},
            faturamento: {},
            data: [],
            aparecerFaturamento: true,
            aparecerFrete: true,
            aparecerLucroPetshop: true,
            aparecerLucroPetfood: true,
            ano: "2021",
        }
    }

    atualizaEstado(event) {
        this.setState({ buscar: event.target.value }, () => {
            this.FiltrarPesthop();
        })
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
        this.setState({ petshopFiltrado: listaFiltrada });
    }

    ListarPetshop = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/petshop', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ listaPetshop: data });
                this.setState({ petshopFiltrado: data });
            })
            .catch(error => console.log(error))

        fetch('https://env-9048989.jelastic.saveincloud.net/api/dashboard/FaturamentoDoPetFood', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ faturamento: data });
            })
            .catch(error => console.log(error))
    }

    DefinirLargura = () => {
        widthDefinida = widthGrafico - 330;
    }

    faturamentoPetFood = () => {
        var url;
        this.state.petshopSelecionado == null ? (
            url = 'https://env-9048989.jelastic.saveincloud.net/api/dashboard/FaturamentoMensalDoPetFood?year=' + this.state.ano
        ) : (
            url = 'https://env-9048989.jelastic.saveincloud.net/api/dashboard/FaturamentoMensalDoPetFood?year=' + this.state.ano + '&idPetshop=' + this.state.petshopSelecionado
        );

        fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(result => {
                this.setState({ data: result });
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.ListarPetshop();
        this.DefinirLargura();
        this.faturamentoPetFood();
    }

    buscarPetshopSelecionado(idpetshop) {
        this.setState({ petshopSelecionado: idpetshop })

        fetch('https://env-9048989.jelastic.saveincloud.net/api/petshop/' + idpetshop, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ dadosPetshopSelecionado: data[0] });
                this.faturamentoPetFood();
            })
            .catch(error => console.log(error))

        fetch('https://env-9048989.jelastic.saveincloud.net/api/dashboard/FaturamentoDoPetshop?idPetshop=' + idpetshop, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ faturamento: data });
            })
            .catch(error => console.log(error))
    }

    setData = (event) => {
        this.setState({ ano: event.target.value }, () => { this.faturamentoPetFood() })
    }


    render() {
        return (
            <div className="DashboardD">
                <nav className='navDash'>
                    <Link
                        to="/Dash"
                        style={{ textDecoration: 'none', color: 'white' }}
                    >
                        <h1>Dashboard</h1>
                    </Link>
                </nav>

                <Menu />

                <main className="main_Dashboard">
                    <section className="section_InformacoesFaturamentoPetshop">

                        <div className="Dashboard_inputBusca">
                            <input
                                className="Dashboard_inputBuscar"
                                placeholder="Buscar Petshop"
                                type="search"
                                value={this.state.buscar}
                                onChange={this.atualizaEstado.bind(this)}
                            ></input>
                        </div>

                        <div className="div_ListaDePetshop">
                            {this.state.petshopFiltrado.map(x => {
                                return (
                                    <aside className="aside_CardPetshopDashboard" onClick={() => this.buscarPetshopSelecionado(x.idpetshop)}>
                                        <h3>{x.nome}</h3>
                                        <div className="div_DisplayFlex">
                                            <img src={Tel} height="14px" />
                                            <p style={{ paddingLeft: '5px' }}>{x.telefone}</p>
                                        </div>

                                        <div className="div_DisplayFlex">
                                            <img src={Local} height="14px" />
                                            <p style={{ paddingLeft: '5px' }}>{x.endereco}</p>
                                        </div>

                                        <div className="barraDivisora">

                                        </div>
                                    </aside>
                                )
                            })
                            }
                        </div>

                    </section>

                    <section className="Section_DetalhamentoDashboard">

                        {this.state.petshopSelecionado == null ? (<h1>Faturamento Total</h1>) : (<h1>{this.state.dadosPetshopSelecionado.nome}</h1>)}

                        <div className="div_CardInfoDashboard">

                            <div className='div_CardFaturamento'>
                                <h1>R$ {this.state.faturamento.precoTotal}</h1>
                                {this.state.petshopSelecionado == null ? (<h5>Faturamento total</h5>) : (<h5>Faturamento Total Do Petshop</h5>)}
                            </div>

                            <div className='div_CardFaturamento'>
                                <h1>R$ {this.state.faturamento.lucroPetshop}</h1>
                                {this.state.petshopSelecionado == null ? (<h5>Lucro Do Petshop</h5>) : (<h5>Lucro Do Petshop</h5>)}
                            </div>

                            <div className='div_CardFaturamento'>
                                <h1>R$ {this.state.faturamento.lucroPetFood}</h1>
                                <h5>Lucro Petfood</h5>
                            </div>

                        </div>

                        <div className="div_ControllerBtn">
                            <select style={{ width: "100px", fontSize: "0.8em" }} onChange={this.setData} >
                                <option disabled selected >Ano</option>

                                <option value={2020} key={2020}>2019</option>
                                <option value={2020} key={2020}>2020</option>
                                <option value={2021} key={2021}>2021</option>
                                <option value={2022} key={2022}>2022</option>
                            </select>

                            <button onClick={() => this.setState({ aparecerFaturamento: !this.state.aparecerFaturamento })}>
                                Faturamento
                            </button>
                            <button onClick={() => this.setState({ aparecerFrete: !this.state.aparecerFrete })}>
                                Frete
                            </button>
                            <button onClick={() => this.setState({ aparecerLucroPetshop: !this.state.aparecerLucroPetshop })}>
                                Lucro Petshop
                            </button>
                            <button onClick={() => this.setState({ aparecerLucroPetfood: !this.state.aparecerLucroPetfood })}>
                                Lucro PetFood
                            </button>
                        </div>
                        
                        <div className="div_GraficoFaturamento">
                            <LineChart width={widthDefinida} height={180} data={this.state.data}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="mes" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                {this.state.aparecerFaturamento == true ? (
                                    <Line type="monotone" dataKey="faturamento" name="Faturamento Total" stroke="#8884d8" fill="#8884d8" />
                                ) : (<div></div>)}
                                {this.state.aparecerFrete == true ? (
                                    <Line type="monotone" dataKey="frete" name="Receita do Frete" stroke="#403F4C" fill="#403F4C" />
                                ) : (<div></div>)}
                                {this.state.aparecerLucroPetshop == true ? (
                                    <Line type="monotone" dataKey="lucroPetshop" name="Lucro Petshop" stroke="#FFCE00" fill="#FFCE00" />
                                ) : (<div></div>)}
                                {this.state.aparecerLucroPetfood == true ? (
                                    <Line type="monotone" dataKey="lucroPetFood" name="Lucro PetFood" stroke="#FF2226" fill="#FF2226" />
                                ) : (<div></div>)}
                            </LineChart >
                        </div>

                    </section>
                </main>

            </div>
        );
    }
}

export default Dashboard;