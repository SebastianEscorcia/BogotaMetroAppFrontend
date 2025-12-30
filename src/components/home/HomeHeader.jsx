import { FiAlignJustify } from "react-icons/fi";
import { BsBell } from "react-icons/bs";
import { Logo, Button } from "../common";
import iconoMetro from "../../assets/img/imgs/iconoMetro1.png";

export const HomeHeader = () => {
  return (
    <header className="home-header">
      <Button className="icon-btn">
        <FiAlignJustify />
      </Button>

      <div className="home-logo">
        <Logo logo={iconoMetro} />
        <p>Bogotá sin límites</p>
      </div>

      <Button className="icon-btn notification">
        <BsBell />
      </Button>
    </header>
  );
};
