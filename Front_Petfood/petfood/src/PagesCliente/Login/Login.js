import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Axios from 'axios';
import { parseJwt } from '../../services/auth';
 
//#region Css + Components
import './Login.css';
import HeaderLogin from './../../Component/TopoLogin/NavLogin';
import TituloLogin from './../../Component/TituloLoginCadastro/TituloLogin';
//#endregion

import VerSenha from '../../Assets/Icons/VerSenha.svg'
import Usuario from '../../Assets/Icons/Footer/perfilVermelho.svg';
import Petshop from '../../Assets/Icons/Footer/homeVermelho.svg';

var geolocator = require("geolocator");
var ip;

function salvarIp(retorno) {
  ip = retorno;
}
class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      senha: "",
      erro: " ",
      verSenha: false,
    }
  }

  //#region Salvando Informações do Input
  loginEmail = (event) => {
    this.setState({ email: event.target.value })
  }

  loginSenha = (event) => {
    this.setState({ senha: event.target.value })
  }

  //#endregion

  //#region Requisição de Login + Pegando Ip
  efetuarLogin = (event) => {
    event.preventDefault();

    Axios.post("https://env-9048989.jelastic.saveincloud.net/api/login", {
      email: this.state.email,
      senha: this.state.senha
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Special-Request-Header',
        'Access-Control-Allow-Credentials': 'true',
        'ip_usuario': ip,
      }
    })
      .then(data => {
        if (data.status === 200) {
          localStorage.setItem("usuario-petfood", data.data.token);
          this.props.history.push('/Home');
        } else {
          this.setState({ erro: "Erro ao efetuar login" })
        }
      })
      .catch(erro => {
        this.setState({ erro: "Usuário ou senha inválidos" });
      })
  }

  nomeDoDispositivo = () => {
    geolocator.getIP(function (err, result) {
      if (result != null) {
        salvarIp(result.ip);
      }
    });
  }
  //#endregion

  entrarDiretoCasoJaTenhaLogin = () => {
    if (localStorage.getItem("usuario-petfood")) {
      if (parseJwt().Permissao === 'Cliente') {
        this.props.history.push('/Home');
      }
    }
  }

  componentDidMount() {
    this.nomeDoDispositivo();
    this.entrarDiretoCasoJaTenhaLogin();
  }

  verSenhaDigitada = (event) =>{
    event.preventDefault();

    this.setState({verSenha : !this.state.verSenha})
  }

  render() {
    return (
      <div className="LoginUsuario" >

        <HeaderLogin />

        <TituloLogin titulo="Login de usuário" href="" />

        <form onSubmit={this.efetuarLogin}
          className="Form_LoginUsuario"
        >

          <div className="divInputLogin">
            <label className='Login_LabelInput'>E-mail
              <input
                className="Login_InputUsuario"
                placeholder="user@email.com"
                type="email"
                name="username"
                onChange={this.loginEmail}
                value={this.state.email}
              />
            </label>
          </div>

          <div className="divInputLogin" >
            <label className='Login_LabelInput'>Senha

              <input
                className="Login_InputUsuario Login_InputUsuarioSenha"
                placeholder="Senha"
                type={this.state.verSenha == true ? ("password") : ("text")}
                name="password"
                onChange={this.loginSenha}
                onClick={(e) => this.verSenhaDigitada(e)}
                value={this.state.senha}
              />
            </label>
          </div>

          <div className="divCadastro_RecuperarSenha">

            <Link to='/RecuperarSenha'>Esqueceu a Senha</Link>
          </div>

          <div className="divInputLogin">
            <p className='Text_error'> {this.state.erro}</p>

            <button type="submit" className="btn_LoginUsuario">
              Login
            </button >

            <div className="div_AcessarSemLogin">
              <Link to='/Home'>Acessar Sem Login</Link>
            </div>

            <p className="Login_LinkCadastro">Ainda não possui uma conta? <Link to='/Cadastro'>Cadastre-se</Link></p>

          </div>

          <section className="Login_OutrasCategoriasDeUsuario">
            <div className="Login_TituloCategoriasDeUsuario">
              <div className='Login_DivLinha'></div>

              <p>Entre como</p>

              <div className='Login_DivLinha'></div>
            </div>
 
            <div className='Login_BtnCategoriasDeUsuario'>

              <button className='Btn_CategoriasDeUsuario' onClick={() => this.props.history.push('/')}>
                <img src={Usuario} />
                <p>Usuário</p>
              </button>
              <button className='Btn_CategoriasDeUsuario' onClick={() => this.props.history.push('/LoginPetshop')}>
                <img src={Petshop} />
                <p>Petshop</p>
              </button>

            </div>

          </section>

        </form>
      </div>
    );
  }
}

export default Login;