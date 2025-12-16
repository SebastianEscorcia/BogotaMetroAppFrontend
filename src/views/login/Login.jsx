import { Logo } from "../../components/common";
import logo from "../../assets/img/imgs/logo2.svg";
import { LoginForms } from "../../components/login/LoginForms";
import "./login.css";
export const Login = () => {
  const handleLogin = (email, password) => {
    console.log("Login válido:", email, password);
  };

  return (
    <div className="login-container">
      <Logo className={"login-logo"} logo={logo} />
      <LoginForms handleInputs={handleLogin}/>
      
    </div>
  );
};

export default Login;
