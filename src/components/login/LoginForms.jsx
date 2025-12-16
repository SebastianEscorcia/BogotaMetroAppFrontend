import "./loginform.css";
import { useLoginForms, useNavigateTo } from "../../hooks";
import { Button } from "../../components/common";
import { Link } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import {RiLockPasswordLine} from 'react-icons/ri'
export const LoginForms = ({ handleLogin }) => {
  const { goTo } = useNavigateTo();
  const {
    clave,
    correo,
    error,
    handleClaveChange,
    handleCorreoChange,
    handleSubmit,
  } = useLoginForms(handleLogin);
  return (
    <form className="form-container" action="" onSubmit={handleSubmit}>
      <div className="input-group">
        <span className="icon"> <MdOutlineMail/> </span>
        <input
          type="email"
          placeholder="Correo Electrónico"
          required
          value={correo}
          onChange={(event) => handleCorreoChange(event)}
        />
      </div>
      <div className="input-group">
        <span className="icon"><RiLockPasswordLine/> </span>
        <input
          type="password"
          placeholder="Contraseña"
          required
          value={clave}
          minLength={8}
          onChange={handleClaveChange}
        />
      </div>

      {error && <p className="error-text"> {error}</p>}

      <Link to={"/recover-password"}>Olvidé mi Contraseña</Link>
      <Button className={"btn-login"}>Ingresar</Button>
      <hr />
      <Button
        className={"btn-login"}
        onClick={() => goTo("/register")}
        type="button"
      >
        Registrarse
      </Button>
    </form>
  );
};
