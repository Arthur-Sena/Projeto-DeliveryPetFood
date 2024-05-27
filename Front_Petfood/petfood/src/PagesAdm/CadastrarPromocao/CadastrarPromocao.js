import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Axios from 'axios';

import Menu from '../../Component/MenuAdm';

import './CadastrarPromocao.css';


class CadastrarPromocao extends Component {

    constructor() {
        super();
        this.state = {
            titulo: "",
            img: null,
            descricao: "",
            url: "",
            status: false,
            sucesso: "",
        }
    }

    cadastroTitulo = (event) => {
        this.setState({ titulo: event.target.value })
    }

    cadastroImg = (event) => {
        let imageFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = new FileReader();
        reader.onload = x => {
            this.setState({ img: x.target.result })
        }
        reader.readAsDataURL(imageFile)
    }

    cadastroDescricao = (event) => {
        this.setState({ descricao: event.target.value })
    }
    cadastroUrl = (event) => {
        this.setState({ url: event.target.value })
    }

    cadastrarStatusDaPromocao = (event) => {
        if (event.target.value == 1) {
            this.setState({ status: false }, () => {
                console.log(this.state.status);
            })
        } else {
            this.setState({ status: true }, () => {
                console.log(this.state.status);
            })
        }
    }

    cadastrarPromocao = (event) => {
        event.preventDefault();
        this.refs.btn.setAttribute("disabled", "disabled");
        this.setState({ sucesso: "Cadastrando Promoção.." })

        if (this.state.img.length < 149999) {

            Axios.post("https://env-9048989.jelastic.saveincloud.net/api/propaganda", {
                Titulo: this.state.titulo,
                Imagem: this.state.img,
                Descricao: this.state.descricao,
                Ativa: this.state.status,
                urlRedirecionamento: this.state.url,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                if (response.status === 200) {
                    this.setState({ sucesso: "Promoção Cadastrada Com Sucesso" })
                }
                this.refs.btn.removeAttribute("disabled");
            })
                .catch(error => {
                    this.setState({ sucesso: "Erro ao Cadastrar" });
                    this.refs.btn.removeAttribute("disabled");
                })
        } else{
            this.setState({ sucesso: "Imagem muito grande, tente novamente" });
            this.refs.btn.removeAttribute("disabled");
        }
    }

    render() {
        return (
            <div className='CadastrarPromocao'>
                <nav className='navEstoque'>
                    <Link
                        to="/Propaganda"
                        style={{ textDecoration: 'none', color: 'white' }}
                    >
                        <h1>Promoções & Propagandas</h1>
                    </Link>
                </nav>
                <Menu />

                <form method="POST" onSubmit={this.cadastrarPromocao} className="FormCadastro_Produto">

                    <div className="item_formPromocao">
                        <label>Título</label>
                        <input
                            required
                            className="input_CadastroPromocao"
                            type="text"
                            name="name"
                            onChange={this.cadastroTitulo}
                        />
                    </div>

                    <div className="item_formPromocao">
                        <label style={{ marginTop: '5px' }} className="label_maiorinputimg">Imagem
                            <label className="input_img">Escolher Imagem
                                <input
                                    type="file"
                                    className="input_img"
                                    accept="image/png, image/jpeg"
                                    onChange={this.cadastroImg}
                                />
                            </label>
                        </label>
                    </div>

                    <div className="div_imgCadastrada">
                        {this.state.img != null ? (
                            <img src={this.state.img} className="div_verImgCadastrada" />
                        ) : (
                            <p>Imagem Cadastrada</p>
                        )}
                    </div>

                    <div className="item_formPromocao">
                        <label>Descrição</label>
                        <input
                            // required
                            className="input_CadastroPromocao"
                            type="text"
                            name="name"
                            onChange={this.cadastroDescricao}
                        />
                    </div>
                    <div className="item_formPromocao">
                        <label>Url de Redirecionamento</label>
                        <input
                            required
                            className="input_CadastroPromocao"
                            type="text"
                            name="name"
                            onChange={this.cadastroUrl}
                        />
                    </div>

                    {/* <div className="item_formPromocao"> */}
                    <label>Ativar Promoção?</label>
                    <div className="div_ativarPromocao">
                        <p>Não</p>
                        <input
                            className="inputRange_formPromocao"
                            type="range"
                            min="1"
                            max="2"
                            step="1"
                            defaultValue="1"
                            onChange={this.cadastrarStatusDaPromocao}
                        />
                        <p>Sim</p>
                    </div>

                    <button type="submit" className="btn_CadastroPromocao" ref="btn">
                        Cadastrar Promoção
                    </button >
                    {this.state.sucesso.includes("Erro") || this.state.sucesso.includes("tente novamente")? (
                        <p style={{ color: "red" }}>{this.state.sucesso}</p>
                    ) : (
                        <p style={{ color: "green" }}>{this.state.sucesso}</p>
                    )}
                </form>
            </div>
        )
    }
}

export default CadastrarPromocao;