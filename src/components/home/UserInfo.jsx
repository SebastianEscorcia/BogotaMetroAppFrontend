import { BsPerson } from "react-icons/bs";
import { Button } from "../common";

export const UserInfo = ({user}) => (
  <div className="user-info">
    <Button className="icon-btn">
      <BsPerson />
    </Button>
    <h2>{user.nombreCompleto}</h2>
  </div>
);
