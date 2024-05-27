import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Axios from 'axios';
import Menu from '../../Component/MenuAdm';

class Credencial extends Component {

    constructor() {
        super();
        this.state = {
            codigo: '',
        }
    }

    cadastroCodigo = (event) => { this.setState({ codigo: event.target.value }) }

    AttCredencial = (event) => {
        event.preventDefault();
        Axios.put("https://env-9048989.jelastic.saveincloud.net/api/administrador/credencial", {
            Credencial : this.state.codigo
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('usuario-petfood')
            },
        })
            .then(data => {
                this.setState({ sucesso: "Credencial Atualizada Com Sucesso" });
            })
            .catch(erro => {
                this.setState({ sucesso: "Erro ao Atualizar, tente novamente" })
            })
    }
    render() {
        return (
            <div className="Dash">
                <nav className='navDash'>
                    <Link
                        to="/Dash"
                        style={{ textDecoration: 'none', color: 'white' }}
                    >
                        <h1>Atualizar Credencial</h1>
                    </Link>
                </nav>

                <Menu />
                {/* ---------------Form---------------- */}

                <form method="POST" onSubmit={this.AttCredencial} className="FormCadastro_Produto" autocomplete="off">

                    <div className="divInput_Produto">
                        <div className="item_formproduto1">
                            <label>Credencial:</label>
                            <input
                                required
                                maxLength="90"
                                className="input__CadastroProduto"
                                type="text"
                                name="name"
                                onChange={this.cadastroCodigo}
                                value={this.state.codigo}
                            />
                        </div>
                    </div>
                    <br></br>

                    <button type="submit" className="btn_Cadastro">
                        Atualizar
                    </button >

                    <br></br>
                    {this.state.sucesso != "" ? (
                        <div>
                            {this.state.sucesso === "Credencial Atualizada Com Sucesso" ? (
                                <h5 style={{ color: 'green' }}>{this.state.sucesso}</h5>
                            ) : (
                                <h5 style={{ color: 'red' }}>{this.state.sucesso} </h5>
                            )
                            }
                        </div>
                    ) : (
                        <div></div>
                    )}

                </form>
            </div>
        );
    }
}

export default Credencial;