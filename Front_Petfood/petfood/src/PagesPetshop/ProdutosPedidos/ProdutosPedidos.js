import React, { Component } from 'react';
import './ProdutosPedidos.css';
import { parseJwt } from '../../services/auth.js';
import HeaderPetshop from '../../Component/Petshop/NavPetshop/NavPetshopHome';
import CardPedido from '../../Component/Petshop/CardPedido/CardPedido';

class ProdutosPedidos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Petshop: JSON.parse(sessionStorage.getItem("petshop")),
            Pedido: [],
            data: []
        }
    }
    
    buscarPedidos = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/pedidos/' + localStorage.getItem("idPedido"), {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ Pedido: data[0] });
                this.setState({ data : data[0].horaDeEntrega_Retirada.horarioDoPedido.split(" ")});

            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.buscarPedidos();
    }

    render() {
        return (
            <div className='Tela_HomePetshop'>
                <HeaderPetshop  Titulo="Pedido" />

                <h1 className='TituloPedidosRecentes' >Pedidos Recentes</h1>

                <CardPedido 
                    Chat={false} 
                    Produtos={true} 
                    listaProdutos={this.state.Pedido.listaProdutos} 
                    id={this.state.Pedido.id} 
                    Img={this.state.Petshop.imgpetshops[0].img} 
                    Data={this.state.data[0]} 
                    Hora={this.state.data[1]} 
                    Status={this.state.Pedido.status} 
                    Preco={this.state.Pedido.preco} 
                    Nome={this.state.Petshop.nome} 
                />

            </div>
        )
    }
}

export default ProdutosPedidos;