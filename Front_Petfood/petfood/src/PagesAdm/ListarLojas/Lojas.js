import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Axios from 'axios';

//Css + images
import './Lojas.css';
import Deletar from '../../Assets/trash.svg';
import Produtos from '../../Assets/bag.svg';
import Atualizar from '../../Assets/pencil.svg';
import LogoRedondo from '../../Assets/Logo_Redondo.png';
import Menu from '../../Component/MenuAdm';

class Lojas extends Component {

    constructor() {
        super();
        this.state = {
            listaPetshop: [],
            petshopFiltrado: [],
            buscar: '',
            del: 0,
        }
    }
    // ----------------------------------------FILTRO---------------------------------------------------
    atualizaEstado(event) {
        this.setState({ buscar: event.target.value }, () => {
            this.FiltrarPesthop();
        })
    }

    FiltrarPesthop() {
        let listaFiltrada = this.state.listaPetshop;
        if (this.state.buscar != "") {

            listaFiltrada = listaFiltrada.filter(
                x =>
                    x.nome.toLowerCase().includes(this.state.buscar.toLowerCase()) ||
                    x.endereco.toLowerCase().includes(this.state.buscar.toLowerCase()) ||
                    x.cep.toLowerCase().includes(this.state.buscar.toLowerCase()) ||
                    x.telefone.toLowerCase().includes(this.state.buscar.toLowerCase())
            );
        }
        this.setState({ petshopFiltrado: listaFiltrada });
    }
    // -------------------------------------------------------------------------------------------------
    listarPetshop = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/petshop', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => this.setState({ listaPetshop: data }) + this.setState({ petshopFiltrado: data }))
            .catch(error => console.log(error))
    }

    deletarPetshop = (id) => {
        if (id != 0) {
            Axios.delete("https://env-9048989.jelastic.saveincloud.net/api/petshop/" + id, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json'
                },
            })
                .then(() => alert("Petshop removido com sucesso"))
                .catch(error => console.log(error))
            window.location.reload();
        }
    }

    componentDidMount() {
        this.listarPetshop();
    }

    Change = (id) => {
        Axios.put("https://env-9048989.jelastic.saveincloud.net/api/petshop/RetirarNaLoja?idPetshop=" + id ,{}, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
            },
        })
            .then(()=> alert("Funcionalidade Liberada Para o Petshop"))
            .catch(erro => console.log(erro))
    }

    render() {
        return (
            <div className="Dash">
                <nav className='navDash'>
                    <Link
                        to="/Dash"
                        style={{ textDecoration: 'none', color: 'white' }}
                    >
                        <h1>LOJAS</h1>
                    </Link>
                </nav>

                <Menu />


                {/* -------------------------------------INPUT DE PESQUISA POR PETSHOP---------------------------------------- */}
                <div className="divBusca_ADM">
                    <input
                        className="inputBuscar_ADM"
                        placeholder="   Buscar Petshop"
                        onChange={this.atualizaEstado.bind(this)}
                    ></input>
                </div>

                {/* --------------------------------------------LISTA DE PETSHOP---------------------------------------------- */}
                <div className="ListaPetshop_ADM">
                    {this.state.petshopFiltrado.map(x => {
                        return (
                            <div className="div_ListaPetshop"   > 
                                <div className="petshopinfo_ADM">
                                    <div className="divLogoPetshop_Adm">
                                        {x.imgpetshops.length == 0 ? (
                                            <img src={LogoRedondo} className="imgPetshopHome" />
                                        ) : (
                                            <img src={x.imgpetshops[0].img} className="imgPetshopHome" />
                                        )}
                                    </div>
                                    <p style={{ textAlign: 'center', color: 'rgb(110, 110, 110)' }}>
                                        <strong>{x.nome}</strong>
                                    </p>
                                    <br></br>
                                    <p>{x.endereco}</p>
                                    <p>{x.cidade} - {x.estado}</p>
                                    <p>{x.cep}</p>
                                    <p>{x.telefone}</p>
                                    <br></br>
                                    <div    style={{height:'3vh', display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
                                        <p className='switch_text'  style={{textAlign:"center"}}>Retirar Na Loja</p>

                                        <div class="switch__container switch--shadow--Produtos" >
                                            <input
                                                id={x.idpetshop}
                                                class="switch switch--shadow "
                                                type="checkbox"
                                                onChange={() => this.Change(x.idpetshop)}
                                                defaultChecked={x.retirarNaLoja}
                                            />
                                            <label for={x.idpetshop}></label>
                                        </div>
                                    </div>
                                </div>
                                <div className="footerpetshopInfo">

                                    <button className="btnImgFooter"
                                        onClick={() => {
                                            const r = window.confirm("Devo deletar o petshop " + x.nome + " ?");

                                            if (r == true) {
                                                this.deletarPetshop(x.idpetshop);
                                            }
                                        }}
                                    >
                                        <img src={Deletar} className="imgFooterPetshop" />
                                    </button>

                                    <button className="btnImgFooter"
                                        onClick={() =>
                                            localStorage.setItem("IdPetshop", x.idpetshop)
                                            +
                                            this.props.history.push('/ProdutosDaLoja')
                                        }>

                                        <img src={Produtos} className="imgFooterPetshop" />

                                    </button>

                                    <button className="btnImgFooter"
                                        onClick={() =>
                                            localStorage.setItem("IdPetshop", x.idpetshop)
                                            +
                                            this.props.history.push('/AtualizarLoja')
                                        }>
                                        <img src={Atualizar} className="imgFooterPetshop" />
                                    </button>

                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default Lojas;