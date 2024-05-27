import React, { Component } from 'react';
import Menu from './../../Component/MenuAdm';
import { Link } from "react-router-dom";
//Css + images
import './InfoUsuario.css';

class InfoCliente extends Component {

    constructor(props) {
        super(props);
        this.state = {
            buscar: "",
            usuariosFiltrados: [],
            usuarios: [],
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
                    x.email.toLowerCase().includes(this.state.buscar.toLowerCase()) ||
                    x.nome.toLowerCase().includes(this.state.buscar.toLowerCase()) ||
                    x.telefone.toLowerCase().includes(this.state.buscar.toLowerCase())
            );
        }
        this.setState({ usuariosFiltrados: listaFiltrada });
    }

    listarUsuarios = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/usuario', {
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
        this.listarUsuarios();
    }

    render() {
        return (
            <div className="InfoCliente">
                <nav className='navDash'>
                    <Link
                        to="/Dash"
                        style={{ textDecoration: 'none', color: 'white' }}
                    >
                        <h1>Clientes</h1>
                    </Link>
                </nav>

                <Menu />

                <main className="main_InfoUsuarios">
                    
                    <div    className="div_inputBuscaUsuario">
                        <input className="input_filtro"
                            placeholder="Buscar Cliente"
                            type="text"
                            onChange={this.atualizaEstado.bind(this)}
                        />
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Telefone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.usuariosFiltrados.map(x => {
                                return (
                                    <tr>
                                        <td>{x.nome}</td>
                                        <td>{x.email}</td>
                                        <td>{x.telefone}</td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </table>


                </main>
            </div>
        );
    }
}

export default InfoCliente;