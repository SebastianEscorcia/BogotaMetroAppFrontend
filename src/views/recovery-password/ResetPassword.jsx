import { Link } from "react-router-dom";
import { RiLockPasswordLine } from "react-icons/ri";
import { Logo, Button, FondoPag } from "../../components/common";
import logo from "../../assets/img/imgs/logo2.svg";
import { useResetPassword } from "../../hooks";
import "./resetpassword.css";

export const ResetPassword = () => {
  const {
    token,
    nuevaClave,
    confirmarClave,
    error,
    success,
    loading,
    handleNuevaClaveChange,
    handleConfirmarClaveChange,
    handleSubmit,
  } = useResetPassword();

  if (!token) {
    return (
      <FondoPag>
        <div className="reset-container">
          <Logo className={"reset-logo"} logo={logo} />
          <div className="reset-content">
            <h2>Error</h2>
            <p className="error-text">Token no proporcionado en la URL</p>
            <Link to="/login" className="back-link">
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </FondoPag>
    );
  }

  return (
    <FondoPag>
      <div className="reset-container">
        <Logo className={"reset-logo"} logo={logo} />
        <div className="reset-content">
          <h2>Restablecer Contraseña</h2>
          <p className="reset-description">Ingresa tu nueva contraseña</p>
          <form className="form-container" onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="icon">
                <RiLockPasswordLine />
              </span>
              <input
                type="password"
                placeholder="Nueva Contraseña"
                required
                minLength={8}
                value={nuevaClave}
                onChange={handleNuevaClaveChange}
              />
            </div>

            <div className="input-group">
              <span className="icon">
                <RiLockPasswordLine />
              </span>
              <input
                type="password"
                placeholder="Confirmar Contraseña"
                required
                minLength={8}
                value={confirmarClave}
                onChange={handleConfirmarClaveChange}
              />
            </div>

            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            <Button className="btn-login" disabled={loading}>
              {loading ? "Procesando..." : "Cambiar Contraseña"}
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
