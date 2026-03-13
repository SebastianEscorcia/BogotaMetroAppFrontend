import { GoChevronLeft } from "react-icons/go";

export const MovimientosHeader = ({ onBack }) => {
  return (
    <header className="mov-header">
      <button className="mov-btn-back" onClick={onBack}>
        <GoChevronLeft />
      </button>
      <h2>Mis Movimientos</h2>
      <div className="mov-header-spacer" />
    </header>
  );
};
