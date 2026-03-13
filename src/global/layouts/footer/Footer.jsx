import { Button } from "../../../components/common";
import { GoHome } from "react-icons/go";
import { BsQrCode } from "react-icons/bs";
import { RiSubwayLine } from "react-icons/ri";
import { MdOutlineTravelExplore } from "react-icons/md";
import './footer.css'
export const Footer = ({}) => {
  return (
    <div className="footer-container">
      <div className="btn-container">
        <Button>
          <GoHome />
          <p>Inicio</p>
        </Button>
      </div>
      <div className="btn-container">
        <Button>
          <BsQrCode /> 
          <RiSubwayLine />
          <p>Pagar con QR</p>
        </Button>
      </div>
      <div className="btn-container">
        <Button>
          <MdOutlineTravelExplore />
          <p>Turismo</p>
        </Button>
      </div>
    </div>
  );
};
