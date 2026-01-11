import { Button } from "../common";
import Robot from "../../assets/img/imgs/icono-robot-chat.png";
export const SupportButton = () => {
  return (
    <div className="contact-support">
      <Button
        className="btn-contact-support"
        aria-label="Contactar con soporte"
      >
        <p>Llámanos o escríbenos</p>
        <img src={Robot} alt="Robot asistente del Metro de Bogotá" />
      </Button>
    </div>
  );
};
