import { HeaderTop, Button, Logo } from "../../components/common";
import logo from "../../assets/img/imgs/logoconeslogan.png";
import "./welcome.css";
import { useNavigateTo } from "../../hooks/useNavigateTo";

export function Welcome() {
  const { goTo } = useNavigateTo();
  return (
    <>
      <HeaderTop className="header-b"></HeaderTop>
      <div className="welcome-container">
        <div className="logo-bienvenida">
          <Logo logo={logo} />
        </div>

        <div className="welcome">
          <h1 className="welcome-title">¡Bienvenidos!</h1>

          <p className="welcome-parrafo">
            <strong>Rutas Optimizadas en Tiempo Real</strong>
          </p>
          <p className="welcome-parrafo">
            <strong>Horarios precisos y actualizados</strong>
          </p>
          <p className="welcome-parrafo">
            <strong>Recomendaciones expertas para tu viaje</strong>
          </p>

          <Button onClick={() => goTo("/login", { replace: true })}>
            Continuar <i className="fa-solid fa-arrow-right"></i>
          </Button>
        </div>
      </div>
    </>
  );
}
