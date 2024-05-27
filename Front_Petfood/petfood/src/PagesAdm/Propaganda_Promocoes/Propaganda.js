import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Axios from 'axios';

import Menu from '../../Component/MenuAdm';
import Deletar from '../../Assets/trash.svg';

import './Propaganda.css';


class Propaganda extends Component {

    constructor() {
        super();
        this.state = {
            Promocoes_Propagandas: [],
            Promocoes_Propagandas_Filtrada: [],
            buscar: "",
        }
    }

    atualizaEstado(event) {
        this.setState({ buscar: event.target.value }, () => {
            this.FiltrarPromocoes_Propagandas();
        });
    }

    FiltrarPromocoes_Propagandas() {
        let listaFiltrada = this.state.Promocoes_Propagandas;
        if (this.state.buscar != "") {
            listaFiltrada = listaFiltrada.filter(
                x =>
                    x.titulo.toLowerCase().includes(this.state.buscar.toLowerCase())
            );
        }
        this.setState({ Promocoes_Propagandas_Filtrada: listaFiltrada });
    }

    listarPromocoes_Propagandas = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/propaganda', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => this.setState({ Promocoes_Propagandas: data }) + this.setState({ Promocoes_Propagandas_Filtrada: data }))
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.listarPromocoes_Propagandas();
    }

    Change = (id) => {
        Axios.put("https://env-9048989.jelastic.saveincloud.net/api/propaganda", {
            idPropaganda: id
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
            },
        })
            .then(response => {
                if (response.status === 200) {
                    console.log("OK");
                    // window.location.reload();
                }
            })
            .catch(erro => console.log(erro))
    }

    DeletarPropaganda = (id) => {
        Axios.delete("https://env-9048989.jelastic.saveincloud.net/api/propaganda?idPropaganda=" + id, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('usuario-petfood')
            },
        })
            .then(response => {
                if (response.status === 200) {
                    console.log("Propaganda deletada Com Sucesso")
                    window.location.reload();
                }
            })
            .catch(error => {
                console.log("Erro ao deletar")
            })
    }

    render() {
        return (
            <div className='Propaganda'>
                <nav className='navEstoque'>
                    <Link
                        to="/Dash"
                        style={{ textDecoration: 'none', color: 'white' }}
                    >
                        <h1>Promoções & Propagandas</h1>
                    </Link>

                    <button className="btnNavEstoque"
                        onClick={() =>
                            this.props.history.push('/CadastrarPromocao')
                        }
                    >
                        Cadastrar Propaganda
                    </button>
                </nav>
                <Menu />

                <main className="main_Propaganda">
                    <div className="div_inputFiltroPromocoes">
                        <input
                            className="inputBuscar_PromocoesPropagandas"
                            placeholder="Buscar Promoções e Propagandas"
                            onChange={this.atualizaEstado.bind(this)}
                        ></input>
                    </div>

                    <div className="div_listaPromocoes">
                        {this.state.Promocoes_Propagandas_Filtrada.map(x => {
                            return (
                                <section className="Card_Promocao">
                                    <div className="div_ImgCard">
                                        <img src={x.imagem} className="img_CardPromocao" />
                                    </div>

                                    <div className="div_FooterCard">

                                        <button className="btn_DeletarPromocao"
                                            onClick={() => {
                                                const r = window.confirm("Devo deletar a propaganda?");

                                                if (r == true) {
                                                    this.DeletarPropaganda(x.idPropaganda);
                                                }
                                            }}
                                        >
                                            <img src={Deletar} className="imgFooterPetshop" />
                                        </button>


                                        <div className="div_TituloPromocao">
                                            <p><strong>{x.titulo}</strong></p>
                                        </div>

                                        <div class="switch__container">
                                            <input
                                                id={x.idPropaganda}
                                                class="switch switch--shadow"
                                                type="checkbox"
                                                onChange={() => this.Change(x.idPropaganda)}
                                                defaultChecked={x.ativa}
                                            />
                                            <label for={x.idPropaganda}></label>
                                        </div>

                                    </div>
                                </section>
                            )
                        })
                        }
                    </div>


                </main>

            </div>
        )
    }
}

export default Propaganda;