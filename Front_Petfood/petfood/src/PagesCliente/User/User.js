import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { parseJwt } from '../../services/auth';

import './User.css';

import Footer from '../../Component/Cliente/FooterCliente/Footer';

import Usuario from '../../Assets/Icons/MeuPerfil.svg';
import Localizacao from '../../Assets/Icons/Localizacao.svg';
import MeusPedidos from '../../Assets/Icons/MeusPedidos.svg';
import abrirDropDown from '../../Assets/Icons/setaVermelha.svg';
import Carteira from '../../Assets/Icons/Carteira.svg';
import AtualizarPerfil from '../../Assets/Icons/AtualizarPerfil.svg';
import Logout from '../../Assets/power.png';
import fecharDropDown from '../../Assets/chevron-down.svg';

class User extends Component {

    constructor() {
        super();
        this.state = {
            usuario: {},
            endereco: [],
            UltimosPedidos: [],
            eventKey: 'true',
            eventKey1: 'true',
            eventKey2: 'true',
            eventKey4: 'true',
        }
    }

    //#region REQUISICOES PARA API
    BuscarUsuario = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/usuario/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => this.setState({ usuario: data[0] }))
            .catch(error => console.log(error))
    }

    BuscarEnderecos = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/endereco/usuario/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'ip': localStorage.getItem("ip_user")
            },
        })
            .then(response => response.json())
            .then(data => this.setState({ endereco: data }))
            .catch(error => console.log(error))
    }

    ListarUltimosPedidosDoUsuario = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/pedidos/usuario/' + '23', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => this.setState({ UltimosPedidos: data }))
            .catch(error => console.log(error))
    }
    //#endregion

    //#region DROPDOWN
    eventTrue = (event) => {
        if (this.state.eventKey === 'false') {
            this.setState({ eventKey: 'true' })
        } else {
            this.setState({ eventKey: 'false' })
        }
    }

    eventTrue1 = (event) => {
        if (this.state.eventKey1 === 'false') {
            this.setState({ eventKey1: 'true' })
        } else {
            this.setState({ eventKey1: 'false' })
        }
    }
    eventTrue2 = (event) => {
        if (this.state.eventKey2 === 'false') {
            this.setState({ eventKey2: 'true' })
        } else {
            this.setState({ eventKey2: 'false' })
        }
    }
    eventTrue4 = (event) => {
        if (this.state.eventKey4 === 'false') {
            this.setState({ eventKey4: 'true' })
        } else {
            this.setState({ eventKey4: 'false' })
        }
    }
    //#endregion

    componentDidMount() {
        this.BuscarUsuario();
        this.BuscarEnderecos();
        this.ListarUltimosPedidosDoUsuario();
    }

    render() {
        return (
            <div className="User" >

                <div className='User_InfoUser'>
                    <img src={Usuario} className="fotoUser" ></img>
                    <div className='User_DadosUsusario'>
                        <p className="User_TextNomeDoUsuario">{this.state.usuario.nome}</p>
                        <p className="User_TextEmail_Telefone">{this.state.usuario.email}</p>
                        <p className="User_TextEmail_Telefone">{this.state.usuario.telefone}</p>
                    </div>
                </div>


                <div class='divMinhaConta'>

                    {/* Meus Enderecos */}
                    <div className='Div_CardMinhaConta'>
                        <figure className='Figure_IconMinhaConta'>
                            <img src={Localizacao} className="Icon_FigureMinhaConta" />
                        </figure>
                        <div className="DivText_TituloMinhaConta">
                            <p className="Text_TituloMinhaConta">Meus endereços</p>
                        </div>
                        <figure className='Figure_IconMinhaConta'>
                            <img src={abrirDropDown} onClick={() => this.eventTrue()} className="Icon_FigureMinhaConta" />
                        </figure>

                    </div>

                    {this.state.eventKey == 'false' ? (
                        <div>
                            {this.state.endereco.map(x => {
                                return (
                                    <div className="div_EnderecosListadosPerfilUsuario">
                                        <Link to='/AtualizarEndereco'
                                            className='SubDiv_MinhaConta'
                                            style={{ color: 'black', textDecoration: 'none' }}
                                            onClick={() =>
                                                sessionStorage.setItem("IdEndereco", x.idendereco)
                                            }
                                        >
                                            <p>{x.enderecoRua} - {x.numero}</p>
                                            <p>{x.cidade} - {x.estado}</p>
                                        </Link>
                                    </div>
                                );
                            })}
                            <div className="divLinkEnderecoUsuario">

                                <Link to='/NovoEndereco'
                                    style={{ color: 'black', textDecoration: 'none', textAlign:'center' }}
                                >
                                    <p>Novo Endereço</p>
                                </Link>

                            </div>
                        </div>
                    ) : (
                        <div></div>
                    )}


                    {/* Meus Pedidos */}
                    <div className='Div_CardMinhaConta'>
                        <figure className='Figure_IconMinhaConta'>
                            <img src={MeusPedidos} className="Icon_FigureMinhaConta" />
                        </figure>
                        <div className="DivText_TituloMinhaConta">
                            <p className="Text_TituloMinhaConta">Meus pedidos</p>
                        </div>
                        <figure className='Figure_IconMinhaConta'>
                            <img src={abrirDropDown} onClick={() => this.eventTrue1()} className="Icon_FigureMinhaConta" />
                        </figure>

                    </div>

                    {this.state.eventKey1 == 'false' ? (
                        <div>
                            {
                                this.state.UltimosPedidos.map(x => {
                                    return (
                                        <div className="div_EnderecosListadosPerfilUsuario">
                                            <Link
                                                to="/MeusPedidos"
                                                onClick={() => { sessionStorage.setItem("idPedido", x.id) }}
                                                style={{ color: 'black', textDecoration: 'none' }}
                                            >
                                                <div className='SubDiv_MinhaConta'>
                                                    <p>R${x.preco}</p>
                                                    <p>{x.dataPedido}</p>
                                                </div>
                                            </Link>
                                        </div>
                                    )
                                })
                            }
                            <div className="divLinkEnderecoUsuario">

                                <Link to='/MeusPedidos'
                                    style={{ color: 'white', textDecoration: 'none' }}
                                >
                                    <p>Detalhes</p>
                                </Link>

                            </div>
                        </div>
                    ) : (
                        <div></div>
                    )}

                    {/* Minha Carteira */}
                    <div className='Div_CardMinhaConta' onClick={() => { this.props.history.push('/Carteira') }}>
                        <figure className='Figure_IconMinhaConta'>
                            <img src={Carteira} className="Icon_FigureMinhaConta" />
                        </figure>
                        <div className="DivText_TituloMinhaConta">
                            <p className="Text_TituloMinhaConta">Minha Carteira</p>
                        </div>
                        <figure className='Figure_IconMinhaConta'>
                            {/* <img src={abrirDropDown} className="Icon_FigureMinhaConta" /> */}
                        </figure>

                    </div>

                    {/* Minha Carteira */}
                    <div className='Div_CardMinhaConta' onClick={() => { this.props.history.push('/AtualizarPerfil') }}>
                        <figure className='Figure_IconMinhaConta'>
                            <img src={AtualizarPerfil} className="Icon_FigureMinhaConta" />
                        </figure>
                        <div className="DivText_TituloMinhaConta">
                            <p className="Text_TituloMinhaConta">Atualizar Perfil</p>
                        </div>
                        <figure className='Figure_IconMinhaConta'>
                            {/* <img src={abrirDropDown} className="Icon_FigureMinhaConta" /> */}
                        </figure>
                    </div>

                    {/* Logout */}
                    <div className='Div_CardMinhaConta' onClick={() => { localStorage.removeItem('usuario-petfood'); this.props.history.push('/') }}>
                        <figure className='Figure_IconMinhaConta'>
                            <img src={Logout} className="Icon_FigureMinhaConta imgLogout" />
                        </figure>
                        <div className="DivText_TituloMinhaConta">
                            <p className="Text_LogoutMinhaConta">Sair</p>
                        </div>
                        <figure className='Figure_IconMinhaConta'>
                            {/* <img src={AtualizarPerfil} className="Icon_FigureMinhaConta" /> */}
                        </figure>
                    </div>
                </div>

                <Footer page="Perfil" />
            </div>
        );
    }
}

export default User;