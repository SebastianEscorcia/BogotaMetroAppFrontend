import {FondoPag} from '../../components/common'
import './confirmInfo.css'



export function ConfirmInfo() {
  return (

    <FondoPag>
    <div className='confirmar-info-container'>

        <div>

      <header className="header-info">
        <h1>Verifica la información</h1>
      </header>

      </div>

      <div className='info-parrafo'>
        <p>El valor a recargar en <br /> BogotaMetroApp  se descontará <br /> del banco seleccionado através de PSE.</p>
      </div>



      <div className="data-info">

        <input type="text" placeholder="Nombre completo"/>
        <input type="number" placeholder="Tipo de identificación"/>
        <input type="number" placeholder="Numero de documento"/>
        <input type="number" placeholder="Numero de telefono"/>
        <input type="number" placeholder="valor a recargar"/>
        <input type="text" placeholder="¿Desde que banco vas a recargar?"/>
        <input type="email" placeholder="Correo registrado en PSE "/>

      </div>

      <div className="button-info">
        <button className='button-white'> Modificar</button>
        <button className='button-red'> Recargar </button>
      </div>

    </div>
    
    </FondoPag>
    )

}

export default ConfirmInfo