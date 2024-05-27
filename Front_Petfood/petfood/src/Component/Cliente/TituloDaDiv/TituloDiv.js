import './TituloDiv.css';

function Titulo(props) {
    return (
        <div    className='Component_TitleDiv' >
            <p className='Component_TituloText'>{props.titulo}</p>
        </div>
    )
}

export default Titulo;