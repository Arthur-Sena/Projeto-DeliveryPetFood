import React, { Component } from 'react';
import './SlidePromocao.css';

class SlidePromocao extends Component {

    constructor(props) {
        super(props);
        this.state = {
            propagandas: []
        }
    }

    listarPropagandas = () => {
        fetch("https://env-9048989.jelastic.saveincloud.net/api/propaganda/ativas", {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("usuario-petfood"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ propagandas: data })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        if (localStorage.getItem("usuario-petfood") && localStorage.getItem("usuario-petfood") != null) {
            this.listarPropagandas();
        }
    }

    render() {
        return (
            <div className='Component_SlidePromocao'>
                {
                    this.state.propagandas.length != 0 ? (

                        <section className="Component_Propagandas">

                            <div className="Component_PropagandasHome"
                                id={this.state.propagandas.length == 2 ? ("div_PropgandaHome2") : (
                                    this.state.propagandas.length == 3 ? ("div_PropgandaHome3") : (
                                        this.state.propagandas.length == 4 ? ("div_PropgandaHome4") : (
                                            this.state.propagandas.length == 5 ? ("div_PropgandaHome5") : (
                                                this.state.propagandas.length == 6 ? ("div_PropgandaHome6") : (
                                                    "div_PropagandasHome7"
                                                )))))
                                }
                            >
                                {
                                    this.state.propagandas.map(x => {
                                        return (
                                            <div className="div_ImgCardHome Card_PromocaoHome">
                                                <img src={x.imagem} className="img_CardPromocao" value={x.idPropaganda} />
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </section>
                    ) : (
                        <div>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default SlidePromocao;