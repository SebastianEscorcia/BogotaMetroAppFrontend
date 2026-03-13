import { Logo } from "../../components/common";
import logo from "../../assets/img/imgs/logo2.svg";
import { LoginForms } from "../../components/login/LoginForms";
import {useAuth} from '../../global/context';
import { useNavigateTo } from "../../hooks";
import "./login.css";

export const Login = () => {
  const { login } = useAuth();
  const { goTo } = useNavigateTo();

  const handleLogin = async (data) => {
    const userRol = await login(data);
    
    switch (userRol) {
      case "ADMIN":
        goTo("/admin/dashboard", { replace: true });
        break;
      case "PASAJERO":
        goTo("/home", { replace: true });
        break;
      case "OPERADOR":
        goTo("/operador/dashboard", { replace: true });
        break;
      case "SOPORTE":
        goTo("/soporte/dashboard", { replace: true });
        break;
      default:
        goTo("/home", { replace: true });
    }
  };

  return (
    <div className="login-container">
      <Logo className={"login-logo"} logo={logo} />
      <LoginForms handleLogin={handleLogin} />
    </div>
  );
};

export default Login;
