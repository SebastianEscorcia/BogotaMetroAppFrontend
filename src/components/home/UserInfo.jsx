import { BsPerson } from "react-icons/bs";
import { Button } from "../common";

export const UserInfo = () => (
  <div className="user-info">
    <Button className="icon-btn">
      <BsPerson />
    </Button>
    <h2>Usuario</h2>
  </div>
);
