import { BiCog } from "react-icons/bi";
import { FaDollarSign } from "react-icons/fa6";
import iconoTarjeta from "../../assets/img/imgs/iconoBotonTarjeta.jpg";
import iconoViaje from "../../assets/img/imgs/iconoBotonViaje.png";

export const ServicesGrid = ({ goTo }) => (
  <section className="services-grid">
    <Service icon={iconoTarjeta} label="Tarjeta Metro" />
    <Service icon={<BiCog />} label="Adapta tu experiencia" />
    <Service icon={iconoViaje} label="Viaje" onClick={() => goTo("/Travel")} />
    <Service icon={<FaDollarSign />} label="Saldo" onClick={() => goTo("/HomeBalance")} />
  </section>
);

const Service = ({ icon, label, onClick }) => (
  <div className="service-item" onClick={onClick}>
    <div className="service-icon">
      {typeof icon === "string" ? <img src={icon} /> : icon}
    </div>
    <p>{label}</p>
  </div>
);
