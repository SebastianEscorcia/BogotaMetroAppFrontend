import {
  MdSearch,
  MdFilterListOff,
  MdCalendarMonth,
  MdAttachMoney,
  MdPerson,
  MdBadge,
  MdPayment,
} from "react-icons/md";
import "./transaccionFilters.css";

const MEDIO_PAGO_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "TARJETA_CREDITO", label: "Tarjeta de Crédito" },
  { value: "TARJETA_DEBITO", label: "Tarjeta de Débito" },
  { value: "PSE", label: "PSE" },
  { value: "NEQUI", label: "Nequi" },
  { value: "DAVIPLATA", label: "Daviplata" },
  { value: "EFECTIVO", label: "Efectivo" },
  { value: "TRANSFERENCIA", label: "Transferencia" },
  { value: "SALDO_VIRTUAL", label: "Saldo Virtual" },
];

/**
 * Panel de filtros para transacciones.
 * Permite filtrar por fechas, montos y usuario.
 */
export const TransaccionFilters = ({
  filtros,
  onUpdateFiltro,
  onBuscar,
  onReset,
  loading,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onBuscar();
  };

  return (
    <form className="transaccion-filters" onSubmit={handleSubmit}>
      <div className="filters-row">
        <div className="filter-group">
          <label className="filter-label">
            <MdCalendarMonth />
            <span>Desde</span>
          </label>
          <input
            type="datetime-local"
            className="filter-input"
            value={filtros.fechaInicio}
            onChange={(e) => onUpdateFiltro("fechaInicio", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <MdCalendarMonth />
            <span>Hasta</span>
          </label>
          <input
            type="datetime-local"
            className="filter-input"
            value={filtros.fechaFin}
            onChange={(e) => onUpdateFiltro("fechaFin", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <MdAttachMoney />
            <span>Monto mín.</span>
          </label>
          <input
            type="number"
            className="filter-input"
            placeholder="0"
            min="0"
            value={filtros.montoMin}
            onChange={(e) => onUpdateFiltro("montoMin", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <MdAttachMoney />
            <span>Monto máx.</span>
          </label>
          <input
            type="number"
            className="filter-input"
            placeholder="999999"
            min="0"
            value={filtros.montoMax}
            onChange={(e) => onUpdateFiltro("montoMax", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <MdBadge />
            <span>N° Documento</span>
          </label>
          <input
            type="text"
            className="filter-input"
            placeholder="Ej: 1012345678"
            value={filtros.numDocumento}
            onChange={(e) => onUpdateFiltro("numDocumento", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <MdPerson />
            <span>Nombre</span>
          </label>
          <input
            type="text"
            className="filter-input"
            placeholder="Nombre del pasajero"
            value={filtros.nombre}
            onChange={(e) => onUpdateFiltro("nombre", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <MdPayment />
            <span>Medio de Pago</span>
          </label>
          <select
            className="filter-input"
            value={filtros.medioPago}
            onChange={(e) => onUpdateFiltro("medioPago", e.target.value)}
          >
            {MEDIO_PAGO_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filters-actions">
        <button
          type="submit"
          className="btn-filter btn-filter-primary"
          disabled={loading}
        >
          <MdSearch />
          <span>{loading ? "Buscando..." : "Buscar"}</span>
        </button>
        <button
          type="button"
          className="btn-filter btn-filter-secondary"
          onClick={onReset}
          disabled={loading}
        >
          <MdFilterListOff />
          <span>Limpiar</span>
        </button>
      </div>
    </form>
  );
};
