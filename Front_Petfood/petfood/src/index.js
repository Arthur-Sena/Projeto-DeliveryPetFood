import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { parseJwt } from './services/auth.js';

import { Route, BrowserRouter as Router, Switch, Redirect } from "react-router-dom";

//------------Paginas de Cliente------------\\
import Home from './PagesCliente/Home/Home';
import PesquisarProduto from './PagesCliente/procurarProduto/Procurar';
import EstoqueDaLoja from './PagesCliente/EstoqueDaLoja/EstoqueDaLoja';

import Login from './PagesCliente/Login/Login';
import Cadastro from './PagesCliente/Cadastro/Cadastro';
import RecuperarSenha from './PagesCliente/RecuperarSenha/RecuperarSenha';

import CadastroEndereco from './PagesCliente/Cadastro/CadastroEndereco';
import User from './PagesCliente/User/User';
import Sacola from './PagesCliente/Sacola/Sacola';
import ProdutosComprados from './PagesCliente/produtosComprados/produtosComprados';
import Carteira from './PagesCliente/User/Carteira';
import NovoEndereco from './PagesCliente/NovoEndereco/NovoEndereco';
import AtualizarEndereco from './PagesCliente/AtualizarEndereco/AtualizarEndereco';
import MeusPedidos from './PagesCliente/MeusPedidos/MeusPedidos';
import ChatCliente from './PagesCliente/ChatCliente/ChatCliente';
import ChatClienteEntregador from './PagesCliente/ChatCliente/ChatClienteMotoboy';
import AtualizarPerfil from './PagesCliente/AtualizarPerfil/AtualizarPerfil';

//------------Pagina de Petshop------=----------- \\
import LoginPetshop from './PagesPetshop/LoginPetshop/LoginPetshop';
import RecuperarSenhaPethop from './PagesPetshop/RecuperarSenhaPethop/RecuperarSenhaPethop';
import HomePetshop from './PagesPetshop/Home/HomePetshop';
import Estoque from './PagesPetshop/Estoque/Estoque';
import ProdutosDoPedido from './PagesPetshop/ProdutosPedidos/ProdutosPedidos';
import HistoricoPedidos from './PagesPetshop/HistoricoPedidos/HistoricoPedidos';
import AtualizarProdutoPetshop from './PagesPetshop/AtualizarProduto/AtualizarProduto';
import CadastrarProdutoPetshop from './PagesPetshop/CadastrarProduto/CadastrarProduto';
import AtualizarPetshop from './PagesPetshop/AtualizarLoja/AtualizarLoja';
import GerarPedidoPetshop from './PagesPetshop/Estoque/GerarPedido';

//------------Pagina de Adm & Petshop------------ \\
import LoginAdm from './PagesAdm/LoginAdm/LoginAdm';
import Dash from './PagesAdm/HomeAdm/Dash';
import CadastrarLoja from './PagesAdm/CadastrarLoja/CadastrarLoja';
import ProdutosDaLoja from './PagesAdm/ProdutosDaLoja/ProdutosDaLoja';
import AtualizarLoja from './PagesAdm/AtualizarLoja/AtualizarLoja';
import CadastrarProduto from './PagesAdm/CadastrarProduto/CadastrarProduto';
import AtualizarProduto from './PagesAdm/AtualizarProduto/AtualizarProduto';
import PedidosDaLoja from './PagesAdm/PedidosDaLoja/PedidosDaLoja';
import ProdutosPedidos from './PagesAdm/ProdutosPedidos/ProdutosPedidos';
import ChatAdm from './PagesAdm/ChatAdm/Chat';

//------------Pagina Só de Adm------------ \\
import Lojas from './PagesAdm/ListarLojas/Lojas';
import InfoCliente from './PagesAdm/InfoUsuarios/InfoCliente';
import InfoEntregador from './PagesAdm/InfoUsuarios/InfoEntregador';
import Frete from './PagesAdm/Frete/Dashboard';
import Propaganda from './PagesAdm/Propaganda_Promocoes/Propaganda';
import CadastrarPromocao from './PagesAdm/CadastrarPromocao/CadastrarPromocao';
import CadastrarAdm from './PagesAdm/CadastrarAdm/CadastrarAdm';
import Dashboard from './PagesAdm/Dashboard/Dashboard';
import AprovarEntregador from './PagesAdm/AprovarEntregador/AprovarEntregador';
import Credencial from './PagesAdm/Credencial/Credencial';
import GerarPedido from './PagesAdm/GerarPedido/GerarPedido';

// ------------Paginas do Entregador----------\\
import LoginEntregador from './PagesEntregador/LoginEntregador/LoginEntregador';
import CadastroMotoboy from './PagesEntregador/LoginEntregador/CadastroMotoboy';
import HomeEntregador from './PagesEntregador/HomeEntregador/HomeEntregador';
import Aceito from './PagesEntregador/Aceitos/Aceitos';
import NovosPedidos from './PagesEntregador/NovosPedidos/NovosPedidos';
import Entregues from './PagesEntregador/Entregues/Entregues';
import RecuperarSenhaMotoboy from './PagesEntregador/LoginEntregador/RecuperarSenhaMotoboy';
import AtualizarMotoboy from './PagesEntregador/AtualizarMotoboy/AtualizarMotoboy';
import ChatEntregador from './PagesEntregador/Aceitos/Chat';

const RotaUsuario = ({ component: Component }) => (
    <Route
        render={props =>
            localStorage.getItem("usuario-petfood") !== null && parseJwt().Permissao === 'Cliente' ?
                (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{ pathname: "/", state: { from: props.location } }
                        }
                    />
                )
        }
    />
)

const RotaAdm_Petshop = ({ component: Component }) => (
    <Route
        render={props =>
            localStorage.getItem("usuario-petfood") !== null && (parseJwt().Permissao === 'Administrador' || parseJwt().Permissao === 'Petshop' || parseJwt().Permissao === 'Diretor') ?
                (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{ pathname: "/LoginPetshop", state: { from: props.location } }
                        }
                    />
                )
        }
    />
)

const RotaAdm = ({ component: Component }) => (
    <Route
        render={props =>
            localStorage.getItem("usuario-petfood") !== null && (parseJwt().Permissao === 'Administrador' || parseJwt().Permissao === 'Diretor') ?
                (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{ pathname: "/Adm", state: { from: props.location } }
                        }
                    />
                )
        }
    />
)

const RotaDiretor = ({ component: Component }) => (
    <Route
        render={props =>
            localStorage.getItem("usuario-petfood") !== null && parseJwt().Permissao === 'Diretor' ?
                (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{ pathname: "/Adm", state: { from: props.location } }
                        }
                    />
                )
        }
    />
)

const RotaEntregador = ({ component: Component }) => (
    <Route
        render={props =>
            localStorage.getItem("usuario-petfood") !== null && parseJwt().Permissao === 'Motoboy' ?
                (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{ pathname: "/LoginEntregador", state: { from: props.location } }
                        }
                    />
                )
        }
    />
)

const RotaPetshop = ({ component: Component }) => (
    <Route
        render={props =>
            localStorage.getItem("usuario-petfood") !== null && parseJwt().Permissao === 'Petshop' ?
                (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{ pathname: "/LoginPetshop", state: { from: props.location } }
                        }
                    />
                )
        }
    />
)

const routing = (
    <Router>
        <Switch>
            <Route exact path='/' component={Login} />
            <Route exact path='/Adm' component={LoginAdm} />
            <Route exact path='/LoginPetshop' component={LoginPetshop} />
            <Route exact path='/LoginEntregador' component={LoginEntregador} />
            <Route exact path='/Cadastro' component={Cadastro} />
            <Route exact path='/CadastroEndereco' component={CadastroEndereco} />
            <Route exact path='/CadastroMotoboy' component={CadastroMotoboy} />
            <Route exact path='/RecuperarSenha' component={RecuperarSenha} />
            <Route exact path='/RecuperarSenhaMotoboy' component={RecuperarSenhaMotoboy} />
            <Route exact path='/RecuperarSenhaPethop' component={RecuperarSenhaPethop} />

            <Route exact path='/Home' component={Home} />
            <Route exact path='/PesquisarProduto' component={PesquisarProduto} />
            <Route exact path='/EstoqueDaLoja/:id' component={EstoqueDaLoja} />

            <RotaUsuario exact path='/User' component={User} />
            <RotaUsuario exact path='/Sacola' component={Sacola} />
            <RotaUsuario exact path='/ProdutosComprados' component={ProdutosComprados} />
            <RotaUsuario exact path='/Carteira' component={Carteira} />
            <RotaUsuario exact path='/NovoEndereco' component={NovoEndereco} />
            <RotaUsuario exact path='/AtualizarEndereco' component={AtualizarEndereco} />
            <RotaUsuario exact path='/MeusPedidos' component={MeusPedidos} />
            <RotaUsuario exact path='/ChatCliente' component={ChatCliente} />
            <RotaUsuario exact path='/AtualizarPerfil' component={AtualizarPerfil} />
            <RotaUsuario exact path='/ChatClienteEntregador' component={ChatClienteEntregador} />

            
            <RotaPetshop exact path='/HomePetshop' component={HomePetshop} />
            <RotaPetshop exact path='/Estoque' component={Estoque} />
            <RotaPetshop exact path='/ProdutosDoPedido' component={ProdutosDoPedido} />
            <RotaPetshop exact path='/HistoricoDePedidos' component={HistoricoPedidos} />
            <RotaPetshop exact path='/AtualizarProdutoPetshop' component={AtualizarProdutoPetshop} />
            <RotaPetshop exact path='/CadastrarProdutoPetshop' component={CadastrarProdutoPetshop} />
            <RotaPetshop exact path='/AtualizarPetshop' component={AtualizarPetshop} />
            <RotaPetshop exact path='/GerarPedidoPetshop' component={GerarPedidoPetshop} />

            <RotaAdm exact path='/Lojas' component={Lojas} />
            <RotaAdm exact path='/CadastrarLoja' component={CadastrarLoja} />
            <RotaAdm exact path='/InfoCliente' component={InfoCliente} />
            <RotaAdm exact path='/InfoEntregador' component={InfoEntregador} />
            <RotaAdm exact path='/Frete' component={Frete} />
            <RotaAdm exact path='/Propaganda' component={Propaganda} />
            <RotaAdm exact path='/CadastrarPromocao' component={CadastrarPromocao} />
            <RotaAdm exact path='/CadastrarAdm' component={CadastrarAdm} />
            <RotaAdm exact path='/Dashboard' component={Dashboard} />
            <RotaAdm exact path='/AprovarEntregador' component={AprovarEntregador} />

            <RotaDiretor exact path='/Credencial' component={Credencial} />
            {/* <RotaDiretor exact path='/AtualizarAdm' component={AtualizarAdm} /> */}

            <RotaAdm_Petshop exact path='/Dash' component={Dash} />
            <RotaAdm_Petshop exact path='/ProdutosDaLoja' component={ProdutosDaLoja} />
            <RotaAdm_Petshop exact path='/AtualizarLoja' component={AtualizarLoja} />
            <RotaAdm_Petshop exact path='/CadastrarProduto' component={CadastrarProduto} />
            <RotaAdm_Petshop exact path='/AtualizarProduto' component={AtualizarProduto} />
            <RotaAdm_Petshop exact path='/PedidosDaLoja' component={PedidosDaLoja} />
            <RotaAdm_Petshop exact path='/ProdutosPedidos' component={ProdutosPedidos} />
            <RotaAdm_Petshop exact path='/ChatAdm' component={ChatAdm} />
            <RotaAdm_Petshop exact path='/GerarPedido' component={GerarPedido} />

            <Route exact path='/Entregador' component={HomeEntregador} />
            <Route exact path='/NovosPedidos' component={NovosPedidos} />
            <RotaEntregador exact path='/EntregaAceita' component={Aceito} />
            <RotaEntregador exact path='/Entregues' component={Entregues} />
            <RotaEntregador exact path='/AtualizarMotoboy' component={AtualizarMotoboy} />
            <RotaEntregador exact path='/ChatEntregador' component={ChatEntregador} />

            <Route component={Login} />
        </Switch>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();