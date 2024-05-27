import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { parseJwt } from './../services/auth';

import ADM from '../Assets/person.svg';
import x from '../Assets/x.svg';
import menu from '../Assets/list.svg';
import shop from '../Assets/shop.svg';
import produtos from '../Assets/collection.svg';
import cliente from '../Assets/person-lines-fill.svg';
import usuarios from '../Assets/person.svg';
import lojista from '../Assets/people.svg';
import entregador from '../Assets/truck.svg';
import seta from '../Assets/chevron-down.svg';
import Sacola from '../Assets/bag.svg';
import Configuracao from '../Assets/gear.svg';
import NewPetshop from '../Assets/plus-square.svg';
import ListPetshop from '../Assets/list-ol.svg';
import logout from '../Assets/box-arrow-in-left.svg';
import Dashboard from '../Assets/graph-up.svg';
import Propaganda from '../Assets/tags.svg';
import AprovarEntregador from '../Assets/aprovarEntregador.png';
// import Dashboard from '../Assets/grafico-renko.png';

import './MenuAdm.css';



class Menu extends Component {

    constructor() {
        super();
        this.state = {
            eventKey: 'false',
            eventKey1: 'false',
            eventKey2: 'false',
        }
    }

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

    render() {
        return (

            <div className='divMenu'>
                {this.state.eventKey == 'false' ? (
                    <div className='menuDash'>
                        <img src={menu} style={{ height: '1.5em' }} onClick={() => { this.eventTrue() }} />
                    </div>
                ) : (
                    <div className='menuDash'>
                        <img src={x} style={{ height: '1.5em' }} onClick={() => { this.eventTrue() }} />
                    </div>
                )}

                {this.state.eventKey == 'true' ? (
                    <div className="menuAberto">
                        {parseJwt().Permissao === 'Administrador' || parseJwt().Permissao === 'Diretor'? (

                            //Menu Lojas (SO APARECE PARA ADM)--------------------------------------------------------------------

                            <div className='subMenu'>

                                <div className='imgMenu'>
                                    <img src={shop} style={{ height: '1.4em' }} />
                                </div>

                                {this.state.eventKey2 == 'false' ? (
                                    <div className="div_titleMenu">
                                        <div className='titleMenu1'>
                                            <p>Lojas</p>
                                        </div>
                                        <div className='imgMenu1'>
                                            <img src={seta} onClick={() => { this.eventTrue2() }} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className='div_titleMenu'>
                                        <div className='titleMenu1'>
                                            <p>Lojas</p>
                                        </div>
                                        <div className='imgMenu1'>
                                            <img src={x} onClick={() => { this.eventTrue2() }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            //Menu ESTOQUE (SO APARECE PARA PETSHOP)--------------------------------------------------------------------
                            <div className='subMenu'>
                                <div className='imgMenu'>
                                    <img src={produtos} style={{ height: '1.3em' }} />
                                </div>
                                <div className='titleMenu'>
                                    <Link to="/ProdutosDaLoja"
                                        style={{ textDecoration: 'none', color: 'black' }}
                                        onClick={() =>
                                            localStorage.setItem("IdPetshop", parseJwt().jti)
                                        }
                                    >
                                        <p>Estoque</p>
                                    </Link>
                                </div>
                            </div>)}

                        {this.state.eventKey2 == 'false' ? (<div></div>) : (
                            <div className='divMenuUsuarios'>
                                <div className='subMenuUsuarios'>
                                    <div>
                                        <img src={NewPetshop} style={{ height: '1.4em' }} />
                                    </div>
                                    <div className='textoMenuUsuario'>
                                        <Link to="/CadastrarLoja"
                                            style={{ textDecoration: 'none', color: 'black' }}
                                        >
                                            <p>Cadastrar Petshop</p>
                                        </Link>
                                    </div>
                                </div>

                                <div className='subMenuUsuarios'>
                                    <div>
                                        <img src={ListPetshop} style={{ height: '1.4em' }} />
                                    </div>
                                    <div className='textoMenuUsuario'>
                                        <Link to="/Lojas"
                                            style={{ textDecoration: 'none', color: 'black' }}
                                        >
                                            <p>Listar Lojas</p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* ----------------------------------------------------------------------------- */}

                        {parseJwt().Permissao === 'Administrador' || parseJwt().Permissao === 'Diretor'? (
                            <div>
                                <Link to="/Frete" className='subMenu'>
                                    <div className='imgMenu'>
                                        <img src={Dashboard} style={{ height: '1.4em' }} />
                                    </div>
                                    <div className='titleMenu'>
                                        <p>Frete</p>
                                    </div>

                                </Link>
                                <Link to="/Dashboard" className='subMenu'>
                                    <div className='imgMenu'>
                                        <img src={Dashboard} style={{ height: '1.4em' }} />
                                    </div>
                                    <div className='titleMenu'>
                                        <p>Dashboard</p>
                                    </div>

                                </Link>
                                <Link to="/Propaganda" className='subMenu'>
                                    <div className='imgMenu'>
                                        <img src={Propaganda} style={{ height: '1.4em' }} />
                                    </div>
                                    <div className='titleMenu'>
                                        <p>Propaganda / Promoções</p>
                                    </div>

                                </Link>

                                <div className='subMenu'>

                                    <div className='imgMenu'>
                                        <img src={usuarios} style={{ height: '1.4em' }} />
                                    </div>

                                    {this.state.eventKey1 == 'false' ? (
                                        <div className="div_titleMenu">
                                            <div className='titleMenu1'>
                                                <p>Usuários</p>
                                            </div>
                                            <div className='imgMenu1'>
                                                <img src={seta} onClick={() => { this.eventTrue1() }} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='div_titleMenu'>

                                            <div className='titleMenu1'>
                                                <p>Usuários</p>
                                            </div>
                                            <div className='imgMenu1'>
                                                <img src={x} onClick={() => { this.eventTrue1() }} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div>
                            </div>
                        )}
                        {this.state.eventKey1 == 'false' ? (<div></div>) : (
                            <div className='divMenuUsuarios'>
                                <Link to="/CadastrarAdm"
                                    style={{ textDecoration: 'none', color: 'black' }}
                                    className='subMenuUsuarios'
                                >
                                    <div>
                                        <img src={ADM} style={{ height: '1.4em' }} />
                                    </div>
                                    <div className='textoMenuUsuario'>
                                        <p>Cadastrar Novo ADM</p>
                                    </div>
                                </Link>

                                <Link to="/InfoCliente"
                                    style={{ textDecoration: 'none', color: 'black' }}
                                    className='subMenuUsuarios'
                                >
                                    <div>
                                        <img src={cliente} style={{ height: '1.4em' }} />
                                    </div>
                                    <div className='textoMenuUsuario'>
                                        <p>Clientes</p>
                                    </div>
                                </Link>

                                <Link to="Lojas"
                                    style={{ textDecoration: 'none', color: 'black' }}
                                    className='subMenuUsuarios'
                                >
                                    <div>
                                        <img src={lojista} style={{ height: '1.4em' }} />
                                    </div>
                                    <div className='textoMenuUsuario'>
                                        <p>Lojas</p>
                                    </div>
                                </Link>

                                <Link to="/InfoEntregador"
                                    style={{ textDecoration: 'none', color: 'black' }}
                                    className='subMenuUsuarios'
                                >
                                    <div>
                                        <img src={entregador} style={{ height: '1.4em' }} />
                                    </div>
                                    <div className='textoMenuUsuario'>
                                        <p>Entregadores</p>
                                    </div>
                                </Link>
                                <Link to="/AprovarEntregador"
                                    style={{ textDecoration: 'none', color: 'black' }}
                                    className='subMenuUsuarios'
                                >
                                    <div>
                                        <img src={AprovarEntregador} style={{ height: '1.4em' }} />
                                    </div>
                                    <div className='textoMenuUsuario'>
                                        <p>Aprovar Entregadores</p>
                                    </div>
                                </Link>
                            </div>
                        )}

                        <Link className='subMenu' to="/PedidosDaLoja">
                            <div className='imgMenu'>
                                <img src={Sacola} style={{ height: '1.3em' }} />
                            </div>
                            <div className='titleMenu'>
                                <p>Pedidos</p>
                            </div>
                        </Link>

                        {parseJwt().Permissao === 'Diretor' ? (
                            <Link className='subMenu' to="/Credencial">
                            <div className='imgMenu'>
                                <img src={Configuracao} style={{ height: '1.3em' }} />
                            </div>
                            <div className='titleMenu'>
                                <p>Atualizar Credencial GetNet</p>
                            </div>
                        </Link>
                        ) : (<div></div>)}


                        {parseJwt().Permissao === 'Petshop' ? (
                            <Link className='subMenu' to="/AtualizarLoja">
                                <div className='imgMenu'>
                                    <img src={Configuracao} style={{ height: '1.3em' }} />
                                </div>
                                <div className='titleMenu'>
                                    <p>Atualizar Loja</p>
                                </div>
                            </Link>
                        ) : (<div></div>)}
                        <div className='subMenu'>
                            <div className='imgMenu'>
                                <img src={logout} style={{ height: '1.3em' }} />
                            </div>
                            <div className='titleMenu'>
                                <Link to={parseJwt().Permissao === 'Petshop' ? ("/LoginPetshop") : ("/Adm")}
                                    style={{ textDecoration: 'none', color: 'black' }}
                                    onClick={() =>
                                        localStorage.removeItem('usuario-petfood')
                                        +
                                        localStorage.removeItem('IdPetshop')
                                        +
                                        clearInterval(0)
                                        +
                                        clearInterval(1)
                                        +
                                        clearInterval(2)
                                        +
                                        clearInterval(3)
                                        +
                                        clearInterval(4)
                                        +
                                        clearInterval(5)
                                        +
                                        clearInterval(6)
                                        +
                                        clearInterval(7)
                                        +
                                        clearInterval(8)
                                        +
                                        clearInterval(9)
                                        +
                                        clearInterval(10)
                                        +
                                        clearInterval(11)
                                    }
                                >
                                    <p>Logout</p>
                                </Link>
                            </div>
                        </div>

                    </div>
                ) : (
                    <br></br>
                )
                }

            </div>

        )
    }
}

export default Menu;