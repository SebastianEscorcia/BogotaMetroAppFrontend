import {FondoPag} from "../../components/common";
import iconoMetro from "../../assets/img/imgs/iconoMetro1.png";
import qrOne from "../../assets/img/imgs/qrOne.png";
import { GoChevronLeft } from "react-icons/go";
import {useNavigateTo} from '../../hooks'


import "./qrtravel.css"


export function QrTravel() {
  const {goTo} = useNavigateTo()
  return (

    <FondoPag>
      <div>
        <header className="header-qrtravel">
          <button onClick={() => Navigate ('/travel')}><GoChevronLeft/> </button>
          <h1>Viaja con QR</h1>
        </header >

        <div className="logo-qrtravel">
          <img src={iconoMetro} alt="metro" />
          <span><strong>Bogota sin limites</strong></span>
        </div>

        <div className="questionOneQrtravel">
          <h1>¿viajas en una de estas lineas?</h1>
          </div>

        <div className="buttonsQrtravel">
          <button onClick={() => goTo('/linea-uno')}>Linea 1</button>
          <button onClick={() => goTo('/linea-dos')}>Linea 2</button>
          <button onClick={() => goTo('/linea-tres')}>Linea 3</button>
          <button>Linea 4</button>
          <button>Linea 5</button>
        </div>

        <div>
          <img src={qrOne} alt="qr" className="imagenQr"/>
        </div>

        <div className="opcionsQrtravel">
          <button>Frecuentemente</button>
          <button>$4.000</button>
        </div>

        <div className="infoQrtravel">
          <p>Ten en cuenta que este codigo no te permite hacer <br /> integracion con otros tipos de transporte</p>

          <button>¿Viajas en otras lineas?</button>
        </div>





      </div>



    </FondoPag>


  );
}

export default QrTravel