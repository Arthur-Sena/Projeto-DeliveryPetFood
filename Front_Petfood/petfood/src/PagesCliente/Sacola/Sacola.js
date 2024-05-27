import React, { Component } from 'react';
import { parseJwt } from '../../services/auth';
import { Link } from "react-router-dom";
import Axios from 'axios';
import SetaBox from '../../Assets/Icons/SetaInBox.svg';
import preco from '../../Assets/Icons/preco.svg';
import calendario from '../../Assets/Icons/calendario.svg';
import Footer from '../../Component/Cliente/FooterCliente/Footer';

//Css + images
import './Sacola.css';

import Seta from '../../Assets/chevron-left.svg';
import Enter from '../../Assets/check.svg';

let ProdutosPedidos = [];
var ListUltimos;

let context, oscillator, contextGain = 0;

function start() {
    let context = new AudioContext(),
        oscillator = context.createOscillator(),
        contextGain = context.createGain();

    oscillator.type = 'sine';
    oscillator.connect(contextGain);
    contextGain.connect(context.destination);
    oscillator.start(0);
    contextGain.gain.exponentialRampToValueAtTime(
        0.00001, context.currentTime + 2
    )
}

function copyToClipboard() {
    var copyText = document.getElementById("pixCode");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
}

class Sacola extends Component {

    constructor() {
        super();
        this.state = {
            mensagens: [],
            mensagensEntregador: [],
            UltimosPedidos: [],
            qntProdutos: [],
            notaPetshop: 3,
            notaEntregador: 3,
            novaMensagem: null,
            quantidadeDeMensagemNova: 0,
            quantidadeDeMensagemNovaEntregador: 0,
            idUsuario: parseJwt().jti,
            btnClicado: false,
        }
    }

    listarUltimosPedidosLooping = () => {
        ListUltimos = setInterval(() => this.listarUltimosPedidos(), 10000);
    }

    listarUltimosPedidos = () => {
        let autorizacao = localStorage.getItem("usuario-petfood");
        if (autorizacao != null) {
            fetch('https://env-9048989.jelastic.saveincloud.net/api/pedidos/emandamento/usuario/' + parseJwt().jti, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    this.setState({ UltimosPedidos: data.reverse() });
                    for (var i = 0; i <= data.length; i++) {
                        var arrayDeId = [];
                        var idpedido = data[i].id;
                        var produtos = data[i].listaProdutos;
                        var sacola = { idpedido, produtos };
                        var set = new Set([sacola]);
                        var final = [...set];
                        ProdutosPedidos.push(final);
                    }
                })
                .catch(error => console.log(error))
        } else {
            clearInterval(ListUltimos);
        }
    }

    componentDidMount() {
        localStorage.removeItem('idPedido')
        this.listarUltimosPedidos();
        this.novasMensagens();
        this.contarNovasMensagens();
        this.listarUltimosPedidosLooping();
        this.contarNovasMensagensEntregador();
        this.novasMensagensEntregador();
    }

    avaliarPetshop = (event) => {
        this.setState({ notaPetshop: event.target.value })
    }
    avaliarEntregador = (event) => {
        this.setState({ notaEntregador: event.target.value })
    }

    EnviarAvaliação = (idPetshop, idMotoboy, idPedido) => {
        Axios.put("https://env-9048989.jelastic.saveincloud.net/api/avaliacao/" + idPetshop + "?Nota=" + this.state.notaPetshop, {}, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })

        Axios.put("https://env-9048989.jelastic.saveincloud.net/api/avaliacaomotoboy/" + idMotoboy + "?Nota=" + this.state.notaEntregador, {}, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })

        Axios.put("https://env-9048989.jelastic.saveincloud.net/api/pedidos/Avaliado", {
            id: idPedido,
        }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
    }

    novasMensagens = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/chat/NCliente?idUsuario=' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ mensagens: data });
            })
            .catch(error => console.log(error))
    }

    contarNovasMensagens = () => {
        let autorizacao = localStorage.getItem("usuario-petfood");
        if (autorizacao != null && this.state.idUsuario != null) {
            var novasMensagens = setInterval(() => fetch('https://env-9048989.jelastic.saveincloud.net/api/chat/NCliente/Count?idUsuario=' + this.state.idUsuario, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    this.setState({ qntMensagens: data });
                    if (this.state.qntMensagens != this.state.mensagens.length) {
                        this.novasMensagens();
                    }
                })
                .catch(error => clearInterval(novasMensagens)), 3000)
        } else {
            clearInterval(novasMensagens);
            clearInterval(0);
            clearInterval(1);
            clearInterval(2);
            clearInterval(3);
        }
        if (this.state.qntMensagens != this.state.mensagens.length) {
            this.novasMensagens();
        }
    }

    verificarNovaMensagem = (id) => {
        const novaMensagem = this.state.mensagens.filter(x => {
            return x.idUsuario == id;
        });
        if (novaMensagem.length != 0) {
            if (this.state.quantidadeDeMensagemNova != novaMensagem.length) {
                start();
                this.setState({ quantidadeDeMensagemNova: novaMensagem.length });
            }
            return novaMensagem.length + " Novas"
        } else {
            return ""
        }
    }

    CancelarPedido = (id) => {
        if (this.state.btnClicado == false) {
            this.setState({ btnClicado: true })

            Axios.put("https://env-9048989.jelastic.saveincloud.net/api/pedidos/CanceladoPeloCliente", {
                Id: id
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'ip_usuario': localStorage.getItem("ip_user"),
                },
            })
                .then(response => {
                    this.setState({ btnClicado: false })
                    this.setState({ QntPedidosEmAndamento: this.state.QntPedidosEmAndamento - 1 });
                    window.location.reload();
                })
                .catch(error => this.setState({ btnClicado: false }))
        }
    }

    novasMensagensEntregador = () => {
        fetch('https://env-9048989.jelastic.saveincloud.net/api/ChatMotoboyUsuario/NCliente?idUsuario=' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ mensagensEntregador: data });
            })
            .catch(error => console.log(error))
    }
    contarNovasMensagensEntregador = () => {
        let autorizacao = localStorage.getItem("usuario-petfood");
        if (autorizacao != null && this.state.idUsuario != null) {
            var novasMensagensEntregador = setInterval(() => fetch('https://env-9048989.jelastic.saveincloud.net/api/ChatMotoboyUsuario/NCliente/Count?idUsuario=' + this.state.idUsuario, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    this.setState({ qntMensagens: data });
                    if (this.state.qntMensagens != this.state.mensagensEntregador.length) {
                        this.novasMensagensEntregador();
                    }
                })
                .catch(error => clearInterval(novasMensagensEntregador)), 4000)
        } else {
            clearInterval(novasMensagensEntregador);
            clearInterval(0);
            clearInterval(1);
            clearInterval(2);
            clearInterval(3);
        }
        if (this.state.qntMensagensEntregador != this.state.mensagensEntregador.length) {
            this.novasMensagensEntregador();
        }
    }

    verificarNovaMensagemEntregador = (id) => {
        const novaMensagemEntregador = this.state.mensagensEntregador.filter(x => {
            return x.idUsuario == id;
        });
        if (novaMensagemEntregador.length != 0) {
            if (this.state.quantidadeDeMensagemNovaEntregador != novaMensagemEntregador.length) {
                this.setState({ quantidadeDeMensagemNovaEntregador: novaMensagemEntregador.length });
                start();
            }
            return novaMensagemEntregador.length + " Novas"
        } else {
            return ""
        }
    }

    CompararHora = (x, id) => {
        var momento = Date.now();
        var expiracao = new Date(x);
        var diferenca = new Date(expiracao - momento);
        if (diferenca.getUTCMinutes() >= 3) {
            return (
                <button type="button"
                    onClick={() => this.gerarNovoPix(id)}
                    style={{
                        width: '20%',
                        height: '30px',
                        borderRadius: '10px',
                    }}
                >
                    Novo Código
                </button>
            )
        } else {
            return null
        }
    }

    gerarNovoPix = (id) => {
        Axios.post("https://env-9048989.jelastic.saveincloud.net/api/pagamento/getnet/pix?idPedido=" + id, {}, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'ip_usuario': localStorage.getItem("ip_user"),
            },
        })
            .then(response => {
                window.location.reload();
            })
            .catch(error => console.log("errado"))
    }
    render() {
        return (
            <div className="Sacola" >
                <nav className="Nav_Estoque_User">
                    <div className="Div_NavEstoqueImg">
                        <img src={SetaBox} className="icon_NavEstoque" onClick={() => { this.props.history.push('/home') }} />
                    </div>
                    <div className="Div_NavSacolaH2">
                        <p style={{ textAlign: 'center' }}>Meus Pedidos</p>
                    </div>
                </nav>

                <div className="DivPai_ReturnUltimosPedidos">
                    {this.state.UltimosPedidos.map(x => {
                        let data = x.horaDeEntrega_Retirada.horarioDoPedido.split(" ");
                        return (
                            <div className="Div_SacolaInformacoesDoPedido">
                                <div className='Div_SacolaBoxPedido' >
                                    <Link to="/ProdutosComprados"
                                        onClick={() => { sessionStorage.setItem("idPedido", x.id) }}
                                        style={{ textDecoration: "none" }}
                                        className="div_FirstInformacoesDoPedido"
                                    >
                                        <div className="Div_SacolaInformacoesDeEntregaPedido">
                                            <div className="Div_SacolaInformacaoNomePetshop">
                                                <p className="P_SacolaInformacaoNomePetshop">{x.caminhoDaEntrega.from.petshop}</p>
                                                <div className="Div_SacolaPrecoDataPedido">
                                                    <div className="flexrow">
                                                        <img src={preco} height="10px" />
                                                        <p>R${x.preco.toFixed(2)}</p>
                                                    </div>
                                                    <div className="flexrow">
                                                        <img src={calendario} height="10px" />
                                                        <p>{data[1].substr(0, 5).replace(":", "h")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='divText'>
                                                <p><strong>De:</strong> {x.caminhoDaEntrega.from.endereco}</p>
                                                <p><strong>Para: </strong>{x.caminhoDaEntrega.to.endereco}</p>
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="div_statusPedido">
                                        {
                                            x.status == "Em Analise" ? (
                                                <div >
                                                    <div className='divStatus' style={{ backgroundColor: '#FF8700' }}>
                                                        <p>Pendente</p>
                                                    </div>
                                                    <div className="subdiv_StatusPedido">

                                                        <button
                                                            className="Btn_CancelarPedidoCliente"
                                                            onClick={() => {
                                                                const r = window.confirm("Tem certeza que quer cancelar o pedido?");
                                                                if (r == true) {
                                                                    this.CancelarPedido(x.id);
                                                                }
                                                            }}
                                                        >
                                                            <spam><strong>Cancelar<br></br>Pedido</strong></spam>
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                x.status == 'Entregue' || x.status == 'Aceito' || x.status == 'Entregando..' || x.status == "Preparando Entrega" ? (
                                                    <div >
                                                        <div className='divStatus' style={{ backgroundColor: '#04E762' }}>
                                                            <p>{x.status == 'Entregando..' ? ("A caminho") : (x.status)}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div >
                                                        <div className='divStatus' style={{ backgroundColor: '#FF2226' }}>
                                                            <p>{x.status}</p>
                                                        </div>
                                                    </div>
                                                )
                                            )

                                        }
                                    </div>
                                </div>
                                {x.pagamento.tipo == "Pix" && x.status == "Aguardando Pagamento" ? (
                                    <div>
                                        <p style={{ textAlign: "center" }}><strong>Código Pix</strong></p>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <div className="form_NumeroCard" >
                                                <input type="text"
                                                    value={x.pagamento.informacoes.pix.additional_data.qr_code}
                                                    name="texto" id="pixCode" className='input_CartaoNomeCompleto' placeholder={x.pagamento.informacoes.pix.additional_data.qr_code} />
                                            </div>

                                            <button type="button" onClick={() => copyToClipboard()} style={{
                                                width: '20%',
                                                height: '30px',
                                                borderRadius: '10px',
                                            }}>Copiar</button>

                                            {this.CompararHora(x.pagamento.informacoes.pix.additional_data.expiration_date_qrcode, x.id)}

                                        </div>
                                    </div>
                                ) : (<div></div>)}
                                {x.status != "Entregue" ? (
                                    <div className="div_LinkChat">
                                        <button className="btn_LinkChat"
                                            onClick={() => {
                                                sessionStorage.setItem("idPetshop_Chat", x.idPetshop);
                                                this.props.history.push('/ChatCliente');
                                            }}
                                        >
                                            <p >Chat Com Petshop</p>
                                            <p style={{
                                                fontSize: "14px",
                                                fontFamily: "bolder",
                                                textAlign: "right",
                                                color: "rgb(110, 110, 110)"
                                            }}>{this.verificarNovaMensagem(x.idPetshop)}</p>
                                        </button>

                                        {x.status == "Entregando.." || x.status == "Preparando Entrega" ? (
                                            <button className="btn_LinkChat"
                                                onClick={() => {
                                                    sessionStorage.setItem("idEntregador_Chat", x.idMotoboy);
                                                    this.props.history.push('/ChatClienteEntregador');
                                                }}
                                            >
                                                <p >Chat Com Entregador</p>
                                                <p style={{
                                                    fontSize: "12px",
                                                    fontFamily: "bolder",
                                                    textAlign: "right",
                                                    color: "rgb(110, 110, 110)"
                                                }}>{this.verificarNovaMensagemEntregador(x.idMotoboy)}</p>
                                            </button>
                                        ) : (<div></div>)}
                                    </div>
                                ) : (
                                    <form className="div_AvaliarEntrega" onSubmit={() => {
                                        this.EnviarAvaliação(x.idPetshop, x.idMotoboy, x.id)
                                    }}>
                                        <p style={{ color: 'black', fontStyle: 'normal', fontWeight: '600', fontSize: '12px' }}>Avaliação Da Entrega</p>

                                        <div className="div_InputAvaliacao" >
                                            <label for="Petshop" style={{ width: "15%", color: 'black', fontStyle: 'normal', fontWeight: '600', fontSize: '12px' }}>Petshop</label>
                                            <input
                                                className="inputRange"
                                                type="range"
                                                min="1"
                                                max="5"
                                                step="1"
                                                defaultValue="3"
                                                onChange={this.avaliarPetshop}
                                            />

                                        </div>

                                        <div className="div_textLabelInput">
                                            <p>1</p>
                                            <p>2</p>
                                            <p>3</p>
                                            <p>4</p>
                                            <p>5</p>
                                        </div>

                                        <div className="div_InputAvaliacao" >
                                            <label for="Entregador" style={{ width: "15%" ,color: 'black', fontStyle: 'normal', fontWeight: '600', fontSize: '12px'}}>Entregador</label>
                                            <input
                                                className="inputRange"
                                                type="range"
                                                min="1"
                                                max="5"
                                                step="1"
                                                defaultValue="3"
                                                onChange={this.avaliarEntregador}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn_submitAvaliacao"
                                        >
                                            <p>Avaliar</p>
                                            <img src={Enter}
                                                style={{ backgroundColor: 'white' }}
                                            />
                                        </button>
                                    </form>
                                )}
                            </div>

                        )
                    })
                    }
                    <br></br>
                    <br></br>
                </div>
                <Footer page="Pedidos" />

            </div>
        );
    }
}

export default Sacola;