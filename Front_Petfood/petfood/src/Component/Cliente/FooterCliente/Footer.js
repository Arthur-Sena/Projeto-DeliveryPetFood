import React from 'react';
import './Footer.css';

import Home from './../../../Assets/Icons/Footer/home.svg';
import HomePreenchido from './../../../Assets/Icons/Footer/homeVermelho.svg';
import Pesquisar from './../../../Assets/Icons/Footer/pesquisar.svg';
import PesquisarPreenchido from './../../../Assets/Icons/Footer/pesquisarVermelho.svg';
import Pedidos from './../../../Assets/Icons/Footer/pedidos.svg';
import PedidosPreenchido from './../../../Assets/Icons/Footer/pedidosVermelho.svg';
import Perfil from './../../../Assets/Icons/Footer/perfil.svg';
import PerfilPreenchido from './../../../Assets/Icons/Footer/perfilVermelho.svg';

function Footer(props) {
    return (

        <div className='FooterCliente_Component'>
            <div className='FooterCliente_divIcon' onClick={() => { window.location.href = ('/Home') }} >
                <img src={props.page != "Home" ? (Home) : (HomePreenchido)} className="iconFooter" />
                <p  className={props.page != "Home" ?('Footer_TextIcon'):('Footer_TextIconSelecionado')}>Início</p>
            </div>

            <div className='FooterCliente_divIcon' onClick={() => { window.location.href = ('/PesquisarProduto') }} >
                <img src={props.page != "Pesquisar" ? (Pesquisar) : (PesquisarPreenchido)} className="iconFooter" />
                <p  className={props.page != "Pesquisar" ?('Footer_TextIcon'):('Footer_TextIconSelecionado')}>Pesquisar</p>
            </div>

            <div className='FooterCliente_divIcon' onClick={() => { window.location.href = ('/Sacola') }} >
                <img src={props.page != "Pedidos" ? (Pedidos) : (PedidosPreenchido)} className="iconFooter" />
                <p  className={props.page != "Pedidos" ?('Footer_TextIcon'):('Footer_TextIconSelecionado')}>Pedidos</p>
            </div>

            <div className='FooterCliente_divIcon' onClick={() => { window.location.href = ('/User') }} >
                <img src={props.page != "Perfil" ? (Perfil) : (PerfilPreenchido)} className="iconFooter" />
                <p  className={props.page != "Perfil" ?('Footer_TextIcon'):('Footer_TextIconSelecionado')}>Perfil</p>
            </div>
        </div>

    )
}
export default Footer;