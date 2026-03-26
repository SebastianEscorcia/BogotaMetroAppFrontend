import { Link } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { Button, Logo, FondoPag } from "../../components/common";
import logo from "../../assets/img/imgs/logo2.svg";
import { useRecoverPassword } from "../../hooks";
import "./recoverpassword.css";
export const RecoverPassword = () => {
  const { correo, error, success, loading, handleCorreoChange, handleSubmit } =
    useRecoverPassword();

  return (
    <FondoPag>
      <div className="recover-container">
        <Logo className={"recover-logo"} logo={logo} />
        <div className="recover-content">
          <h2>Recuperar Contraseña</h2>
          <p className="recover-description">
            Ingresa tu correo electrónico y te enviaremos un enlace para
            restablecer tu contraseña.
          </p>
          <form className="form-container" onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="icon">
                <MdOutlineMail />
              </span>
              <input
                type="email"
                placeholder="Correo Electrónico"
                required
                value={correo}
                onChange={handleCorreoChange}
              />
            </div>

            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            <Button className="btn-login" disabled={loading}>
              {loading ? "Enviando..." : "Enviar Enlace"}
            </Button>

            <Link to="/login" className="back-link">
              Volver al inicio de sesión
            </Link>
          </form>
        </div>
      </div>
    </FondoPag>
  );
};
