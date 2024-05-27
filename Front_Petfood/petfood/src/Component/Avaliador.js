import React, { Component } from 'react';
import './Avaliador.css';
import Nota1 from '../Assets/estrela-pontiaguda.png';
import Nota0 from '../Assets/estrela-favorita.png';
import Nota5 from '../Assets/estrela-meio.png';


class Avaliador extends Component {

    constructor() {
        super();
        this.state = {
        }
    }

    render() {
        return (

            <div className='Avaliador'>
                {/* --------------------------5 Estrelas--------------------- */}
                <div className='estrela'>
                    {this.props.avaliacao > 4.75 ? (
                        <div    className='divEstrela'>
                            <img src={Nota1} />
                            <img src={Nota1} />
                            <img src={Nota1} />
                            <img src={Nota1} />
                            <img src={Nota1} />
                        </div>
                    ) : (
                /* -------------------------4.5 Estrelas--------------------- */
                        <div>
                            {this.props.avaliacao >= 4.25 ? (
                                <div    className='divEstrela'>
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                    <img src={Nota5} />
                                </div>
                            ) : (
                /* ----------------------------4 Estrelas--------------------- */ 
                        <div>
                            {this.props.avaliacao >= 3.75 ? (
                                <div    className='divEstrela'>
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                </div>
                            ) : (
                /* ---------------------------3.5 Estrelas--------------------- */ 
                        <div>
                            {this.props.avaliacao >= 3.25 ? (
                                <div    className='divEstrela'>
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                    <img src={Nota5} />
                                </div>
                            ):(
                /* ---------------------------3 Estrelas--------------------- */ 
                        <div>
                            {this.props.avaliacao >= 2.75 ? (
                                <div    className='divEstrela'>
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                </div>
                            ):(
                /* ---------------------------2.5 Estrelas--------------------- */ 
                        <div>
                          {this.props.avaliacao >= 2.25 ? (
                              <div  className='divEstrela'>
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                    <img src={Nota5} />
                                </div>
                          ):(
                /* ---------------------------2 Estrelas--------------------- */ 
                        <div>
                            {this.props.avaliacao >= 1.75 ? (
                                <div    className='divEstrela'>
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                </div>
                            ):(
                /* ---------------------------1.5 Estrelas--------------------- */ 
                        <div>
                            {this.props.avaliacao >= 1.25 ? (
                                <div    className='divEstrela'>
                                    <img src={Nota1} />
                                    <img src={Nota5} />
                                </div>
                            ):(
                /* ---------------------------1 Estrelas--------------------- */ 
                        <div>
                            {this.props.avaliacao >= 0.75 ? (
                                <div    className='divEstrela'>
                                    <img src={Nota1} />
                                </div>
                            ):(
                /* ---------------------------0.5 Estrelas--------------------- */ 
                        <div>
                            {this.props.avaliacao >=0.25 ? (
                            <div    className='divEstrela'>
                                <img src={Nota5} />
                            </div>
                            ):(
                /* ---------------------------0 Estrelas--------------------- */ 
                            <div    className='divEstrela'> 
                                <img src={Nota0} />
                                <img src={Nota0} />
                                <img src={Nota0} />
                                <img src={Nota0} />
                                <img src={Nota0} />
                           </div> 
                            )}
                        </div>
                            )}   
                        </div>
                            )}
                        </div>
                            )}
                        </div>
                            )}      
                        </div>
                            )}
                        </div>
                            )}
                        </div>
                            )}
                        </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default Avaliador;