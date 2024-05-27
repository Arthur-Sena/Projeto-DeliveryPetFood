import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from "react-router-dom";
//Css + images
import Termos from '../../Component/Termos_Condicoes';

import VerSenha from '../../Assets/Icons/VerSenha.svg'
import Usuario from '../../Assets/Icons/Footer/perfilVermelho.svg';
import Petshop from '../../Assets/Icons/Footer/homeVermelho.svg';



import HeaderLogin from '../../Component/TopoLogin/NavLogin';
import TituloLogin from '../../Component/TituloLoginCadastro/TituloLogin';

var geolocator = require("geolocator");
var ip;

function salvarIp(retorno) {
  ip = retorno;
}

class LoginPetshop extends Component {

  constructor() {
    super();
    this.state = {
      email: "",
      senha: "",
      erro: " ",
      mostrarTermos: false,
      abrirTermos: false,
      dispositivo: "",
      idPetshop: 0,
      verSenha: false,
    }
  }

  loginEmail = (event) => {
    this.setState({ email: event.target.value })
  }

  loginSenha = (event) => {
    this.setState({ senha: event.target.value })
  }

  logar = (event) => {
    event.preventDefault();

    if (this.state.mostrarTermos == true) {
      Axios.post("https://env-9048989.jelastic.saveincloud.net/api/petshop/CadastrarTermosDeUso", {
        data: (new Date()).toLocaleString(),
        ipDoPetshop: ip,
        navegadorDoPetshop: this.state.dispositivo,
        idPetshop: this.state.idPetshop,
      })
        .then(data => {
          this.efetuarLogin();
        })
        .catch(erro => console.log(erro));
    } else {
      this.efetuarLogin();
    }
  }

  efetuarLogin = () => {

    Axios.post("https://env-9048989.jelastic.saveincloud.net/api/login/petshop", {
      email: this.state.email,
      senha: this.state.senha
    })
      .then(data => {
        if (data.status === 200) {
          if (data.data.token == false) {
            this.setState({ erro: "Aceite os termos de uso para fazer seu 1º Login" });
            this.setState({ mostrarTermos: true });
            this.setState({ idPetshop: data.data.idPetshop });
          } else {
            localStorage.setItem("usuario-petfood", data.data.token);

            this.props.history.push('/HomePetshop');
          }

        } else {
          this.setState({ erro: "Usuário ou senha inválidos" });
        }
      })
      .catch(erro => {
        this.setState({ erro: "Usuário ou senha inválidos" });
      })
  }

  abrirTermos = (event) => {
    this.setState({ abrirTermos: !this.state.abrirTermos })
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

  componentDidMount() {
    this.nomeDoDispositivo();
  }

  verSenhaDigitada = (event) =>{
    event.preventDefault();

    this.setState({verSenha : !this.state.verSenha})
  }

  render() {
    return (
      <div className="LoginUsuario" >

        {this.state.abrirTermos == true ? (
          <div>
            <Termos abrirTermos={this.state.abrirTermos} />
            <button
              className="FecharTermos"
              onClick={this.abrirTermos}
            >Fechar</button>
          </div>
        ) : (<div></div>)}

        <HeaderLogin />

        <TituloLogin titulo="Login de petshop" href=""/>

        <form onSubmit={this.logar}
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
            <label className='Login_LabelInput'  >Senha
              <input
                className="Login_InputUsuario Login_InputUsuarioSenha"
                placeholder="Senha"
                type={this.state.verSenha == false ? ("password") : ("text")}
                onClick={(e) => this.verSenhaDigitada(e)}
                name="password"
                onChange={this.loginSenha}
                value={this.state.senha}
              />
            </label>
          </div>

          <div className="divCadastro_RecuperarSenha">

            <Link to='/RecuperarSenhaPethop'>Esqueceu a Senha</Link>
          </div>

          <div className="divInputLogin">
            <p className='Text_error'> {this.state.erro}</p>

            <button type="submit" className="btn_LoginUsuario">
              Login
            </button >

          </div>

          <br />

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

export default LoginPetshop;