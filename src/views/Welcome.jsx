import Button from "../components/common/Button";
import LogoEslogan from "../components/common/LogoEslogan";
import "../assets/styles/welcome.css";
import HeaderTop from "../components/common/HeaderTop";
function Welcome() {
  const sayHello = () => console.log("Hello togethers");

  return (
    <>
      <HeaderTop className="header-b"></HeaderTop>
      <div className="welcome-container">
        <div className="logo-bienvenida">
          <LogoEslogan />
        </div>

        <div className="welcome">
          <h1>¡Bienvenidos!</h1>

          <p>
            <strong>Rutas Optimizadas en Tiempo Real</strong>
          </p>
          <p>
            <strong>Horarios precisos y actualizados</strong>
          </p>
          <p>
            <strong>Recomendaciones expertas para tu viaje</strong>
          </p>

          <Button onEvent={sayHello} className="btn-red">
            Continuar <i className="fa-solid fa-arrow-right"></i>
          </Button>
        </div>
      </div>
    </>
  );
}

export default Welcome;
