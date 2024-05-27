import { Link } from "react-router-dom"; import React, { Component } from 'react';
import Axios from 'axios';
import Menu from '../../Component/MenuAdm';
//Css + images
import './Dashboard.css';

class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            frete: [],
            faturamento: {},
            lucropetfood: 0.0,
            idFrete: 0,
            distancia: null,
            preco: null,
            addFrete: false,
            freteGratis: null,
        }
    }

    setDistancia = (event) => {
        this.setState({ distancia: event.target.value }, () => { console.log(this.state.distancia) })
    }
    setPreco = (event) => {
        var valor = event.target.value;
        valor = valor + '';
        valor = parseInt(valor.replace(/[\D]+/g, ''));
        valor = valor + '';
        valor = valor.replace(/([0-9]{2})$/g, ".$1");
        this.setState({ preco: valor }, () => { console.log(this.state.preco) })
    }

    atualizarFrete = (event) => {
        Axios.put("https://env-9048989.jelastic.saveincloud.net/api/dashboard/frete", {
            idFrete: this.state.idFrete,
            Distancia: this.state.distancia,
            Preco: this.state.preco
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('usuario-petfood')
            },

        })
            .then(response => {
                if (response.status === 200) {
                    console.log("Frete Atualizado")
                }
            })
            .catch(error => {
                console.log("Erro ao Atualizar Frete", error)
            })
    }

    cadastrarFrete = (event) => {
        event.preventDefault();

        Axios.post("https://env-9048989.jelastic.saveincloud.net/api/dashboard/frete", {
            Distancia: this.state.distancia,
            Preco: this.state.preco
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('usuario-petfood')
            },
        }).then(response => {
            if (response.status === 200) {
                console.log("Frete Cadastrado")
                window.location.reload();
            }
        })
            .catch(error => {
                console.log("Erro ao Cadastrar Frete")
            })
    }

    deletarFrete = (id) => {
        if (id != 0) {
            Axios.delete("https://env-9048989.jelastic.saveincloud.net/api/dashboard/frete/" + id, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
                .then(response => {
                    if (response.status === 200) {
                        alert("Frete removido com sucesso");
                        window.location.reload();
                    }
                })
        } else {
            console.log(" ")
        }
    }

    ValorDoFrete = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/dashboard/frete', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ frete: data });
            })
            .catch(error => console.log(error))
    }

    Faturamento = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/dashboard/faturamento', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ faturamento: data });
            })
            .catch(error => console.log(error))
        fetch('https://env-9048989.jelastic.saveincloud.net/api/dashboard/lucropetfood', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ lucropetfood: data.toLocaleString('pt-BR') });
            })
            .catch(error => console.log(error))
    }

    freteGratis = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/dashboard/fretegratis', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then((data) => {
                this.setState({ freteGratis: data });
            })
            .catch(error => console.log(error))
    }

    freteGratisAPartirDe = () => {
        Axios.put('https://env-9048989.jelastic.saveincloud.net/api/dashboard/fretegratis?preco=' + this.state.freteGratis, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then((data) => {
                this.setState({ freteGratis: data });
                alert("O Valor mínimo para frete grátis foi atualizado")
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.ValorDoFrete();
        this.Faturamento();
        this.freteGratis();
    }

    freteGratuitoNesseValor = (event) => {
        this.setState({ freteGratis: event.target.value })
    }

    render() {
        return (
            <div className="Dashboard" >

                <nav className='navDash'>
                    <Link
                        to="/Dash"
                        style={{ textDecoration: 'none', color: 'white' }}
                    >
                        <h1>Dashboard</h1>
                    </Link>
                </nav>

                <Menu />

                <main className="main_Dashboard">

                    <section className="section_table">
                        <div className="div_Table_Input">

                            <table className="table_Frete">
                                <thead>
                                    <tr>
                                        <th className="tdtabela">Distancia</th>
                                        <th className="tdtabela">Preço</th>
                                        {/* <th className="tdtabela"> */}
                                        <button
                                            className="btn_DashboardAdd"
                                            onClick={() => {
                                                this.setState({ addFrete: !this.state.addFrete })
                                                this.setState({ idFrete: 0 })
                                            }}
                                        >
                                            Adicionar
                                        </button>
                                        {/* </th> */}
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.frete.map(x => {
                                        return (
                                            <tr>
                                                <td>Até {x.distancia}Km</td>
                                                <td>R${x.preco}</td>
                                                <td className="td_Dashboard">
                                                    <button
                                                        className="btn_DashboardDelete"
                                                        onClick={() => {
                                                            const r = window.confirm("Devo deletar o frete de " + x.distancia + "Km ?");
                                                            if (r == true) {
                                                                this.deletarFrete(x.idFrete);
                                                            }
                                                        }}
                                                    >
                                                        Deletar
                                                    </button>
                                                    <button
                                                        className="btn_DashboardUpdate"
                                                        onClick={() => {
                                                            this.setState({ idFrete: x.idFrete }, () => console.log(this.state.idFrete))
                                                            this.setState({ distancia: x.distancia })
                                                            this.setState({ preco: x.preco })

                                                        }}
                                                    >Atualizar</button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    }
                                </tbody>

                            </table>

                            {this.state.idFrete != 0 && this.state.idFrete != null ? (
                                <form
                                    className="form_atualizarFrete"
                                    onSubmit={this.atualizarFrete}
                                >
                                    <input
                                        className="input_atualizarFrete"
                                        onChange={this.setDistancia}
                                        placeholder={this.state.distancia + "Km"}
                                    >
                                    </input>
                                    <input
                                        className="input_atualizarFrete"
                                        onChange={this.setPreco}
                                        placeholder={"R$" + this.state.preco}
                                    >
                                    </input>
                                    <button
                                        type="submit"
                                        style={{ width: "20%", height: "20px" }}
                                    >Atualizar</button>
                                </form>
                            ) : (
                                this.state.addFrete == true ? (
                                    <div>
                                        <form
                                            className="form_atualizarFrete"
                                            onSubmit={this.cadastrarFrete}
                                        >
                                            <input
                                                className="input_atualizarFrete"
                                                onChange={this.setDistancia}
                                                placeholder="Distância (Km)"
                                            >
                                            </input>
                                            <input
                                                className="input_atualizarFrete"
                                                onChange={this.setPreco}
                                                placeholder="Preço (R$)"
                                            >
                                            </input>
                                            <button
                                                className="btn_attFrete"
                                                type="submit"
                                                style={{ width: "20%", height: "20px" }}
                                            >Enviar</button>
                                        </form>
                                    </div>
                                ) : (
                                    <div></div>
                                )
                            )}

                        </div>

                        <div>
                            <div className='card_dashFreteGratis'>
                                {/* <div> */}
                                    <h3>Frete Grátis a partir de R$</h3>
                                    <input className="input_FreteGratis"
                                        onChange={this.freteGratuitoNesseValor}
                                        value={this.state.freteGratis}
                                    ></input>
                                {/* </div> */}
                                <button 
                                    className="button_AtualizarFreteGratis"
                                    onClick={() => this.freteGratisAPartirDe()}
                                >
                                    Atualizar
                                </button>
                            </div>
                            <div className="div_CardsDashboard">

                                <div className='card_dashInfo'>
                                    <h1>R${this.state.faturamento.precoTotal}</h1>
                                    <h5>Faturamento</h5>
                                </div>

                                <div className='card_dashInfo'>
                                    <h1>R${this.state.faturamento.precoFrete}</h1>
                                    <h5>Receita de Frete</h5>
                                </div>
                                <div className='card_dashInfo'>
                                    <h1>R${this.state.faturamento.precoProduto}</h1>
                                    <h5>Receita de Pedidos</h5>
                                </div>
                                <div className='card_dashInfo'>
                                    <h1>R${this.state.lucropetfood}</h1>
                                    <h5>Lucro</h5>
                                </div>

                            </div>
                        </div>

                    </section>

                    <section className="section_InformacaoDasPromocoes">
                    </section>

                </main>

                {/* --------------------------------------------------------------------------------- */}


            </div>
        );
    }
}

export default Dashboard;