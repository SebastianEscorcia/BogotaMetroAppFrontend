import { useNavigate } from "react-router-dom";
import { GoChevronLeft } from "react-icons/go";
import { FondoPag } from "../../components/common";
import { useAuth } from "../../context/AuthUserContext";

import "./recharge.css";

export function Recharge() {
  const Navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const handleRecharge= async() =>{
    try {
        await refreshUser();
    } catch (error) {
        
    }
  }
  return (
    <FondoPag>
      <div>
        <header className="recharge-header">
          <button
            className="btn-atras"
            onClick={() => Navigate("/homeBalance")}
          >
            <GoChevronLeft />
          </button>
          <h2>Recarga tu saldo</h2>
        </header>

        <main className="recharge-contenido">
          <div className="recharge-card">
            <div className="amount-row">
              <div className="amount-input">
                <label htmlFor="">Ingresa el valor</label>
                <input type="number" />
              </div>

              <div className="current-balance">
                <span>Saldo actual</span>
                <p>${user.saldo}</p>
              </div>
            </div>

            <div className="section-bank">
              <label htmlFor="">¿Desde que banco quieres recargar?</label>
              <select name="" id="">
                Selecciona el banco
                <option value="">Bancolombia</option>
                <option value="banco1">Nequi</option>
              </select>
            </div>

            <div className="section-check">
              <input type="checkbox" />
              <span>
                Autorizo el tratamiento de datos personales conforme a la ley
                1581 del 2012
              </span>
            </div>

            <button
              className="btn-continuar"
              onClick={() => Navigate("/ConfirmarInfo")}
            >
              {" "}
              Continuar{" "}
            </button>
          </div>
        </main>
      </div>
    </FondoPag>
  );
}
export default Recharge;
