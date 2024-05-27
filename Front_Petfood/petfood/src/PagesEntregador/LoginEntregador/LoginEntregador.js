import React, { Component } from 'react';
import Axios from 'axios';
import { Route, Link, BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { parseJwt } from '../../services/auth';

//Css + images
import './LoginEntregador.css';
import petfood from '../../Assets/PetfoodNome.png';
import Entregador from './../../Assets/motocicleta.png';
import Usuario from '../../Assets/person.svg';
import Loja from '../../Assets/shop.svg';

var geolocator = require("geolocator");

class LoginEntregador extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      senha: "",
      erro: " ",
    }
  }

  loginEmail = (event) => {
    this.setState({ email: event.target.value })
  }

  loginSenha = (event) => {
    this.setState({ senha: event.target.value })
  }

  efetuarLogin = (event) => {
    event.preventDefault();

    Axios.post("https://env-9048989.jelastic.saveincloud.net/api/login/motoboy", {
      email: this.state.email,
      senha: this.state.senha
    })
      .then(data => {
        if (data.data.token) {
          localStorage.setItem("usuario-petfood", data.data.token);
          this.props.history.push('/Entregador');

        } else {
          this.setState({ erro: data.data.mensagem })
        }
      })
      .catch(erro => {
        this.setState({ erro: "Usuário ou senha inválidos" });
      })
  }

  entrarDiretoCasoJaTenhaLogin = () => {
    if (localStorage.getItem("usuario-petfood")) {
      if (parseJwt().Permissao === 'Motoboy') {
        this.props.history.push('/Entregador');
      }
    }
  }

  nomeDoDispositivo = () => {
    geolocator.getIP(function (err, result) {
      if (result != null) {
        localStorage.setItem("ip_user", result.ip);
      } else {
        localStorage.setItem("ip_user", "0000000");
      }
    });
  }

  componentDidMount() {
    this.nomeDoDispositivo();
    this.entrarDiretoCasoJaTenhaLogin();
  }

  render() {
    return (
      <div className="LoginUsuario" >

        <div className="div_ImgLogin">
          <img src={petfood} />
        </div>

        <form onSubmit={this.efetuarLogin} className="formLoginUsuario">

          <h1
            style={{
              textAlign: "center",
              color: "#FFCE00"
            }}
          >Login De Entregador</h1>

          <div className="divInputLogin">
            <input
              className="input_Login"
              placeholder="Email"
              type="email"
              name="username"
              onChange={this.loginEmail}
              value={this.state.email}
            />
          </div>
          <div className="divInputLogin">
            <input
              className="input_Login"
              placeholder="Senha"
              type="password"
              name="password"
              onChange={this.loginSenha}
              value={this.state.senha}
            />
          </div>

          <div className="divCadastro_RecuperarSenha">
            <Link to='/CadastroMotoboy' style={{ textDecoration: 'none' }}>Cadastre-se</Link>

            <Link to='/RecuperarSenhaMotoboy'>Recuperar Senha</Link>
          </div>

          <div className="divInputLogin">
            <button type="submit" className="btn_LoginAdm">
              Entrar
            </button >

            <h4 style={{ color: 'red' }}>{this.state.erro}</h4>

            <div className="div_AcessarSemLogin">
              <Link to='/Entregador'>Acessar Sem Login</Link>
            </div>

          </div>
        </form>

      </div>
    );
  }
}

export default LoginEntregador;