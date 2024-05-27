import React, { Component }from 'react';
import './CardPetshop.css';
import avaliacao from './../../../Assets/Icons/EstrelaVermelhaAvaliacao.svg';
import circulo from './../../../Assets/Detalhes/circulo_rosa.svg';
var geolocator = require("geolocator");

class CardPetshop extends Component {

    constructor(props) {
        super(props);
        this.state = {
            latitude: props.latitude,
            longitude: props.longitude
        }
    }

    CalcularDistanciaUsuarioPetshop = (lat, lng) => {
        var result = geolocator.calcDistance({
            from: {
                latitude: this.state.latitude,
                longitude: this.state.longitude
            },
            to: {
                latitude: lat,
                longitude: lng
            },
            formula: geolocator.DistanceFormula.HAVERSINE,
            unitSystem: geolocator.UnitSystem.METRIC
        });

        return result.toFixed(1);
    }

    render() {
        return (
            <body className='Component_CardPetshop'>
                {
                    this.props.petshop.map(x => {
                        return (
                            <section
                                onClick={() => { window.location.href = ('/EstoqueDaLoja/' + x.idpetshop) }}
                                className="Card_Petshop"
                            >
                                <div className='Card_ImgPetshop'>
                                    <img className='ComponentCard_ImgPetshop' src={x.imgpetshops[0].img} />
                                </div>

                                <section className='Card_InfoPetshop'>
                                    <p className='Card_InfoPetshopText'>{x.nome}</p>

                                    <div className='Card_InfoPetshopInfo'>
                                        <div className="Card_DetalhePetshop">
                                            <img src={avaliacao} className="Card_InfoPetshopIconAvaliacao" />
                                            <p className="Card_textInfoPetshop">{x.avaliacao}</p>
                                        </div>
                                        <div className="Card_DetalhePetshop">
                                            <img src={circulo} className="Card_InfoPetshopIcon" />
                                            <p className="Card_textInfoPetshop">{this.CalcularDistanciaUsuarioPetshop(x.latitude, x.longitude)}Km</p>

                                        </div>
                                        <div className="Card_DetalhePetshop">
                                            <img src={circulo} className="Card_InfoPetshopIcon" />
                                            <p className="Card_textInfoPetshop">{x.status == true ? ("Aberto") : ("Fechado")}</p>

                                        </div>
                                    </div>

                                </section>

                            </section>
                        );
                    })
                }
            </body>
        )
    }
}

export default CardPetshop;