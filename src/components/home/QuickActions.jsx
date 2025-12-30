import iconoCash from "../../assets/img/imgs/iconoCash.png";
import iconoMetro from "../../assets/img/imgs/iconoMetro1.png";

export const QuickActions = () => (
  <div className="quick-actions">
    <button className="action primary">
      <img src={iconoCash} alt="Movimientos" />
      <span>Movimientos</span>
    </button>

    <button className="action secondary">
      <img src={iconoMetro} alt="MetroPay" />
      <span>METROPay</span>
    </button>
  </div>
);
