import React, { Component } from 'react';
import './TituloLogin.css';
import SetaLogin from './../../Assets/Detalhes/Login/SetaLogin.svg';

function TituloLogin(props) {
    return (
        <div className='Component_TituloLoginCadastro'>
            <img src={SetaLogin} onClick={() => window.location.href = ('/' + props.href) }/>
            <p  className='Component_textLoginCadastro'>{props.titulo}</p>
        </div>
    )
}

export default TituloLogin;