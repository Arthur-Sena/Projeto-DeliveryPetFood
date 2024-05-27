import React, { Component } from 'react';
import Menu from './../../Component/MenuAdm';
import { Link } from "react-router-dom";
import Avaliador from './../../Component/Avaliador';
//Css + images
import './InfoUsuario.css';
import Tel from './../../Assets/telefoneIcon.png';
import Marker from './../../Assets/marker.png';
import Hora from './../../Assets/relogio.png';

import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div >
        <img style={{marginLeft:"5px"}} src={Marker} height="40px"/>
        <p  style={{color:"black", fontSize:'11px'}}><strong>{text}</strong></p>
</div>;

class InfoEntregador extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buscar: "",
            usuariosFiltrados: [],
            usuarios: [],
            center: {
                lat: -23.524207,
                lng: -46.9024017
            },
        }
    }

    atualizaEstado(event) {
        this.setState({ buscar: event.target.value }, () => {
            this.FiltrarUsuario();
        });
    }

    FiltrarUsuario() {
        let listaFiltrada = this.state.usuarios;
        if (this.state.buscar != "") {
            listaFiltrada = listaFiltrada.filter(
                x =>
                    x.motoboy.nome.toLowerCase().includes(this.state.buscar.toLowerCase()) ||
                    x.motoboy.email.toLowerCase().includes(this.state.buscar.toLowerCase()) ||
                    x.motoboy.telefone.toLowerCase().includes(this.state.buscar.toLowerCase())
            );
        }
        this.setState({ usuariosFiltrados: listaFiltrada });
    }

    listarUsuarios = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/motoboy/localizacao', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ usuarios: data })
                this.setState({ usuariosFiltrados: data })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        console.log(this.state.center);
        this.listarUsuarios();
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
                            {this.state.usuariosFiltrados.map(x => {
                                return (
                                    <aside className="aside_CardPetshopDashboard" onClick={() => x.ultimaLocalizacao != null ?(this.setState({ center: {lat: parseFloat(x.ultimaLocalizacao.latitude), lng: parseFloat(x.ultimaLocalizacao.longitude)} }, () =>console.log(this.state.center) ) ):(null) }>
                                        <h3>{x.motoboy.nome}</h3>
                                        <div className="div_DisplayFlex">
                                            <img src={Tel} height="14px" />
                                            <p style={{ paddingLeft: '5px' }}>{x.motoboy.telefone}</p>
                                        </div>

                                        <div className="div_DisplayFlex">
                                            <img src={Hora} height="14px" />
                                            <p style={{ paddingLeft: '5px' }}>{x.ultimaVezVisto}</p>
                                        </div>

                                        <div className="div_DisplayFlex">
                                            <p style={{ padding: '0px 5px', color: 'black' }}>{x.motoboy.avaliacao}</p>
                                            <Avaliador avaliacao={x.motoboy.avaliacao} style={{ height: '1.75vh' }} />

                                        </div>

                                        <div className="barraDivisora">

                                        </div>
                                    </aside>
                                )
                            })
                            }
                        </div>

                    </section>

                    <section>
                        <div style={{ minHeight: '300px', minWidth: '300px', width: '78vw' }} className="div_mapa">
                            <GoogleMapReact
                                bootstrapURLKeys={{ key: "AIzaSyAYbmt_9tZAxJYQ-kBoLb3-nLaUpVY-IuQ"}}
                                defaultCenter={this.state.center}
                                defaultZoom={10}
                                yesIWantToUseGoogleMapApiInternals
                            >
                                {this.state.usuariosFiltrados.map(x => {
                                    if (x.ultimaLocalizacao != null) {

                                        return (
                                            <AnyReactComponent
                                                lat={x.ultimaLocalizacao.latitude}
                                                lng={x.ultimaLocalizacao.longitude}
                                                text={x.motoboy.nome}
                                            />
                                        );
                                    }
                                })}
                            </GoogleMapReact>
                        </div>
                    </section>


                </main>

            </div>
        );
    }
}

export default InfoEntregador;