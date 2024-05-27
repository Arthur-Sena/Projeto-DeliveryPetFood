import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Axios from 'axios';

import Menu from '../../Component/MenuAdm';

class CadastrarAdm extends Component {

    constructor() {
        super();
        this.state = {
            nome: null,
            email: null,
            senha: null,
            senha2: null,
            sucesso: null,
        }
    }

    cadastroNome = (event) => { this.setState({ nome: event.target.value }) }
    cadastroEmail = (event) => { this.setState({ email: event.target.value }) }
    cadastroSenha = (event) => { this.setState({ senha: event.target.value }) }
    cadastroSenha2 = (event) => { this.setState({ senha2: event.target.value }) }

    CadastrarAdm = (event) => {
        event.preventDefault();
        if (this.state.senha == this.state.senha2) {
            if (this.state.email.includes("@") & this.state.email.includes(".")) {
                Axios.post("https://env-9048989.jelastic.saveincloud.net/api/administrador", {
                    email: this.state.email.toLowerCase(),
                    senha: this.state.senha,
                    nome: this.state.nome,
                },{
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('usuario-petfood')
                    }
                })
                    .then(data => {
                        if (data.status === 200) {
                            this.setState({ sucesso: "Cadastrado Com sucesso" });
                        } else {
                            this.setState({ sucesso: "Erro ao cadastrar, tente novamente" })
                        }
                    })
                    .catch(erro => {
                        this.setState({ sucesso: "Erro ao cadastrar, tente novamente" })
                    })
            } else {
                this.setState({ sucesso: "E-mail inválido" });
            }
        } else {
            this.setState({ sucesso: "As senhas não estão iguais" });
        }
    }
    render() {
        return (
            <div className="Dash">
                <nav className='navDash'>
                    <Link
                        to="/Dash"
                        style={{ textDecoration: 'none', color: 'white' }}
                    >
                        <h1>Cadastrar Produto</h1>
                    </Link>
                </nav>

                <Menu />
                {/* ---------------Form---------------- */}

                <form method="POST" onSubmit={this.CadastrarAdm} className="FormCadastro_Produto" autocomplete="off">

                    <div className="divInput_Produto">
                        <div className="item_formproduto1">
                            <label>Nome</label>
                            <input
                                required
                                maxLength="90"
                                className="input__CadastroProduto"
                                type="text"
                                name="name"
                                onChange={this.cadastroNome}
                                value={this.state.nome}
                            />
                        </div>

                        <div className="item_formproduto1">
                            <label>Email</label>
                            <input
                                required
                                className="input__CadastroProduto"
                                type="text"
                                name="name"
                                onChange={this.cadastroEmail}
                                value={this.state.email}
                            />
                        </div>
                    </div>

                    <div className="item_formproduto1">
                        <label>Senha</label>
                        <input
                            required
                            className="input__CadastroProduto"
                            type="password"
                            name="name"
                            minLength="8"
                            onChange={this.cadastroSenha}
                            value={this.state.senha}
                        />
                    </div>
                    <div className="item_formproduto1">
                        <label>Confirmar Senha</label>
                        <input
                            required
                            className="input__CadastroProduto"
                            type="password"
                            name="name"
                            minLength="8"
                            onChange={this.cadastroSenha2}
                            value={this.state.senha2}
                        />
                    </div>

                    <br></br>

                    <button type="submit" className="btn_Cadastro">
                        Cadastrar
                    </button >

                    <br></br>
                    {this.state.sucesso != "" ? (
                        <div>
                            {this.state.sucesso === "Cadastrado Com sucesso" ? (
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

export default CadastrarAdm;