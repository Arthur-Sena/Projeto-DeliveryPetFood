import React, { Component } from 'react';
import './HistoricoPedidos.css';
import { parseJwt } from '../../services/auth.js';
import HeaderPetshop from '../../Component/Petshop/NavPetshop/NavPetshopHome';
import CardPedido from '../../Component/Petshop/CardPedido/CardPedido';

class HistoricoPedidos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Petshop: JSON.parse(sessionStorage.getItem("petshop")),
            UltimosPedidos: []
        }
    }

    listarUltimosPedidos = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/pedidos/petshop/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ UltimosPedidos: data });
            })
            .catch(error => console.log(error))

    }

    componentDidMount() {
        this.listarUltimosPedidos();
    }

    render() {
        return (
            <div className='Tela_HomePetshop'>
                <HeaderPetshop Titulo="Histórico de Pedidos" />

                <h1 className='TituloPedidosRecentes' >Pedidos Recentes</h1>

                {this.state.UltimosPedidos.map(x => {
                    let data = x.horaDeEntrega_Retirada.horarioDoPedido.split(" ");
                    return (
                        <CardPedido
                            Chat={false}
                            Produtos={false}
                            listaProdutos={x.listaProdutos}
                            id={x.id}
                            idUsuario={x.idUsuario}
                            Img={this.state.Petshop.imgpetshops[0].img}
                            Data={data[0]}
                            Hora={data[1]}
                            Cliente={x.cliente.nome.split((/[\s,]+/),2)[0] + ' - ' + x.cliente.telefone}
                            Endereco={x.caminhoDaEntrega.to.endereco + ' ' + (x.caminhoDaEntrega.to.complemento != null? x.caminhoDaEntrega.to.complemento : '')}
                            Status={x.status}
                            Preco={x.preco}
                            Nome={this.state.Petshop.nome}
                        />
                    )
                })}

            </div>
        )
    }
}

export default HistoricoPedidos;