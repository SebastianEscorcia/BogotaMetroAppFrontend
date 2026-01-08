import { BsQuestionCircle } from "react-icons/bs";
import { useNavigateTo } from "../../hooks";
import { Button } from "../common";
export const HelpSection = () => {
  const { goTo } = useNavigateTo();
  return (
    <Button className="help-section" onClick={()=>{
      goTo("/soporte")
    }}>
      <BsQuestionCircle />
      ¿Necesitas ayuda?
    </Button>
  );
};
