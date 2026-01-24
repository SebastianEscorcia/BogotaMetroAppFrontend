import { MdCheckCircle, MdError, MdClose } from "react-icons/md";

export const AlertMessage = ({ type, message, onClose }) => {
  if (!message) return null;

  return (
    <div className={`alert alert-${type}`}>
      <span className="alert-icon">
        {type === "success" ? <MdCheckCircle /> : <MdError />}
      </span>
      <span className="alert-message">{message}</span>
      <button className="alert-close" onClick={onClose}>
        <MdClose />
      </button>
    </div>
  );
};

export default AlertMessage;
