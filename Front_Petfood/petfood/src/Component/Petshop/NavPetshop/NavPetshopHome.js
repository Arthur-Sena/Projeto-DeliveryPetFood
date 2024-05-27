import React, { Component } from 'react';
import Axios from 'axios';
import { parseJwt } from './../../../services/auth';

import './NavPetshop.css';
import LogoPetFood from './../../../Assets/LogosPetfood/PetfoodNome.png';
import Menu from './../../../Assets/Icons/MenuPetshop.svg';

import Home from './../../../Assets/Icons/Footer/homeVermelho.svg';
import Pedidos from './../../../Assets/Icons/Produtos.svg';
import Atualizar from './../../../Assets/Icons/Atualizar.svg';
import Produtos from './../../../Assets/Icons/Pedidos.svg';
import Logout from './../../../Assets/Icons/logoutpetshop.svg';
import Pedido from './../../../Assets/Icons/Produtos.svg';

class NavPetshopHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mostrarMenu: false
        }
    }

    abrirOuFecharLoja = () => {
        Axios.put("https://env-9048989.jelastic.saveincloud.net/api/petshop/Status", {
            idpetshop: parseJwt().jti,
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('usuario-petfood')
            }
        }).then(response => {
            if (response.status === 200) {
                window.location.reload();
            }
        })
    }

    abrirFecharMenu = () => {
        this.setState({ mostrarMenu: !this.state.mostrarMenu });
    }

    render() {
        return (
            <body>
                <div className='Component_NavPetshopHome'>
                    <button
                        className='BtnMenu_NavPetshopHome'
                        onClick={() => this.abrirFecharMenu()}
                    ><img src={Menu} /></button>
                    {this.props.Titulo == null ? (
                        <img src={LogoPetFood} className='Img_NavPetshopHome' />
                    ) : (
                        <p className='Titulo_NavPetshop' onClick={() => window.location.href = ('/HomePetshop')}>{this.props.Titulo}</p>
                    )}
                    {this.props.status != null ? (
                        this.props.status == true ? (
                            <button
                                className="btn_StatusLoja_NavPetshopHome"
                                onClick={this.abrirOuFecharLoja}
                                style={{ backgroundColor: '#98CE00' }}
                            >
                                Aberto
                            </button>
                        ) : (
                            <button
                                className="btn_StatusLoja_NavPetshopHome"
                                onClick={this.abrirOuFecharLoja}
                                style={{ backgroundColor: '#DD1C1A' }}
                            >
                                Fechado
                            </button>
                        )
                    ) : (
                        this.props.CadastrarProduto ? (
                            <button
                                className="Btn_CadastrarProdutoEstoque"
                                onClick={() => window.location.href = ('/CadastrarProdutoPetshop')}
                            >
                                Cadastrar Produto
                            </button>
                        ) : (<div style={{ width: '70px' }}></div>)
                    )}
                </div>

                {
                    this.state.mostrarMenu == true ? (
                        <section className='Menu_NavPetshopHome'>
                            <div className='SubMenu_NavPetshopHome' onClick={() => window.location.href = ('/HomePetshop')}>
                                <figure>
                                    <img src={Home} className='MenuIcon_NavPetshopHome' />
                                </figure>
                                <p className='MenuText_NavPetshopHome'>Home</p>
                            </div>
                            <div className='SubMenu_NavPetshopHome' onClick={() => window.location.href = ('/Estoque')}>
                                <figure>
                                    <img src={Pedidos} className='MenuIcon_NavPetshopHome' />
                                </figure>
                                <p className='MenuText_NavPetshopHome'>Estoque</p>
                            </div>

                            <div className='SubMenu_NavPetshopHome' onClick={() => window.location.href = ('/HistoricoDePedidos')}>
                                <figure>
                                    <img src={Produtos} className='MenuIcon_NavPetshopHome' />
                                </figure>
                                <p className='MenuText_NavPetshopHome'>Pedidos</p>
                            </div>

                            <div className='SubMenu_NavPetshopHome' onClick={() => window.location.href = ('/AtualizarPetshop')}>
                                <figure>
                                    <img src={Atualizar} className='MenuIcon_NavPetshopHome' />
                                </figure>
                                <p className='MenuText_NavPetshopHome'>Atualizar Loja</p>
                            </div>
                            <div className='SubMenu_NavPetshopHome' onClick={() => window.location.href = ('/GerarPedidoPetshop')}>
                                <figure>
                                    <img src={Pedido} className='MenuIcon_NavPetshopHome' />
                                </figure>
                                <p className='MenuText_NavPetshopHome'>Gerar um Pedido</p>
                            </div>

                            <div className='SubMenu_NavPetshopHome' onClick={() => localStorage.removeItem('usuario-petfood') + (window.location.href = ('/LoginPetshop'))}>
                                <figure>
                                    <img src={Logout} className='MenuIcon_NavPetshopHome' />
                                </figure>
                                <p className='MenuText_NavPetshopHome'>Logout</p>
                            </div>

                        </section>
                    ) : (
                        <div></div>
                    )
                }
            </body >
        )
    }
}

export default NavPetshopHome