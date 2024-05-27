import React, { PropTypes, Component } from 'react';
import Axios from 'axios';
import { Link } from "react-router-dom";
import './EstoqueDaLoja.css';
import { parseJwt } from './../../services/auth.js';

import Footer from '../../Component/Cliente/FooterCliente/Footer';
import Titulo from './../../Component/Cliente/TituloDaDiv/TituloDiv';

import SetaBox from '../../Assets/Icons/SetaInBox.svg';
import SetaBoxPagamento from '../../Assets/Icons/SetaInBoxPagamento.svg';
import Avaliacao from '../../Assets/Icons/EstrelaVermelhaAvaliacao.svg';
import Telefone from '../../Assets/Icons/Telefone.svg';
import circulo from './../../Assets/Detalhes/circulo_rosa.svg';
import VerProdutos from './../../Assets/Icons/VerProdutos.svg';
import LocalSelecionado from '../../Assets/Icons/Localizacao.svg';
import CompraSegura from '../../Assets/Detalhes/SeloCompraSegura.png';

import LogoRedondo from '../../Assets/Logo_Redondo.png';

import CarrinhoDeCompra from '../../Assets/cart.svg';
import Seta from '../../Assets/chevron-left.svg';
import Hora from './../../Assets/relogio.png';
import Entregador from './../../Assets/entrega.png';
import Local from './../../Assets/localizacao.png';
import { Helmet } from 'react-helmet';


var geolocator = require("geolocator");

let id = [];
let idprodutoEscolhido = [];
var pedido = [];
let sacolaDeCompra = [];
let PrecoDaCompra = 0;
let ListaProdutos = [];
const reducer1 = (accumulator, currentValue) => accumulator + currentValue;

function copyToClipboard() {
    var copyText = document.getElementById("pixCode");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
}

function geraStringAleatoria(tamanho) {
    var stringAleatoria = '';
    var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < tamanho; i++) {
        stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return stringAleatoria;
}

let session_id;

class EstoqueDaLoja extends Component {
    constructor(props) {
        super(props);
        this.state = {
            distancia: null,
            IdPetshop: 0,
            IdEndereco: sessionStorage.getItem("IdEnderecoEscolhido"),
            imgpetshop: {},
            petshop: {},
            usuario: {},
            origin: "",
            buscar: "",
            produtos: [],
            produtosFiltrado: [],

            compra: false,
            produtoClickado: null,
            eventKey: true,
            listaDeCompras: [],
            idDelete: null,
            idProduto: 0,
            quantidade: 0,
            preco: 0.0,
            precoFrete: 0.0,
            precoFrete1: 0.0,
            enderecoSelecionado: {},
            categorias: [],
            categoriaFiltrada: 0,
            abrirTelaDePagamento: false,

            pagamento: ['Crédito', 'Débito', 'Pix'],
            // pagamento: ['Cartão na Hora da Entrega', 'Pix','Crédito', 'Débito'],
            pagamentoSelecionado: null,
            NomeCompletoCartao: null,
            MesExpiracaoCartao: null,
            AnoExpiracaoCartao: null,
            NumeroCartao: null,
            CVCcartao: null,
            pixCode: "Finalize a Compra Para Receber o Código Pix",
            // pixCode: "contato@deliverypetfood.com.br",
            enderecos: [],
            errorFound: false,

            freteGratis: 0.0,
            valorDaCompra: 0.0,
            aviso: null,
            RetirarNaLoja: false,
        }
    }

    //#region INPUT ----------------------------------------------------
    atualizaEstado(event) {
        this.setState({ buscar: event.target.value }, () => {
            this.FiltrarProdutos();
        })
    }

    atualizaCategoriaFiltrada(numero) {
        this.setState({ categoriaFiltrada: numero }, () => {
            this.FiltrarProdutos();
        })
    }

    FiltrarProdutos() {
        let listaFiltrada = this.state.produtos;
        if (this.state.buscar != "") {

            listaFiltrada = listaFiltrada.filter(
                x =>
                    x.titulo.toLowerCase().includes(this.state.buscar.toLowerCase())
            );
        }
        if (this.state.categoriaFiltrada != 0) {
            listaFiltrada = listaFiltrada.filter(
                x =>
                    x.idCategoria == this.state.categoriaFiltrada
            )
        }
        this.setState({ produtosFiltrado: listaFiltrada });
    }

    pagamentoSelecionado = (event) => {
        if (!localStorage.getItem("usuario-petfood")) {
            alert("Funcionalidade Para Usuario Logado");
            event.preventDefault();
        } else {
            this.setState({ NomeCompletoCartao: "" });
            this.setState({ MesExpiracaoCartao: "" });
            this.setState({ AnoExpiracaoCartao: "" });
            this.setState({ NumeroCartao: "" });
            this.setState({ CVCcartao: "" });
            this.setState({ pagamentoSelecionado: event.target.value })
        }
    }
    cadastroNomeCompletoGetNet = (event) => { this.setState({ NomeCompletoCartao: event.target.value }) }
    cadastroMesGetNet = (event) => { this.setState({ MesExpiracaoCartao: event.target.value.replace(/\s/g, '') }) }
    cadastroAnoGetNet = (event) => { this.setState({ AnoExpiracaoCartao: event.target.value.replace(/\s/g, '') }) }
    cadastroNumeroCartaoGetNet = (event) => { this.setState({ NumeroCartao: event.target.value.replace(/\s/g, '') }) }
    cadastroCVCGetNet = (event) => { this.setState({ CVCcartao: event.target.value.replace(/\s/g, '') }) }
    Change = () => {
        this.setState({ RetirarNaLoja: !this.state.RetirarNaLoja }, () => {
            if (this.state.RetirarNaLoja == true) {
                this.setState({ precoFrete: 0 });
            } else {
                this.setState({ precoFrete: this.state.precoFrete1 });
            }
        })
    }
    //#endregion

    buscarPetshop = () => {
        sacolaDeCompra = [];
        fetch('https://env-9048989.jelastic.saveincloud.net/api/petshop/' + this.state.IdPetshop, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ petshop: data[0] })
                this.setState({ imgpetshop: data[0].imgpetshops[0] })
                this.setState({ origin: data[0].latitude + "," + data[0].longitude })
                this.setState({ originLat: data[0].latitude })
                this.setState({ originLng: data[0].longitude })
                this.CalcularDistanciaUsuarioPetshop(data[0].latitude, data[0].longitude, this.state.enderecoSelecionado.latitude, this.state.enderecoSelecionado.longitude);
            })
            .catch(error => console.log(error))
    }

    buscarUsuario = () => {
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

    produtosDoPetshop = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/produtos/petshop/' + this.state.IdPetshop, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ produtos: data });
                this.setState({ produtosFiltrado: data });

            })
            .catch(error => console.log(error))
    }

    CalcularDistanciaUsuarioPetshop = (lat, lng, FromLat, FromLng) => {
        var result = geolocator.calcDistance({
            from: {
                latitude: (FromLat == null) ? (sessionStorage.getItem("lat")) : (FromLat),
                longitude: (FromLng == null) ? (sessionStorage.getItem("lng")) : (FromLng)
            },
            to: {
                latitude: lat,
                longitude: lng
            },
            formula: geolocator.DistanceFormula.HAVERSINE,
            unitSystem: geolocator.UnitSystem.METRIC
        });
        this.setState({ distancia: result.toFixed(1) });
        if (localStorage.getItem("usuario-petfood") != null) {
            fetch('https://env-9048989.jelastic.saveincloud.net/api/dashboard/frete', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
                .then(response => response.json())
                .then((data) => {
                    let frete = data.find(element => element.distancia > result.toFixed(1));
                    if (this.state.petshop.logistica == 2) {
                        this.setState({ precoFrete: 0 });
                        this.setState({ precoFrete1: 0 });
                    } else {
                        this.setState({ precoFrete: frete.preco });
                        this.setState({ precoFrete1: frete.preco });
                    }
                })
                .catch(error => console.log(error))
        } else {
            this.setState({ precoFrete: " ---" });
        }
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

    componentDidMount() {
        session_id = "37835291000148" + geraStringAleatoria(16);
        id = [];
        idprodutoEscolhido = [];
        pedido = [];

        sacolaDeCompra = [];
        PrecoDaCompra = 0;

        ListaProdutos = [];
        if (localStorage.getItem("usuario-petfood") != null) {
            this.buscarEndereco();
            this.buscarUsuario();
            this.produtosDoPetshop();
            this.buscarCategorias();
            this.BuscarEnderecos();
            this.freteGratis();
        } else {
            this.buscarPetshop();
            this.produtosDoPetshop();
            this.buscarCategorias();
        }
    }

    componentWillMount() {
        this.setState({ IdPetshop: this.props.match.params.id });
    }

    // Compra----------------------------------------------------
    diminuirVariavelQnt = (id) => {
        const contadorDeElementos = [...new Set(idprodutoEscolhido)];

        idprodutoEscolhido.splice(idprodutoEscolhido.lastIndexOf(id), 1);

        function filtroPorId(value) {
            return value === id;
        }
        var filtro = idprodutoEscolhido.filter(filtroPorId);
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        let quantidade;
        if (filtro.length >= 1) {
            quantidade = filtro.reduce(reducer) / id;
        } else {
            quantidade = 0;
        }
        var produto = this.state.produtos.filter(x => x.idproduto == id);

        var precox = produto[0].preco * quantidade;
        var preco = precox.toFixed(2);
        const sacola1 = { produto, quantidade, preco };
        const set1 = new Set([sacola1]);
        const final1 = [...set1];
        let array = contadorDeElementos.findIndex(x => x === id)
        if (filtro.length >= 1) {
            sacolaDeCompra.splice(array, 1, final1);
            this.setValorFrete();
        } else {
            sacolaDeCompra.splice(array, 1);
            this.setValorFrete();
        }
        // PRECO TOTAL DA COMPRA--------------------------------------------------------------
        if (sacolaDeCompra.length != 0) {
            let precoTotal = sacolaDeCompra.map(x => { return parseFloat(x[0].preco.replaceAll(",", ".")) })
            PrecoDaCompra = precoTotal.reduce(reducer1);
        } else {
            PrecoDaCompra = 0;
        }
        // ---------------------------------------------------------------------------------
    }

    pushVariavelQnt = (id) => {

        idprodutoEscolhido.push(id)

        function filtroPorId(value) {
            return value === id;
        }

        var filtro = idprodutoEscolhido.filter(filtroPorId);
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        let quantidade = filtro.reduce(reducer) / id;
        pedido = (id + ":" + quantidade);
        this.setState({ Pedido: pedido })

        var produto = this.state.produtos.filter(x => x.idproduto == id);

        var precox = produto[0].preco * quantidade;
        var preco = precox.toFixed(2);

        const sacola = { produto, quantidade, preco };
        const set = new Set([sacola]);
        const final = [...set];

        if (quantidade >= 1) {
            if (filtro.length == 1) {
                sacolaDeCompra.push(final);
                this.setValorFrete();
            } else {
                const contadorDeElementos = [...new Set(idprodutoEscolhido)];
                let array = contadorDeElementos.findIndex(x => x === id)

                sacolaDeCompra.splice(array, 1, final);
                this.setValorFrete();
            }
        } else {
            sacolaDeCompra.push(final);
            this.setValorFrete();
        }
        // PRECO TOTAL DA COMPRA--------------------------------------------------------------
        if (sacolaDeCompra.length != 0) {
            let precoTotal = sacolaDeCompra.map(x => { return parseFloat(x[0].preco.replaceAll(",", ".")) })
            PrecoDaCompra = precoTotal.reduce(reducer1);
        } else {
            PrecoDaCompra = 0;
        }
        // ---------------------------------------------------------------------------------
    }

    setValorFrete = () => {
        var ValorCompra = sacolaDeCompra.map(x => { return parseFloat(x[0].preco.replaceAll(",", ".")) })
        if (ValorCompra >= this.state.freteGratis) {
            this.setState({ precoFrete: 0.0 });
            this.setState({ aviso: "*Frete grátis" });
        } else {
            this.setState({ precoFrete: this.state.precoFrete1 });
            this.setState({ aviso: "" });
        }
    }

    setValue = (id) => {
        function filtroPorId(value) {
            return value === id;
        }

        var filtro = idprodutoEscolhido.filter(filtroPorId);
        if (filtro != 0 && filtro != null) {
            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            let x = filtro.reduce(reducer) / id

            return x;
        } else {
            return 0;
        }
    }

    eventKey = (event) => {

        if (this.state.eventKey === false) {
            this.setState({ eventKey: true })
        } else {
            this.setState({ eventKey: false })
        }
    }

    concluirPedido = (event) => {
        this.refs.btn.setAttribute("disabled", "disabled");
        this.setState({ erro: "Carregando" })
        ListaProdutos = [];
        fetch('https://env-9048989.jelastic.saveincloud.net/api/petshop/status=' + this.state.IdPetshop, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'ip_usuario': localStorage.getItem("ip_user"),
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data[0].status == true) {
                    let idProduto;
                    let quantidade;
                    let preco;
                    var produtoSplit;
                    sacolaDeCompra.map(x => {
                        idProduto = x[0].produto[0].idproduto;
                        quantidade = x[0].quantidade;
                        preco = parseFloat(x[0].preco).toFixed(2);

                        produtoSplit = { idProduto, quantidade, preco };
                        ListaProdutos.push(produtoSplit);
                    })

                    const listaDeProdutos = [...new Set(ListaProdutos)];

                    const origem = {
                        endereco: this.state.petshop.endereco,
                        petshop: this.state.petshop.nome,
                        latitude: this.state.petshop.latitude,
                        longitude: this.state.petshop.longitude
                    };
                    const destino = {
                        endereco: this.state.enderecoSelecionado.enderecoRua + ', ' + this.state.enderecoSelecionado.numero + " - " + this.state.enderecoSelecionado.bairro + " (" + this.state.enderecoSelecionado.cidade + ", " + this.state.enderecoSelecionado.estado + ")",
                        complemento: this.state.enderecoSelecionado.complemento,
                        latitude: this.state.enderecoSelecionado.latitude,
                        longitude: this.state.enderecoSelecionado.longitude
                    };
                    let hoje = new Date().toLocaleString();
                    let dataPedido = hoje.split(" ");
                    if (this.state.IdEndereco != null && listaDeProdutos != null) {
                        if ((
                            (this.state.pagamentoSelecionado == 'Crédito' || this.state.pagamentoSelecionado == 'Débito')
                            && (
                                this.state.NomeCompletoCartao != null && this.state.NomeCompletoCartao != ""
                                && this.state.NomeCompletoCartao != null && this.state.NomeCompletoCartao != ""
                                && this.state.MesExpiracaoCartao != null && this.state.MesExpiracaoCartao != ""
                                && this.state.AnoExpiracaoCartao != null && this.state.AnoExpiracaoCartao != ""
                                && this.state.CVCcartao != null && this.state.CVCcartao != ""
                            ))
                            || this.state.pagamentoSelecionado == 'Pix'
                            || this.state.pagamentoSelecionado == 'Cartão na Hora da Entrega'
                        ) {
                            Axios.post("https://env-9048989.jelastic.saveincloud.net/api/pedidos", {
                                pedido: {
                                    listaProdutos: listaDeProdutos,
                                    cliente: {
                                        nome: this.state.usuario.nome,
                                        telefone: this.state.usuario.telefone,
                                        email: this.state.usuario.email
                                    },
                                    caminhoDaEntrega: {
                                        from: origem,
                                        to: destino
                                    },
                                    horaDeEntrega_Retirada: {
                                        horarioDoPedido: new Date().toLocaleString(),
                                    },
                                    pagamento: {
                                        tipo: this.state.pagamentoSelecionado
                                    },
                                    device: {
                                        ip_address: localStorage.getItem("ip_user"),
                                        device_id: session_id
                                    },
                                    dataPedido: dataPedido[0],
                                    idPetshop: this.state.IdPetshop,
                                    idUsuario: parseJwt().jti,
                                    idEndereco: this.state.IdEndereco,
                                    idLogistica: this.state.petshop.logistica,
                                    Distancia: this.state.distancia,
                                    Frete: this.state.precoFrete,
                                    PrecoDoProduto: PrecoDaCompra,
                                    preco: (PrecoDaCompra + this.state.precoFrete).toFixed(2),
                                    RetirarNaLoja: this.state.RetirarNaLoja
                                },
                                cartao: {
                                    number_token: this.state.NumeroCartao,
                                    cardholder_name: this.state.NomeCompletoCartao,
                                    expiration_month: this.state.MesExpiracaoCartao,
                                    expiration_year: this.state.AnoExpiracaoCartao,
                                    security_code: this.state.CVCcartao
                                }
                            }, {
                                headers: {
                                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                    'ip_usuario': localStorage.getItem("ip_user"),
                                }
                            })
                                .then(data => {
                                    if (this.state.pagamentoSelecionado == 'Pix') {
                                        this.setState({ erro: data.data.description + " Esse Código é válido apenas por 3min" })
                                        this.setState({ pixCode: data.data.additional_data.qr_code })
                                    } else {
                                        if (data.data == "Pagamento Efetuado") {
                                            this.setState({ erro: "Pagamento Efetuado" })
                                            alert("Seu pedido foi enviado");
                                            this.props.history.push('/sacola');
                                        } else {
                                            this.setState({ erro: "Transação Não Autorizada" });
                                            alert("Erro ao concluir pedido");
                                            this.refs.btn.removeAttribute("disabled");
                                        }
                                    }
                                })
                                .catch(erro => {
                                    this.setState({ erro: "Erro ao concluir pedido" });
                                    this.refs.btn.removeAttribute("disabled");
                                    alert("Erro ao concluir pedido");
                                })
                        } else {
                            this.setState({ erro: "Informações de Pagamento Incompleta" });
                            this.refs.btn.removeAttribute("disabled");
                        }
                    } else {
                        alert("Volte na home do aplicativo e selecione um endereço para entrega")
                        this.refs.btn.removeAttribute("disabled");
                    }
                } else {
                    alert("Não foi possível Concluir a Compra, O Petshop Esta Fechado")
                }
            })
    }

    mensagemDeAtualizacao = () => {
        switch (this.state.erro) {
            case "Carregando":
                return <section className="Loading"><div className="c-loader"></div></section>;
            // CSS do loading: /AtualizarLoja.css
            default:
                return <p style={{ textAlign: "center", fontWeight: "600" }}>{this.state.erro}</p>;
        }
    }

    //#region "Apis de Enderecos"
    buscarEndereco = () => {
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
            .finally(() => this.buscarPetshop())
    }

    BuscarEnderecos = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/endereco/usuario/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ enderecos: data })
                if (sessionStorage.getItem("IdEnderecoEscolhido") == null) {
                    this.setState({ enderecoSelecionado: data[0] })
                    sessionStorage.setItem("IdEnderecoEscolhido", data[0].idendereco)
                    this.listarPetshop(data[0].latitude, data[0].longitude);
                    this.listarImgProdutos(data[0].latitude, data[0].longitude);
                } else {
                    this.buscarEnderecoSelecionado();
                }
            })
            .catch(error => console.log(error))

    }

    enderecoSelecionado = (event) => {
        if (sessionStorage.getItem("IdEnderecoEscolhido") != null) {

            sessionStorage.setItem("IdEnderecoEscolhido", event.target.value)
            this.setState({ escolherEndereco: !this.state.escolherEndereco })
            this.buscarEnderecoSelecionado();
        }
    }
    //#endregion

    render() {
        return (
            <div className="EstoqueDaLoja" >
                <Helmet>
                    <script
                        type="text/javascript"
                        src={"https://h.online-metrix.net/fp/tags.js?org_id=k8vif92e&session_id=" + session_id} >
                    </script>
                </Helmet>

                {/*- - -NAV------------------------------------------------------------------------------ */}
                <nav className="Nav_Estoque_User">
                    <div className="Div_NavEstoqueImg">
                        <img src={SetaBox} className="icon_NavEstoque" onClick={() => { this.props.history.push('/home') }} />
                    </div>
                    <div className="Div_NavEstoqueH2">
                        <p>{this.state.petshop.nome}</p>
                    </div>
                </nav>

                {/*- - -HEADER----------------------------------------------------------------------------- */}
                <div className="Div_HeaderPetshop">

                    <div className="DivImg_HeaderPetshop">
                        {this.state.imgpetshop == null ? (
                            <img src={LogoRedondo} className="Img_HeaderPetshop" />
                        ) : (
                            <img src={this.state.imgpetshop.img} className="Img_HeaderPetshop" />
                        )}
                    </div>

                    <div className="Div_InfoHeaderPetshop">
                        <p className="Text_EnderecoHeaderPetshop">{this.state.petshop.endereco}</p>

                        <section className="Section_InformacoesHeaderPetshop">

                            <div className="Section_PrimeiraInfoHeaderPetshop" >
                                <div className="Primeira_InfoHeaderPetshop">
                                    <p className="Text_InfoHeaderPetshop" >{this.state.petshop.avaliacao} - </p>
                                    <img className="Icon_InfoHeaderPetshop" src={Avaliacao} />
                                </div>
                                <div className="Primeira_InfoHeaderPetshop">
                                    <img className="Icon_InfoHeaderPetshop" src={Telefone} />
                                    <p className="Text_InfoHeaderPetshop" style={{ paddingLeft: '3px' }}>{this.state.petshop.telefone}</p>
                                </div>
                            </div>


                            <div className="Section_PrimeiraInfoHeaderPetshop Section_SegundaInfoHeaderPetshop">

                                <p className="Text_InfoHeaderPetshop" >
                                    {this.state.petshop.status == true ? ("Aberto") : ("Fechado")}
                                </p>

                                <img src={circulo} className="Card_InfoPetshopIcon" />

                                <p className="Text_InfoHeaderPetshop" >
                                    {this.state.distancia}Km
                                </p>

                                <img src={circulo} className="Card_InfoPetshopIcon" />

                                <p className="Text_InfoHeaderPetshop">
                                    Frete R${this.state.precoFrete}
                                </p>
                            </div>

                        </section>

                    </div>

                </div>

                {/*- - -INPUT FILTRO DE PRODUTO----------------------------------------------------------- */}
                <div className="divInpuPesquisaProduto">
                    <input
                        className="inputBuscar"
                        placeholder="      Buscar Produto"
                        onChange={this.atualizaEstado.bind(this)}
                        type="search"
                    />
                </div>

                {/*- - -DIV FILTRO DE PRODUTO POR CATEGORIA----------------------------------------------- */}
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

                {/*- - -DIV LISTA DE PRODUTOS------------------------------------------------------------- */}
                <Titulo titulo="Produtos" />

                <div className="divTodosProdutos">
                    <div className="ListaPrateleiraDeProdutos">
                        {
                            this.state.produtosFiltrado.map(x => {
                                return (
                                    <div className="Card_InfoProduto">
                                        <div className="Card_InfoProduto_Estoque">
                                            <figure className="Card_DivImgProduto">
                                                <img src={x.imgprodutos[0].img}
                                                    className="Card_ImgProdutoEstoque"
                                                />
                                            </figure>

                                            <section className="Card_DivInfoProduto" >
                                                <p className="Text_TituloProduto"   >{x.titulo}</p>
                                                <p className="Text_DescricaoProduto">{x.descricao}</p>

                                                <div className="Card_DivPrecoCompra">

                                                    <p className="Text_PrecoProduto">{x.preco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>

                                                    {id.includes(x.idproduto) && this.state.compra === true ? (
                                                        <div className="Div_AdicionarAoCarrinho">
                                                            <button
                                                                className="btnMenos"
                                                                style={{ width: "30%" }}


                                                                onClick={() => {
                                                                    if (idprodutoEscolhido.includes(x.idproduto)) {
                                                                        this.diminuirVariavelQnt(x.idproduto)
                                                                        this.setState({ idDelete: x.idproduto })
                                                                    }
                                                                }}

                                                            ><p>-</p></button>
                                                            <input
                                                                className="quantity"
                                                                min="0"
                                                                name="form-0-quantity"
                                                                type="number"
                                                                style={{ width: "40%", textAlign: "center" }}
                                                                value={this.setValue(x.idproduto)}
                                                            />
                                                            <button
                                                                className="btnMais"
                                                                style={{ width: "30%" }}

                                                                onClick={() => {
                                                                    this.pushVariavelQnt(x.idproduto)
                                                                }}
                                                            ><p>+</p></button>
                                                        </div>
                                                    ) : (
                                                        <button className="Div_AdicionarAoCarrinho Btn_AdicionarAoCarrinho"
                                                            onClick={() => {
                                                                this.setState({ compra: true })
                                                                this.setState({ produtoClickado: x.idproduto })
                                                                id.push(x.idproduto)
                                                            }}
                                                        >
                                                            <p className="Text_ComprarProduto">Comprar</p>
                                                        </button>

                                                    )}

                                                </div>
                                            </section>
                                        </div>

                                    </div>
                                )
                            })}

                    </div>

                </div>

                {/* - - -Footer Ver Mais */}
                {this.state.compra === false ? (
                    <div></div>
                ) : (

                    this.state.eventKey === true ? (
                        <footer className="FooterListaDeCompras" onClick={() => this.eventKey()}>
                            <div className="Footer_DivIcon">
                                <img src={VerProdutos} />
                                <p>Ver Produtos</p>
                            </div>
                            <div className="Footer_PrecoCompra">
                                <p>{
                                    (PrecoDaCompra + this.state.precoFrete).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                                }
                                </p>
                            </div>
                        </footer>
                    ) : (

                        <div className="divFooterListaCompleta">
                            <div className="Title_FecharDiv" onClick={() => this.eventKey()}>
                                <figure className="Figure_SetaBoxPagamento">
                                    <img src={SetaBoxPagamento} className="Icon_SetaBoxPagamento" />
                                </figure>
                                <div className="Div_TituloBoxPagamento">
                                    <p>Voltar para loja</p>
                                </div>
                            </div>

                            <div className="div_ListaProdutosPedidos">
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>

                                    {this.state.petshop.retirarNaLoja == true ? (
                                        <div class="switch__container switch--shadow--Produtos" style={{ width: "40%", display: "flex", flexDirection: "row" }}>
                                            <p>Retirar<br></br>Na Loja</p>
                                            <input
                                                id="RetirarNaLoja"
                                                class="switch switch--shadow "
                                                type="checkbox"
                                                onChange={() => this.Change()}
                                                defaultChecked={this.state.RetirarNaLoja}
                                            />
                                            <label for="RetirarNaLoja"></label>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                </div>

                                {this.state.RetirarNaLoja == false ? (
                                    <button
                                        onClick={() => this.setState({ escolherEndereco: !this.state.escolherEndereco })}
                                        className="btn_EscolherEnderecoDeEntrega"
                                    >
                                        <div
                                            className="div_EnderecoSelecionado"
                                            style={{ alignItems: 'center', paddingTop: '8px' }}
                                        >
                                            <img src={LocalSelecionado} height="18" />
                                            <p >
                                                {localStorage.getItem("usuario-petfood") != null ? (
                                                    <strong>
                                                        {this.state.enderecoSelecionado.complemento != null ? (
                                                            <p className="p_EnderecoDeEntrega">{this.state.enderecoSelecionado.enderecoRua}, {this.state.enderecoSelecionado.numero} - {this.state.enderecoSelecionado.bairro} ({this.state.enderecoSelecionado.complemento})</p>
                                                        ) : (
                                                            <p className="p_EnderecoDeEntrega">{this.state.enderecoSelecionado.enderecoRua}, {this.state.enderecoSelecionado.numero} - {this.state.enderecoSelecionado.bairro}</p>
                                                        )}
                                                    </strong>
                                                ) : (
                                                    <strong>
                                                        {sessionStorage.getItem("endereco")}
                                                    </strong>
                                                )}
                                            </p>
                                        </div>
                                    </button>
                                ) : (
                                    <div></div>
                                )}

                                <br></br>

                                {this.state.escolherEndereco === true ? (
                                    <div className="ListaParaEscolherEndereco">
                                        {
                                            this.state.enderecos.map(x => {
                                                return (
                                                    <div className="div_SelecionarEndereco">
                                                        <input
                                                            className="inputCheckBoxEndereco"
                                                            type="radio"
                                                            id={x.idendereco}
                                                            name="scales"
                                                            value={x.idendereco}
                                                            onChange={() => {
                                                                this.setState({ enderecoSelecionado: x });
                                                                sessionStorage.setItem("IdEnderecoEscolhido", x.idendereco);
                                                                this.CalcularDistanciaUsuarioPetshop(this.state.petshop.latitude, this.state.petshop.longitude, x.latitude, x.longitude)
                                                            }}
                                                            defaultChecked={sessionStorage.getItem("IdEnderecoEscolhido") == x.idendereco ? (true) : (false)}
                                                        />
                                                        <label for={x.idendereco} className="label_CheckBoxEndereco">
                                                            {x.enderecoRua}
                                                        </label>
                                                    </div>
                                                )
                                            })}
                                    </div>
                                ) : (
                                    <div></div>
                                )
                                }
                                {/* ---------------------------------------------------------------------------------------------- */}

                                <div className="DivTituloFooter_ListaDePedidos">
                                    <div className="div_TituloQnt">
                                        <p className="Text_SubtituloResumoCompra">Qnt</p>
                                    </div>
                                    <div className="div_TitulProduto">
                                        <p className="Text_SubtituloResumoCompra">Produto</p>
                                    </div>
                                    <div className="div_TitulPreco">
                                        <p className="Text_SubtituloResumoCompra">Preço</p>
                                    </div>
                                </div>
                                {
                                    sacolaDeCompra.map(x => {
                                        // PRECO TOTAL DA COMPRA--------------------------------------------------------------
                                        let precoTotal = sacolaDeCompra.map(x => { return parseFloat(x[0].preco.replaceAll(",", ".")) })
                                        PrecoDaCompra = precoTotal.reduce(reducer1);
                                        // ---------------------------------------------------------------------------------
                                        return (
                                            <div className="FooterListaPedidos">
                                                <div className="Footer_MostrarQntPedida">
                                                    <p classNamer="Text_TextoResumoCompra">{x[0].quantidade}</p>
                                                </div>

                                                <div className="Footer_MostrarProdutosPedidos">
                                                    <p classNamer="Text_TextoResumoCompra">{x[0].produto[0].titulo}</p>
                                                </div>

                                                <div className="Footer_MostrarPrecoDoPedido">
                                                    <p classNamer="Text_TextoResumoCompra">{x[0].produto[0].preco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                <div className="FooterListaPedidos FooterListaPedidosRodape">

                                    <div className="Footer_MostrarQntPedida">
                                    </div>

                                    <div className="Footer_MostrarProdutosPedidos">
                                        <p  >Frete</p>
                                    </div>

                                    <div className="Footer_MostrarPrecoDoPedido">
                                        <p>{this.state.precoFrete.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
                                    </div>
                                </div>

                                <div className="FooterListaPedidos">

                                    <div className="Footer_MostrarQntPedida">
                                        <p ><strong>Total</strong></p>
                                    </div>

                                    <div className="Footer_MostrarProdutosPedidos">
                                    </div>

                                    <div className="Footer_MostrarPrecoDoPedido">
                                        <p><strong>{(PrecoDaCompra + this.state.precoFrete).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</strong></p>
                                    </div>
                                </div>

                                <br />
                                {/* --TelaDePagamento------------------------------ */}

                                <div className="div-formulario-getnet">

                                    <div className='Text_TituloFormaDePagamento'>
                                        <p>Formas de pagamento</p>

                                        <img src={CompraSegura} />
                                    </div>

                                    <form className="formulario-getnet">
                                        <div className="checkbox_pagamento">
                                            {
                                                this.state.pagamento.map(x => {
                                                    return (
                                                        <div className="div_SelecionarPagamento">
                                                            <input
                                                                className="inputCheckPagamento"
                                                                name="pagamento"
                                                                type="radio"
                                                                id={x}
                                                                value={x}
                                                                onChange={this.pagamentoSelecionado}
                                                                required
                                                            />
                                                            <label for={x} className="label_CheckBoxEndereco">
                                                                {x}
                                                            </label>
                                                        </div>
                                                    )
                                                })}
                                        </div>
                                        {this.state.pagamentoSelecionado == 'Crédito' || this.state.pagamentoSelecionado == 'Débito' ? (
                                            <div>
                                                <div className="form-linha">
                                                    <div className="form_NomeDoCartao">
                                                        <input
                                                            className="input_CartaoNomeCompleto"
                                                            placeholder="Nome Completo (igual no cartão)"
                                                            onChange={this.cadastroNomeCompletoGetNet}
                                                            value={this.state.NomeCompletoCartao}
                                                            minLength="5"
                                                            maxLength="35"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="form_DataExpiracaoDoCartao"    >
                                                        <input
                                                            className="input_DataExpiracao"
                                                            placeholder="MM"
                                                            onChange={this.cadastroMesGetNet}
                                                            value={this.state.MesExpiracaoCartao}
                                                            minLength="2"
                                                            maxLength="2"
                                                            required
                                                        />

                                                        <input
                                                            className="input_DataExpiracao"
                                                            placeholder="YY"
                                                            onChange={this.cadastroAnoGetNet}
                                                            value={this.state.AnoExpiracaoCartao}
                                                            minLength="2"
                                                            maxLength="2"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-linha">
                                                    <div className="form_NumeroCard">
                                                        <input
                                                            className="input_NumeroDoCartao"
                                                            placeholder="Numero do Cartão"
                                                            onChange={this.cadastroNumeroCartaoGetNet}
                                                            value={this.state.NumeroCartao}
                                                            minLength="13"
                                                            maxLength="19"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="form_CvcCard">
                                                        <input
                                                            className="input_CvcDoCartao"
                                                            placeholder="CVC"
                                                            onChange={this.cadastroCVCGetNet}
                                                            value={this.state.CVCcartao}
                                                            minLength="3"
                                                            maxLength="4"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                        ) : (
                                            this.state.pagamentoSelecionado == 'Pix' ? (
                                                <div className="form-linha">

                                                    <div className="form_NumeroCard">
                                                        <input type="text"
                                                            value={this.state.pixCode}
                                                            name="texto" id="pixCode" className='input_CartaoNomeCompleto' placeholder="Finalize a Compra Para Receber o Código Pix" />
                                                    </div>

                                                    <button type="button" onClick={() => copyToClipboard()} style={{
                                                        width: '20%',
                                                        height: '30px',
                                                        borderRadius: '10px',
                                                    }}>Copiar</button>

                                                </div>
                                            ) : (<div></div>)
                                        )}

                                        <div className="div_submitForm">
                                            {
                                                localStorage.getItem("usuario-petfood") ? (
                                                    <button
                                                        type="button"
                                                        className="btn_PagarPedido"
                                                        ref="btn"
                                                        onClick={() => this.concluirPedido()}
                                                    >
                                                        Finalizar Compra
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="btn_PagarPedido"
                                                        ref="btn"
                                                        onClick={() => alert("Funcionalidade Para Usuario Logado")}
                                                    >
                                                        Finalizar Compra
                                                    </button>
                                                )}
                                        </div>
                                        {this.mensagemDeAtualizacao()}
                                    </form>
                                    <br></br>
                                </div>

                            </div>
                        </div>
                    )
                )}

                <Footer />
            </div >
        );
    }
}

export default EstoqueDaLoja;