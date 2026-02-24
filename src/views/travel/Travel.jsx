import {GoChevronLeft} from "react-icons/go";
import {  useNavigate } from "react-router-dom";
import iconoHeart from "../../assets/img/imgs/iconoHeart.jpg";
import iconoMap from "../../assets/img/imgs/iconoMap.png";
import {FondoPag} from "../../components/common";

import "./travel.css"

export function Travel() {
  const Navigate = useNavigate();

  return (

    <FondoPag>
    <div className="travel-container">

      <header className="header-travel">
        <button onClick={() => Navigate ("/home")}> <GoChevronLeft/></button>
        <p><strong>Viaje</strong>  </p>
      </header>

      <main className="content-travel">

        <div className="one-travel">
          <button onClick={() => Navigate ("/qr-travel")}>Viaja con QR</button>
        </div>

        <div className="two-travel">
          <button>
            <span className="imgOne"> <img src={iconoMap} alt="map" /> </span>
            ¿A donde vas? Planifica tu viaje 
            <img src={iconoHeart} alt="Corazon" />
            </button>
        </div>

        <div className="three-travel">
          <button>Guarda mis viajes <img src={iconoHeart} alt="Corazon" /></button>
        </div>

        <div className="four-travel">
        
          <button>Guarda mis viajes favoritos <img src={iconoHeart} alt="Corazon" /></button>
        </div>

        <div className="five-travel">
        
          <button>Elimina mis viajes frecuentes <img src={iconoHeart} alt="Corazon" /></button>
        </div>

        </main>

        <button className="button-continue">Continuar</button>
     




    </div>
    </FondoPag>

  )
}


export default Travel