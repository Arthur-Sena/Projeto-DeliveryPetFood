import React, { Component } from 'react';
import Axios from 'axios';
import petfood from '../../Assets/PetfoodNome.png';

//Css + images
import './LoginAdm.css';
import Entregador from './../../Assets/motocicleta.png';
import Usuario from '../../Assets/person.svg';
import Loja from '../../Assets/shop.svg';

var geolocator = require("geolocator");
var ip;

class LoginAdm extends Component {

  constructor() {
    super();
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

    Axios.post("https://env-9048989.jelastic.saveincloud.net/api/login/adm", {
      email: this.state.email,
      senha: this.state.senha
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'ip_usuario': localStorage.getItem("ip_user"),
      }
    })
      .then(data => {
        if (data.status === 200) {
          localStorage.setItem("usuario-petfood", data.data.token);

          this.props.history.push('/Dash');

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
        localStorage.setItem("ip_user", result.ip);
      } else {
        localStorage.setItem("ip_user", "0000000");
      }
    });
  }

  componentDidMount() {
    this.nomeDoDispositivo();
  }

  render() {
    return (
      <div className="LoginAdm" >

        <div className="div_ImgLogin">
          <img src={petfood} />
        </div>

        <form onSubmit={this.efetuarLogin} className="formLoginAdm">

          <h1
            style={{
              textAlign: "center",
              color: "#FFCE00"
            }}
          >Login De Adm</h1>

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
          <div className="divInputLogin">
            <button type="submit" className="btn_LoginAdm">
              Entrar
            </button>

            <h4 style={{ color: 'FF2226' }}>{this.state.erro}</h4>
          </div>


        </form>

      </div>
    );
  }
}

export default LoginAdm;