import React, { Component } from 'react';
import './SlideProdutos.css';
import loading from './../../../Assets/Icons/loading.gif';

function SlideProdutos(props) {
    return (
        <body className="Component_SlideProduto">
            {
                props.produtos.map(x => {
                    return (
                        <section
                            className="Component_CardProdutoSlide"
                            onClick={() => {
                                sessionStorage.setItem("IdPetshop", x.idpetshop)
                                window.location.href = ('/EstoqueDaLoja/' + x.idpetshop)
                            }}
                        >
                            <div className="Component_ImagemDoCard" >
                                <img src={x.imgprodutos[0].img} className="Component_CardImg" onLoad={loading} onError={loading} />
                            </div>
                            <div className="Component_CardDescricao">
                                <p className="Component_NomeProduto">{x.titulo.substr(0, 30)}</p>
                                <p className="Component_PrecoProduto"> {x.preco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })} <br /> {x.idpetshopNavigation.nome.substr(0, 40)} </p>
                            </div>
                        </section>
                    )
                })
            }
        </body>
    )
}

export default SlideProdutos;