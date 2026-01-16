import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import {useAuth} from '../../context/AuthUserContext'
import { FondoPag } from "../../components/common";
import "./HomeBalance.css";

export function HomeBalance() {
  const navigate = useNavigate();
  const {user} = useAuth();
  return (
    <FondoPag>
      <div className="home-one">
        <div className="home-header">
          <button className="button-flecha" onClick={() => navigate("/home")}>
            <GoArrowLeft className="icon-fle" />
          </button>

          <div className="home-card">
            <div>
              <h1>Mi saldo</h1>
              <p className="saldo-valor">${user.saldo}</p>
            </div>
          </div>

          <div className="home-actions">
            <button
              className="action-button"
              onClick={() => navigate("/Recharge")}
            >
              Recarga
            </button>

            <button className="action-button bloquear-button">Bloquear</button>

            <button className="action-button movimientos-button">
              Movimientos
            </button>

            <button
              className="action-button pass-button"
              onClick={() => navigate("/PassBalance")}
            >
              Pasar saldo{" "}
            </button>
          </div>
        </div>
      </div>
    </FondoPag>
  );
}

export default HomeBalance;
