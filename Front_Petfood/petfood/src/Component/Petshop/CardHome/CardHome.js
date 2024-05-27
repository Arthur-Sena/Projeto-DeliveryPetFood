import React, { Component } from 'react';
import './CardHome.css';

function CardHome(props) {
    return (
        <section className='Component_CardHomePetshop'>
            <figure>
                <img src={props.icon} />
            </figure>
            <div className='Aside_CardHomePetshop'>
                <p className="Titulo_CardHomePetshop">{props.TituloCard}</p>
                <p className="Valor_CardHomePetshop">{props.Valor}</p>
            </div>
        </section>
    )
}

export default CardHome;