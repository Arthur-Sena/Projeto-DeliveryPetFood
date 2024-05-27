import React, { Component } from 'react';
import { Link } from "react-router-dom";

//Css + images
import './Procurar.css';
import Footer from '../../Component/Cliente/FooterCliente/Footer';
import Petfood from './../../Assets/LogosPetfood/PetfoodNome.png';
import SetaPretaBaixo from './../../Assets/Icons/SetaPretaBaixo.svg';
import MensagemLocalizarProduto from './../../Assets/Detalhes/Erro/MensagemLocalizarProduto.png';

class Procurar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            produtos: [],
            buscar: "",
            produtosFiltrados: [],
            categorias: [],
            categoriaFiltrada: 0,
            //#region State.NavEndereco
            enderecos: JSON.parse(localStorage.getItem("EnderecosUsuario")),
            enderecoSelecionado: {},
            escolherEndereco: false,
            //#endregion
        }
    }

    //#region "Component Navigator Endereco"    
    NavEndereco() {
        return (
            <div className='NavEndereco_HomeCliente'>

                <nav className="Component_NavEndereco">
                    <button
                        onClick={() => this.setState({ escolherEndereco: !this.state.escolherEndereco })}
                        className="Component_BtnEscolherEndereco"
                    >{this.state.enderecoSelecionado == null || this.state.enderecoSelecionado.length == 0 ? (
                        <div className="Component_DivEnderecoSelecionado">
                            <Link to="/NovoEndereco" style={{ textDecoration: 'none' }}>
                                <p className='Text_TituloEntrega'>Nenhum endereço encontrado</p>
                                <p className='Text_EnderecoEntrega'>Cadastre um novo</p>
                            </Link>
                        </div>
                    ) : (
                        <div className="Component_DivEnderecoSelecionado">
                            <p className='Text_TituloEntrega'>Entrega para</p>
                            <div className="Div_TextImg_EnderecoEntrega">
                                {localStorage.getItem("usuario-petfood") ? (
                                    <p className='Text_EnderecoEntrega'>
                                        {this.state.enderecoSelecionado.enderecoRua} - {this.state.enderecoSelecionado.numero}
                                    </p>
                                ) : (
                                    <p className='Text_EnderecoEntrega'>
                                        {sessionStorage.getItem("endereco")}
                                    </p>
                                )}
                                <img src={SetaPretaBaixo} />
                            </div>
                        </div>
                    )
                        }
                    </button>

                    <Link to='Home'> <img src={Petfood} className='ComponentImg_LogoPetfood' /> </Link>
                </nav>

                {this.state.escolherEndereco === true ? (
                    <div className="Component_ListaParaEscolherEndereco">
                        {
                            this.state.enderecos.map(x => {
                                return (
                                    <div className="Component_SelecionarEndereco">
                                        <input
                                            className="Component_inputCheckBoxEndereco"
                                            type="radio"
                                            id={x.idendereco}
                                            name="scales"
                                            value={x.idendereco}
                                            onChange={this.enderecoSelecionado}
                                            defaultChecked={sessionStorage.getItem("IdEnderecoEscolhido") == x.idendereco ? (true) : (false)}
                                        />
                                        <label for={x.idendereco} className="Text_TituloEntrega">
                                            {x.enderecoRua}
                                        </label>
                                    </div>
                                )
                            })}
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        )
    }

    enderecoSelecionado = (event) => {
        if (sessionStorage.getItem("IdEnderecoEscolhido") != null) {

            sessionStorage.setItem("IdEnderecoEscolhido", event.target.value)
            this.setState({ escolherEndereco: !this.state.escolherEndereco })
            this.buscarEnderecoSelecionado();
        }
    }
    //#endregion

    atualizaEstado(event) {
        this.setState({ buscar: event.target.value }, () => {
            if (this.state.buscar.length >= 3) {
                this.listarProdutos();
            }
        })
    }
    atualizaCategoriaFiltrada(numero) {
        this.setState({ categoriaFiltrada: numero }, () => {
            this.FiltrarProduto();
        })
    }

    FiltrarProduto() {
        let listaFiltrada = this.state.produtos;
        if (this.state.buscar != "") {

            listaFiltrada = listaFiltrada.filter(
                x =>
                    x.titulo.toLowerCase().includes(this.state.buscar.toLowerCase()) ||
                    x.idpetshopNavigation.nome.toLowerCase().includes(this.state.buscar.toLowerCase()) ||
                    x.descricao.toLowerCase().includes(this.state.buscar.toLowerCase())
            );
        }
        if (this.state.categoriaFiltrada != 0) {
            listaFiltrada = listaFiltrada.filter(
                x =>
                    x.idCategoria == this.state.categoriaFiltrada
            )
        }
        this.setState({ produtosFiltrados: listaFiltrada });
    }

    listarProdutos = () => {
        var lat = (this.state.enderecoSelecionado.latitude == null) ? (sessionStorage.getItem("lat")) : (this.state.enderecoSelecionado.latitude);
        var lng = (this.state.enderecoSelecionado.longitude == null) ? (sessionStorage.getItem("lng")) : (this.state.enderecoSelecionado.longitude);
        fetch('https://env-9048989.jelastic.saveincloud.net/api/produtos/buscar/lat:' + lat + ',lng:' + lng + ',buscar:' + this.state.buscar, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ produtos: data })
                this.setState({ produtosFiltrados: data })
            })
            .catch(error => console.log(error))
    }

    buscarEnderecoSelecionado() {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/endereco/' + sessionStorage.getItem("IdEnderecoEscolhido"), {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then((data) => {
                this.setState({ enderecoSelecionado: data[0] })
            })
            .catch(error => console.log(error))
    }

    buscarCategorias() {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/produtos/categoria', {
            headers: {
                'Method': 'Get',
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then((data) => this.setState({ categorias: data }))
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.buscarCategorias();
        if (localStorage.getItem("usuario-petfood") != null) {
            this.buscarEnderecoSelecionado();
        }
    }

    render() {
        return (
            <div className="Pesquisa" >
                {/* - - -NAV--------------------------------------------------- */}

                {this.NavEndereco()}

                {/* Input de buscar Produtos e Petshops */}
                <div className="inputBusca">
                    <input
                        className="inputBuscar"
                        placeholder="Encontre um produto"
                        onChange={this.atualizaEstado.bind(this)}
                        type="search"
                    ></input>
                </div>

                {/* Filtro por Categoria Aqui */}
                <section className="Section_FiltrarPesquisaPorCategoriaProduto">
                    {
                        this.state.categorias.map(x => {
                            return (
                                <div className="Div_FiltrarPesquisaPorCategoriaProduto">
                                    <button className="div_BtnDeFiltro"
                                        onClick={() => {
                                            this.atualizaCategoriaFiltrada(x.idCategoria);
                                        }}
                                    >
                                        <img src={x.icone} className="BtnDeFiltro_IconCategoria" />
                                    </button>
                                    <p className="BtnDeFiltro_nomeCategoria">{x.categoria}</p>
                                </div>
                            )
                        })
                    }
                </section>

                {/* - - -Produtos-------------------------------------------------------------- */}
                {this.state.produtos != null && this.state.produtos.length != 0 ? (

                    <section className='Section_ListaCardProdutosPesquisados'>
                        {
                            this.state.produtosFiltrados.map(x => {
                                return (
                                    <div className="Card_ProdutoPesquisado"
                                        onClick={() => {
                                            sessionStorage.setItem("IdPetshop", x.idpetshop)
                                            window.location.href = ('/EstoqueDaLoja/' + x.idpetshop)
                                        }}
                                    >
                                        <section className="Card_FotoPesquisarProduto">
                                            <figure className="Div_ImgProdutoPesquisado">
                                                <img src={x.imgprodutos[0].img} className="Img_ProdutoProcurado" />
                                            </figure>
                                        </section>

                                        <section className="Card_DivDecricaoProdutoPesquisado">
                                            <div className="DivTitle_descProduto">
                                                <p className="Card_TituloProdutoPesquisado">{x.titulo}</p>
                                            </div>

                                            <p className="Card_DescricaoProdutoPesquisado">{x.descricao}</p>

                                            <div className="div_PrecoBuscarProduto">
                                                <div className="Card_PrecoProdutoPesquisado">
                                                    <p className="Card_TextPrecoProdutoPesquisado">R$ {x.preco.toFixed(2)} </p>
                                                </div>
                                            </div>

                                        </section>
                                    </div>
                                );
                            })
                        }
                    </section>
                ) : (
                    <img src={MensagemLocalizarProduto} className="Img_MensagemProcurarProduto" />
                )}
                <Footer page="Pesquisar" />

                <br></br>
                <br></br>
            </div>
        );
    }
}

export default Procurar;