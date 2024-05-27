import React, { Component } from 'react';
import { Link } from "react-router-dom";

import './FooterEntregador.css';

import Pedidos from '../Assets/check-square.svg';
import Alerta from '../Assets/alerta.svg';
import Sacola from '../Assets/bag.svg';
import User from '../Assets/person.svg';

class FooterEntregador extends Component {

    pesquisarProduto() {
        this.props.history.push('/PesquisarProduto');
    }

    render() {
        return (

            <div className='footerEntregador'>
                
                <div className='divIcone'>
                    <Link to='/Entregador' className="LinkImg">
                        <img src={User} ClassName="icon" style={{ width: '1.8em' }} />
                    </Link>
                </div>

                <div className='divIcone'>
                    <Link to='/NovosPedidos' className="LinkImg">
                        <img src={Alerta} ClassName="icon" style={{ width: '1.5em' }} />
                    </Link>
                </div>

                <div className='divIcone' >
                    <Link to='EntregaAceita' className="LinkImg">
                        <img src={Sacola} ClassName="icon" style={{ width: '1.5em' }} />
                    </Link>
                </div>

                <div className='divIcone'>
                    <Link to='/Entregues' className="LinkImg">
                        <img src={Pedidos} ClassName="icon" style={{ width: '1.5em' }} />
                    </Link>
                </div>

            </div>

        )
    }
}

export default FooterEntregador;