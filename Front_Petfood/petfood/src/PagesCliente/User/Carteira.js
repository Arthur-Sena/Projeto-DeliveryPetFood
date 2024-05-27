import React, { Component } from 'react';
import { parseJwt } from '../../services/auth';

//Css + images
import './Carteira.css';
import Seta from '../../Assets/chevron-left.svg';

class Carteira extends Component {

    constructor() {
        super();
        this.state = {
            usuario:{}
        }
    }

    BuscarUsuario = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/usuario/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                
            },
        })
            .then(response => response.json())
            .then(data => { 
                this.setState({ usuario: data[0] })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.BuscarUsuario();
    }

    render() {
        return (
            <div className="Carteira" >

                <div className="divCarteira">
                    <img src={Seta} ClassName="icon" style={{ width: '1.5em' }} onClick={() => { this.props.history.push('/user') }} />

                    <div className="DivCarteiraH1">
                        <h1>Carteira</h1>
                    </div>
                </div>

                <br></br>
                <br></br>
                <br></br>

                <div className="divDinheiro">
                    <h3>Carteira : R${this.state.usuario.carteiradigital}</h3>
                </div>

                <br></br>
                <br></br>

                <div className="divDeposito">

                    <div className="Deposito">
                        <h4>Depósito</h4>
                    </div>
                    <div style={{ width:'35vw', textAlign:'center' }}>
                        <h4>R$0</h4>
                    </div>

                </div>


                <div className="divDeposito">

                    <div className="Deposito">
                        <h4>Depósito</h4>
                    </div>
                    <div style={{ width:'35vw', textAlign:'center' }}>
                        <h4>R$5,00</h4>
                    </div>

                </div>
                <div className="divDeposito">

                    <div className="Deposito">
                        <h4>Depósito</h4>
                    </div>
                    <div style={{ width:'35vw', textAlign:'center' }}>
                        <h4>R$10,00</h4>
                    </div>

                </div>
                <div className="divDeposito">

                    <div className="Deposito">
                        <h4>Depósito</h4>
                    </div>
                    <div style={{ width:'35vw', textAlign:'center' }}>
                        <h4>R$15,00</h4>
                    </div>

                </div>

            </div>
        );
    }
}

export default Carteira;