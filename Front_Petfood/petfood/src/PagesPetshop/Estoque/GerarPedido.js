import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { parseJwt } from './../../services/auth.js';
import Axios from 'axios';
import './Estoque';
import '../../PagesCliente/EstoqueDaLoja/EstoqueDaLoja.css';

import HeaderPetshop from '../../Component/Petshop/NavPetshop/NavPetshopHome';
import CarrinhoDeCompra from '../../Assets/cart.svg';
import CompraSegura from '../../Assets/Detalhes/SeloCompraSegura.png';

var geolocator = require("geolocator");

let idprodutoEscolhido = [];
let sacolaDeCompra = [];
var pedido = [];
let id = [];
let PrecoDaCompra = 0;
let ListaProdutos = [];

var ip;
const reducer1 = (accumulator, currentValue) => accumulator + currentValue;

function salvarIp(retorno) {
    ip = retorno;
}

function copyToClipboard() {
    var copyText = document.getElementById("pixCode");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
}

class GerarPedidoPetshop extends Component {

    constructor() {
        super();
        this.state = {
            Petshop: {},
            Produtos: [],
            ProdutosFiltrados: [],
            buscar: "",
            precoFrete: 0.0,
            precoFrete1: 0.0,
            distancia: 0.0,
            endereco: {},
            idUsuario: 0,
            cadastrado: ["Usuario Cadastrado", "Novo Usuario"],
            tipoUserSelecionado: "",
            email: "",
            nome: "",
            telefone: "",
            cpf: "",
            usuario: {},
            dispositivo: "",
            erro: "",
            endereco: "",
            numero: null,
            cep: null,
            cidade: null,
            estado: null,
            bairro: null,
            complemento: null,
            latitude: "",
            longitude: "",
            idEndereco: 0,
            pagamentoSelecionado: null,
            pagamento: ['Pix','Débito/Crédito por link'],
            enderecosDoUsuario: [],
            pixCode: "Finalize a Compra Para Receber o Código Pix",
        }
    }

    pagamentoSelecionado = (event) => {
        this.setState({ pagamentoSelecionado: event.target.value })
    }

    //#region  "Filtro de Produtos"
    atualizaEstado(event) {
        this.setState({ buscar: event.target.value }, () => {
            this.FiltrarProdutos();
        })
    }

    FiltrarProdutos() {
        let listaFiltrada = this.state.Produtos;
        if (this.state.buscar != "") {

            listaFiltrada = listaFiltrada.filter(
                x =>
                    x.titulo.toLowerCase().includes(this.state.buscar.toLowerCase())
            );
        }
        this.setState({ ProdutosFiltrados: listaFiltrada });
    }
    //#endregion
    //#region "Quantidade De Produtos Pedidos"
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
        var produto = this.state.Produtos.filter(x => x.idproduto == id);

        var precox = produto[0].preco * quantidade;
        var preco = precox.toFixed(2);
        const sacola1 = { produto, quantidade, preco };
        const set1 = new Set([sacola1]);
        const final1 = [...set1];
        let array = contadorDeElementos.findIndex(x => x === id)
        if (filtro.length >= 1) {
            sacolaDeCompra.splice(array, 1, final1);
            console.log(sacolaDeCompra);
            this.setValorFrete();
        } else {
            sacolaDeCompra.splice(array, 1);
            console.log(sacolaDeCompra);
            this.setValorFrete();
        }

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

        var produto = this.state.Produtos.filter(x => x.idproduto == id);

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
        console.log(sacolaDeCompra);

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
    //#endregion

    PrecoFrete = () => {
        var result = geolocator.calcDistance({
            from: {
                latitude: this.state.Petshop.latitude,
                longitude: this.state.Petshop.longitude
            },
            to: {
                latitude: this.state.latitude,
                longitude: this.state.longitude
            },
            formula: geolocator.DistanceFormula.HAVERSINE,
            unitSystem: geolocator.UnitSystem.METRIC
        });
        this.setState({ distancia: result.toFixed(1) });
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
                if (this.state.Petshop.logistica == 2) {
                    this.setState({ precoFrete: 0 });
                    this.setState({ precoFrete1: 0 });
                } else {
                    this.setState({ precoFrete: frete.preco });
                    this.setState({ precoFrete1: frete.preco });
                }
            })
            .catch(error => console.log(error))
    }
    //#region "Component Did Mount"
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
    BuscarPetshop = () => {
        let sacolaDeCompra = [];
        fetch('https://env-9048989.jelastic.saveincloud.net/api/petshop/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => this.setState({ Petshop: data[0] }))
            .catch(error => console.log(error))
    }

    listarProdutosDoPetshop = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/produtos/petshop/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => this.setState({ Produtos: data }) + this.setState({ ProdutosFiltrados: data }))
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.BuscarPetshop();
        this.listarProdutosDoPetshop();
        this.freteGratis();
        this.nomeDoDispositivo();
        idprodutoEscolhido = [];
        sacolaDeCompra = [];
        pedido = [];
        id = [];
        PrecoDaCompra = 0;
        ListaProdutos = [];
    }
    //#endregion

    concluirPedido = (event) => {
        this.refs.btnCompra.setAttribute("disabled", "disabled");
        this.setState({ erro: "Carregando" })
        ListaProdutos = [];
        fetch('https://env-9048989.jelastic.saveincloud.net/api/petshop/status=' + parseJwt().jti, {
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
                        console.log("ListaProdutos", ListaProdutos);
                    })

                    const listaDeProdutos = [...new Set(ListaProdutos)];

                    const origem = {
                        endereco: this.state.Petshop.endereco,
                        petshop: this.state.Petshop.nome,
                        latitude: this.state.Petshop.latitude,
                        longitude: this.state.Petshop.longitude
                    };
                    const destino = {
                        endereco: JSON.parse(sessionStorage.getItem("enderecoCliente")).endereco + ', ' + JSON.parse(sessionStorage.getItem("enderecoCliente")).numero + " - " + JSON.parse(sessionStorage.getItem("enderecoCliente")).bairro + " (" + JSON.parse(sessionStorage.getItem("enderecoCliente")).cidade + ", " + JSON.parse(sessionStorage.getItem("enderecoCliente")).estado + ")",
                        complemento: JSON.parse(sessionStorage.getItem("enderecoCliente")).complemento,
                        latitude: JSON.parse(sessionStorage.getItem("enderecoCliente")).latitude,
                        longitude: JSON.parse(sessionStorage.getItem("enderecoCliente")).longitude
                    };
                    let hoje = new Date().toLocaleString();
                    let dataPedido = hoje.split(" ");
                    if (this.state.idEndereco != null && listaDeProdutos != null) {
                        if (
                            this.state.pagamentoSelecionado == 'Pix'
                            || this.state.pagamentoSelecionado == 'Débito/Crédito por link'
                        ) {
                            Axios.post("https://env-9048989.jelastic.saveincloud.net/api/pedidos", {
                                pedido: {
                                    listaProdutos: listaDeProdutos,
                                    cliente: {
                                        nome: this.state.nome,
                                        telefone: this.state.telefone,
                                        email: this.state.email
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
                                        ip_address: null,
                                        device_id: null
                                    },
                                    dataPedido: dataPedido[0],
                                    idPetshop: parseJwt().jti,
                                    idUsuario: this.state.idUsuario,
                                    idEndereco: this.state.idEndereco,
                                    idLogistica: this.state.Petshop.logistica,
                                    Distancia: this.state.distancia,
                                    Frete: this.state.precoFrete,
                                    PrecoDoProduto: PrecoDaCompra,
                                    preco: (PrecoDaCompra + this.state.precoFrete).toFixed(2),
                                    RetirarNaLoja: false
                                },
                                cartao: {
                                    number_token: null,
                                    cardholder_name: null,
                                    expiration_month: null,
                                    expiration_year: null,
                                    security_code: null
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
                                        console.log(data);
                                        this.setState({ erro: data.data.description + " Esse Código é válido apenas por 3min" })
                                        this.setState({ pixCode: data.data.additional_data.qr_code })
                                        // this.setState({ erro: "Pagamento Efetuado" })
                                        alert("Seu pedido foi enviado");
                                    } else {
                                        if (data.data == "Pagamento Efetuado") {
                                            this.setState({ erro: "Pagamento Efetuado" })
                                            alert("Seu pedido foi enviado");
                                        } else {
                                            this.setState({ erro: "Transação Não Autorizada" });
                                            alert("Erro ao concluir pedido");
                                            this.refs.btnCompra.removeAttribute("disabled");
                                        }
                                    }
                                })
                                .catch(erro => {
                                    this.setState({ erro: "Erro ao concluir pedido" });
                                    this.refs.btnCompra.removeAttribute("disabled");
                                    alert("Erro ao concluir pedido");
                                })
                        } else {
                            this.setState({ erro: "Informações de pagamento não informada" });
                            this.refs.btnCompra.removeAttribute("disabled");
                        }
                    } else {
                        alert("Volte na home do aplicativo e selecione um endereço para entrega")
                        this.refs.btnCompra.removeAttribute("disabled");
                    }
                } else {
                    alert("Não foi possível Concluir a Compra, O Petshop Esta Fechado")
                }
            })
    }

    tipoUserSelecionado = (x) => {
        this.setState({ tipoUserSelecionado: x });
    }

    //#region "Cadastrar Usuario"
    cadastroEmail = (event) => { this.setState({ email: event.target.value.replace(/\s/g, '').toLowerCase() }) }
    cadastroNome = (event) => { this.setState({ nome: event.target.value }) }
    cadastroTelefone = (event) => { this.setState({ telefone: event.target.value }) }
    cadastroCpf = (event) => { this.setState({ cpf: event.target.value.replace(/\s/g, '') }) }
    validarCpf = (strCPF) => {
        var Soma;
        var Resto;
        let i;
        Soma = 0;
        if (strCPF == "00000000000") return false;

        for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(strCPF.substring(9, 10))) return false;

        Soma = 0;
        for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(strCPF.substring(10, 11))) return false;
        return true;
    }

    nomeDoDispositivo = () => {
        var uagent = navigator.userAgent.toLowerCase();
        this.setState({ dispositivo: uagent });

        geolocator.getIP(function (err, result) {
            if (result != null) {
                salvarIp(result.ip);
            }
        });
    }

    setEndereco = (event) => { this.setState({ endereco: event.target.value }) }
    setNumero = (event) => { this.setState({ numero: event.target.value }) }
    setCep = (event) => { this.setState({ cep: event.target.value }) }
    setCidade = (event) => { this.setState({ cidade: event.target.value }) }
    setEstado = (event) => { this.setState({ estado: event.target.value }) }
    setBairro = (event) => { this.setState({ bairro: event.target.value }) }
    setComplemento = (event) => { this.setState({ complemento: event.target.value }) }

    efetuarCadastro = (event) => {
        event.preventDefault();
        this.refs.btn.setAttribute("disabled", "disabled");

        var CpfFoiValidado = this.validarCpf(this.state.cpf);
        if (CpfFoiValidado == true) {
            if (this.state.email.includes("@") & this.state.email.includes(".")) {
                Axios.post("https://env-9048989.jelastic.saveincloud.net/api/usuario", {
                    email: this.state.email.toLowerCase(),
                    senha: this.state.cpf,
                    nome: this.state.nome.trim(),
                    telefone: this.state.telefone.trim(),
                    cpf: this.state.cpf,
                    termos: {
                        data: (new Date()).toLocaleString(),
                        ipDoUsuario: ip,
                        navegadorDoUsuario: this.state.dispositivo,
                    }
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'ip_usuario': ip,
                    }
                })
                    .then(data => {
                        console.log(data)
                        this.setState({ erro: "Usuario Cadastrado" })
                        this.setState({ idUsuario: data.data })

                        fetch("https://env-9048989.jelastic.saveincloud.net/api/localizacao?numero=" + this.state.numero + "&endereco=" + this.state.endereco + "&bairro=" + this.state.bairro + "&cidade=" + this.state.cidade + "&estado=" + this.state.estado + "&cep=" + this.state.cep, {
                            headers: {
                                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                        })
                            .then(response => response.json())
                            .then(data => {
                                this.setState({ latitude: data.results[0].geometry.location.lat })
                                this.setState({ longitude: data.results[0].geometry.location.lng })

                                if (data.status == "OK") {
                                    Axios.post("https://env-9048989.jelastic.saveincloud.net/api/endereco/", {
                                        enderecoRua: this.state.endereco,
                                        numero: this.state.numero,
                                        cep: this.state.cep,
                                        cidade: this.state.cidade,
                                        bairro: this.state.bairro,
                                        estado: this.state.estado,
                                        complemento: this.state.complemento,
                                        latitude: this.state.latitude,
                                        longitude: this.state.longitude,
                                        idusuario: this.state.idUsuario
                                    }, {
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                            'ip_usuario': ip,
                                        }
                                    }).then(response => {
                                        this.setState({ erro: "Endereço Cadastrado Com Sucesso" })
                                        if (response.status === 200) {
                                            this.setState({ erro: "Cadastro Efetuado" });
                                            this.setState({ idEndereco: response.data });
                                            console.log(response);
                                            this.PrecoFrete();

                                        } else {
                                            this.setState({ erro: "Erro ao Cadastrar" });
                                        }
                                    })
                                        .catch(error => {
                                            this.refs.btn.removeAttribute("disabled");
                                        })
                                }
                                else {
                                    this.setState({ erro: "Erro ao Cadastrar" });
                                    this.refs.btn.removeAttribute("disabled");
                                }
                            })
                            .catch(error => {
                                this.setState({ erro: "Erro ao Cadastrar" })
                                this.refs.btn.removeAttribute("disabled")
                            })
                    })
                    .catch(erro => {
                        console.log(erro.response)
                        this.setState({ erro: erro.response.data })
                        this.refs.btn.removeAttribute("disabled");
                    })
            } else {
                this.setState({ erro: "E-mail inválido" });
                this.refs.btn.removeAttribute("disabled");
            }
        } else {
            this.setState({ erro: "Cpf inválido" });
            this.refs.btn.removeAttribute("disabled");
        }
    }

    //#endregion

    buscarUser = (event) => {
        event.preventDefault();
        fetch('https://env-9048989.jelastic.saveincloud.net/api/usuario/cpf?cpf=' + this.state.cpf, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then((data) => {
                this.setState({ idUsuario: data.idusuario });
                this.setState({ email: data.email });
                this.setState({ nome: data.nome });
                this.setState({ telefone: data.telefone });
                this.setState({ erro: "Usuário " + data.nome + " encontrado" });
                this.buscarEnderecos()
            })
            .catch(error => {
                this.setState({ erro: "Usuário não encontrado" });
            })
    }

    buscarEnderecos = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/endereco/Usuario/' + this.state.idUsuario, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then((data) => {
                this.setState({ enderecosDoUsuario: data });
            })
            .catch(error => {
                this.setState({ erro: "Usuário não encontrado" });
            })
    }

    enderecoSelecionado = (endereco) => {
        this.setState({ idEndereco: endereco.idendereco });
        this.setState({ endereco: endereco.enderecoRua });
        this.setState({ bairro: endereco.bairro });
        this.setState({ cep: endereco.cep });
        this.setState({ cidade: endereco.cidade });
        this.setState({ estado: endereco.estado });
        this.setState({ complemento: endereco.complemento });
        this.setState({ numero: endereco.numero });
        this.setState({ latitude: endereco.latitude });
        this.setState({ longitude: endereco.longitude });
        this.PrecoFrete();
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

    componentDidCatch() {
        alert("Error");
    }

    render() {
        return (
            <div className="GerarPedidoPetshop_Tela">

                <HeaderPetshop Titulo="Gerar Pedido" CadastrarProduto={true} />

                <div className='div_GerarPedido'>

                    <div className="div_CriarUsuario">
                        <div>
                            <div className="Select_GerarPedido">
                                {
                                    this.state.cadastrado.map(x => {
                                        return (
                                            <div>
                                                <input
                                                    className="inputCheckPagamento"
                                                    name="pagamento"
                                                    type="radio"
                                                    id={x}
                                                    value={x}
                                                    onChange={() => this.tipoUserSelecionado(x)}
                                                    required
                                                />
                                                <label for={x} className="label_CheckBoxEndereco">
                                                    {x}
                                                </label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            {this.state.tipoUserSelecionado == "Novo Usuario" ? (
                                <form onSubmit={this.efetuarCadastro} className="Form_UsuarioGerarPedido">
                                    <h4>Cliente</h4>
                                    <input
                                        required
                                        onChange={this.cadastroNome}
                                        value={this.state.nome}
                                        minLength="5"
                                        maxLength="100"
                                        placeholder="Nome Completo"
                                    />
                                    <input
                                        placeholder="Email"
                                        onChange={this.cadastroEmail}
                                        value={this.state.email}
                                        maxLength="90"
                                        minLength="8"
                                        required
                                    />
                                    <input
                                        placeholder="CPF"
                                        type="tel"
                                        onChange={this.cadastroCpf}
                                        value={this.state.cpf}
                                        minLength="11"
                                        maxLength="11"
                                        required
                                        pattern="[0-9]+$"
                                    />
                                    <input
                                        placeholder="Telefone"
                                        type="tel"
                                        onChange={this.cadastroTelefone}
                                        value={this.state.telefone}
                                        minLength="8"
                                        required
                                        pattern="[0-9]+$"
                                    />

                                    <h4>Endereço</h4>

                                    <input
                                        required
                                        onChange={this.setEndereco}
                                        value={this.state.endereco}
                                        minLength="5"
                                        maxLength="90"
                                        placeholder="Endereço"
                                    />
                                    <input
                                        required
                                        placeholder="Numero"
                                        type="number"
                                        onChange={this.setNumero}
                                        value={this.state.numero}
                                        maxLength="9"
                                    />
                                    <input
                                        required
                                        placeholder="Bairro"
                                        type="text"
                                        onChange={this.setBairro}
                                        value={this.state.bairro}
                                        maxLength="90"
                                    />
                                    <input
                                        required
                                        placeholder="Cep"
                                        type="tel"
                                        onChange={this.setCep}
                                        value={this.state.cep}
                                        minLength="8"
                                        maxLength="9"
                                    />
                                    <input
                                        required
                                        placeholder="Estado"
                                        type="text"
                                        onChange={this.setEstado}
                                        value={this.state.estado}
                                        maxLength="2"
                                    />
                                    <input
                                        required
                                        placeholder="Cidade"
                                        type="text"
                                        onChange={this.setCidade}
                                        value={this.state.cidade}
                                        maxLength="75"
                                    />
                                    <input
                                        required
                                        placeholder="Complemento"
                                        type="text"
                                        onChange={this.setComplemento}
                                        value={this.state.complemento}
                                        maxLength="255"
                                    />

                                    <p>{this.state.erro}</p>
                                    <button type="submit" ref="btn">Enviar</button>
                                </form>
                            ) : (
                                this.state.tipoUserSelecionado == "Usuario Cadastrado" ? (
                                    <form onSubmit={this.buscarUser} style={{ display: 'flex', flexDirection: "column", alignItems: "center" }}>
                                        <h4>Cliente</h4>
                                        <input
                                            required
                                            placeholder="CPF do Usuario"
                                            type="text"
                                            onChange={this.cadastroCpf}
                                            value={this.state.cpf}
                                            maxLength="75"
                                            style={{ width: "80vw" }}
                                        />
                                        <button type="submit" ref="btn">Enviar</button>
                                        <p>{this.state.erro}</p>

                                        {
                                            this.state.enderecosDoUsuario.count != 0 ? (
                                                <div>
                                                    <h4>Endereços</h4>

                                                    {this.state.enderecosDoUsuario.map(x => {
                                                        return (
                                                            <div >
                                                                <input
                                                                    className="inputCheckPagamento"
                                                                    name="enderecos"
                                                                    type="radio"
                                                                    id={x.idendereco}
                                                                    value={x.idendereco}
                                                                    onChange={() => this.enderecoSelecionado(x) + sessionStorage.setItem('enderecoCliente', JSON.stringify(x))}

                                                                    required
                                                                />
                                                                <label for={x.idendereco} style={{ fontSize: "large" }}>
                                                                    {x.enderecoRua}
                                                                </label>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ) : (<div></div>)
                                        }
                                    </form>
                                ) : (<div></div>)
                            )}
                        </div>
                    </div>


                    <div className="divTodosProdutos">
                        <div className="inputBusca">
                            <br></br>
                            <input
                                className="inputBuscar"
                                placeholder="Buscar Produto"
                                onChange={this.atualizaEstado.bind(this)}
                                type="search"
                            ></input>

                            <br></br>
                        </div>

                        <div className="ListaPrateleiraDeProdutos">
                            {
                                this.state.ProdutosFiltrados.map(x => {
                                    return (
                                        <div className="CardProduto_GerarPedidoPetshop" >
                                            <div className="Card_InfoProduto_Estoque"
                                                style={{ backgroundColor: "white" }}
                                            >
                                                <figure className="Card_DivImgProduto">
                                                    <img src={x.imgprodutos[0].img}
                                                        className="Card_ImgProdutoEstoque"
                                                    />
                                                </figure>

                                                <section className="Card_DivInfoProdutoGerarPedido"
                                                    style={{ textAlign: "center", height: "100%" }}
                                                >
                                                    <p className="Text_TituloProduto"   >{x.titulo}</p>

                                                    <div className="Card_DivPrecoCompraGerarPedido">

                                                        <p className="Text_PrecoProduto"><strong>{x.preco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</strong></p>

                                                        {id.includes(x.idproduto) && this.state.compra === true ? (
                                                            <div className="divDeAdicionarAoCarrinho">
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
                                                            <button className="btnDeAdicionarAoCarrinho"
                                                                onClick={() => {
                                                                    this.setState({ compra: true })
                                                                    this.setState({ produtoClickado: x.idproduto })
                                                                    id.push(x.idproduto)
                                                                }}
                                                            >
                                                                <img src={CarrinhoDeCompra} />
                                                            </button>

                                                        )}
                                                    </div>
                                                </section>
                                            </div>


                                        </div>
                                    )
                                })}
                        </div>

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
                                    this.state.pagamentoSelecionado == 'Pix' ||  this.state.pagamentoSelecionado == 'Débito/Crédito por link' ? (
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
                                    <button
                                        type="button"
                                        className="btn_PagarPedido"
                                        ref="btnCompra"
                                        onClick={() => this.concluirPedido()}
                                    >
                                        Finalizar Compra
                                    </button>
                                </div>
                                {this.mensagemDeAtualizacao()}
                            </form>
                            <br></br>
                        </div>

                    </div>

                </div>

            </div>
        );
    }
}

export default GerarPedidoPetshop;