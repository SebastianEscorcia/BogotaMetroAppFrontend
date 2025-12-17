import {registerPasajero} from '../../services'
import { useRegisterForm } from "../../hooks";
import { Logo, Form, Input } from "../../components/common";
import logo from "../../assets/img/imgs/logo2.svg";
import "./register.css";
import { 
  FaUser, 
  FaPhone, 
  FaIdCard, 
  FaCalendarAlt, 
  FaMapMarkerAlt 
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link } from "react-router-dom";

export const Register = () => {
  const handleRegister = async (data) => {
    try {
      const result = await registerPasajero(data);
      console.log("Registro Exitoso", result);
      
    } catch (error) {
      console.log(error.message);
    }
  };

  const {
    correo,
    clave,
    tipoDocumento,
    numDocumento,
    fechaNacimiento,
    direccion,
    nombres,
    telefonoData,
    error,
    handleNombresChange,
    handleTelefonoChange,
    handleChange,
    handleSubmit,
  } = useRegisterForm(handleRegister);

  return (
    <div className="register-container">
      <div className="register-form">
        <div className="logo-container">
           <Logo logo={logo} className="logo-register" />
        </div>
        <h2 className="register-title">Crear Cuenta</h2>

        <Form handleSubmit={handleSubmit} className="register-form-content">
          
          <div className="form-row">
            <Input
              icon={<FaUser />}
              name="primerNombre"
              placeholder="Primer Nombre *"
              value={nombres.primerNombre}
              onChange={handleNombresChange}
              required
              className="input-flex-1"
            />
            <Input
              icon={<FaUser />}
              name="segundoNombre"
              placeholder="Segundo Nombre"
              value={nombres.segundoNombre}
              onChange={handleNombresChange}
              className="input-flex-1"
            />
          </div>

          <div className="form-row">
            <Input
              icon={<FaUser />}
              name="primerApellido"
              placeholder="Primer Apellido *"
              value={nombres.primerApellido}
              onChange={handleNombresChange}
              required
              className="input-flex-1"
            />
            <Input
              icon={<FaUser />}
              name="segundoApellido"
              placeholder="Segundo Apellido"
              value={nombres.segundoApellido}
              onChange={handleNombresChange}
              className="input-flex-1"
            />
          </div>

          <div className="form-row">
            <Input
              type="select"
              icon={<FaIdCard />}
              name="tipoDocumento"
              value={tipoDocumento}
              onChange={handleChange}
              className="input-flex-35"
              options={[
                { value: "CC", label: "C.C." },
                { value: "TI", label: "T.I." },
                { value: "CE", label: "C.E." },
                { value: "PAS", label: "Pasaporte" }
              ]}
            />
            <Input
              icon={<span style={{ width: '16px' }}></span>}
              name="numDocumento"
              placeholder="Número de Documento *"
              value={numDocumento}
              onChange={handleChange}
              required
              className="input-flex-1"
            />
          </div>
          <div className="form-row">
            <Input
              type="select"
              icon={<FaPhone />}
              name="indicativo"
              value={telefonoData.indicativo}
              onChange={handleTelefonoChange}
              className="input-flex-30"
              options={[
                { value: "+57", label: "🇨🇴 +57" },
                { value: "+54", label: "🇦🇷 +54" },
                { value: "+52", label: "🇲🇽 +52" },
                { value: "+51", label: "🇵🇪 +51" },
                { value: "+56", label: "🇨🇱 +56" },
                { value: "+1", label: "🇺🇸 +1" },
                { value: "+34", label: "🇪🇸 +34" }
              ]}
            />
            <Input
              type="tel"
              name="numero"
              placeholder="Número Celular *"
              value={telefonoData.numero}
              onChange={handleTelefonoChange}
              required
              className="input-flex-1"
            />
          </div>
          <Input
            type="date"
            icon={<FaCalendarAlt />}
            name="fechaNacimiento"
            value={fechaNacimiento}
            onChange={handleChange}
            required
            className={`date-input ${fechaNacimiento ? 'has-value' : ''}`}
          />  

          <Input
            icon={<FaMapMarkerAlt />}
            name="direccion"
            placeholder="Dirección de Residencia"
            value={direccion}
            onChange={handleChange}
          />

          <Input
            type="email"
            icon={<MdEmail />}
            name="correo"
            placeholder="Correo Electrónico *"
            value={correo}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            icon={<RiLockPasswordLine />}
            name="clave"
            placeholder="Contraseña *"
            value={clave}
            onChange={handleChange}
            required
            minLength={8}
          />

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn-register">
            Registrarse
          </button>

          <div className="login-link-container">
            <Link to="/login" className="login-link">
              ¿Ya tienes cuenta? Inicia Sesión
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};
