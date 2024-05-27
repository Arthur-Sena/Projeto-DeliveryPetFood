import React, { Component } from 'react';
import './NavLogin.css';
import LogoPetFood   from './../../Assets/LogosPetfood/PetfoodNome.png';

class NavLogin extends Component {

    render() {
        return (
            <div className='Component_HeaderLogin'>
                <img src={LogoPetFood} />
            </div>
        )
    }
}

export default NavLogin;