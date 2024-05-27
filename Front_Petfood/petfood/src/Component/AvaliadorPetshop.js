import React, { Component } from 'react';
import './AvaliadorPetshop.css';
import Nota1 from '../Assets/star-fill.svg';
import Nota0 from '../Assets/star.svg';
import Nota5 from '../Assets/star-half.svg';


class AvaliadorPetshop extends Component {
    render() {
        return (

            <div className='AvaliadorPetshop'>
                {/* --------------------------5 Estrelas--------------------- */}
                <div className='estrela'>
                    {this.props.avaliacao > 4.75 ? (
                        <div    className='divEstrelaPetshop'>
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
                                <div    className='divEstrelaPetshop'>
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
                                <div    className='divEstrelaPetshop'>
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                    <img src={Nota0} />
                                </div>
                            ) : (
                /* ---------------------------3.5 Estrelas--------------------- */ 
                        <div>
                            {this.props.avaliacao >= 3.25 ? (
                                <div    className='divEstrelaPetshop'>
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                    <img src={Nota5} />
                                    <img src={Nota0} />
                                </div>
                            ):(
                /* ---------------------------3 Estrelas--------------------- */ 
                        <div>
                            {this.props.avaliacao >= 2.75 ? (
                                <div    className='divEstrelaPetshop'>
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                    <img src={Nota0} />
                                    <img src={Nota0} />
                                </div>
                            ):(
                /* ---------------------------2.5 Estrelas--------------------- */ 
                        <div>
                          {this.props.avaliacao >= 2.25 ? (
                              <div  className='divEstrelaPetshop'>
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                    <img src={Nota5} />
                                    <img src={Nota0} />
                                    <img src={Nota0} />
                                </div>
                          ):(
                /* ---------------------------2 Estrelas--------------------- */ 
                        <div>
                            {this.props.avaliacao >= 1.75 ? (
                                <div    className='divEstrelaPetshop'>
                                    <img src={Nota1} />
                                    <img src={Nota1} />
                                    <img src={Nota0} />
                                    <img src={Nota0} />
                                    <img src={Nota0} />
                                </div>
                            ):(
                /* ---------------------------1.5 Estrelas--------------------- */ 
                        <div>
                            {this.props.avaliacao >= 1.25 ? (
                                <div    className='divEstrelaPetshop'>
                                    <img src={Nota1} />
                                    <img src={Nota5} />
                                    <img src={Nota0} />
                                    <img src={Nota0} />
                                    <img src={Nota0} />
                                </div>
                            ):(
                /* ---------------------------1 Estrelas--------------------- */ 
                        <div>
                            {this.props.avaliacao >= 0.75 ? (
                                <div    className='divEstrelaPetshop'>
                                    <img src={Nota1} />
                                    <img src={Nota0} />
                                    <img src={Nota0} />
                                    <img src={Nota0} />
                                    <img src={Nota0} />
                                </div>
                            ):(
                /* ---------------------------0.5 Estrelas--------------------- */ 
                        <div>
                            {this.props.avaliacao >=0.25 ? (
                            <div    className='divEstrelaPetshop'>
                                <img src={Nota5} />
                                <img src={Nota0} />
                                <img src={Nota0} />
                                <img src={Nota0} />
                                <img src={Nota0} />
                            </div>
                            ):(
                /* ---------------------------0 Estrelas--------------------- */ 
                            <div    className='divEstrelaPetshop'> 
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

export default AvaliadorPetshop;