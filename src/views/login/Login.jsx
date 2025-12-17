import { Logo } from "../../components/common";
import logo from "../../assets/img/imgs/logo2.svg";
import { LoginForms } from "../../components/login/LoginForms";
import { useAuth } from "../../context/AuthUserContext";
import { useNavigateTo } from "../../hooks";
import "./login.css";
export const Login = () => {
  const { login } = useAuth();
  const { goTo } = useNavigateTo();
  const handleLogin = async (data) => {
    await login(data);
    goTo("/home", { replace: true });
  };

  return (
    <div className="login-container">
      <Logo className={"login-logo"} logo={logo} />
      <LoginForms handleLogin={handleLogin} />
    </div>
  );
};

export default Login;
