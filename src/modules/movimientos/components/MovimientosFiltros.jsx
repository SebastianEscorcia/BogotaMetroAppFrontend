import {
  MdFilterList,
  MdCalendarToday,
  MdSearch,
  MdClear,
} from "react-icons/md";

export const MovimientosFiltros = ({
  filtros,
  updateFiltro,
  limpiarFiltros,
  buscarConFiltros,
  fetchTransacciones,
  loading,
 }) => {
  const handleBuscar = (e) => {
    e.preventDefault();
    buscarConFiltros();
  };

  return (
    <form className="mov-filtros" onSubmit={handleBuscar}>
      <div className="filtros-header">
        <MdFilterList />
        <span>Filtrar movimientos</span>
      </div>

      <div className="filtros-grid">
        <div className="filtro-group">
          <label>
            <MdCalendarToday /> Desde
          </label>
          <input
            type="datetime-local"
            value={filtros.fechaInicio}
            onChange={(e) => updateFiltro("fechaInicio", e.target.value)}
          />
        </div>
        <div className="filtro-group">
          <label>
            <MdCalendarToday /> Hasta
          </label>
          <input
            type="datetime-local"
            value={filtros.fechaFin}
            onChange={(e) => updateFiltro("fechaFin", e.target.value)}
          />
        </div>
        <div className="filtro-group">
          <label>Monto mín.</label>
          <input
            type="number"
            placeholder="0"
            value={filtros.montoMin}
            onChange={(e) => updateFiltro("montoMin", e.target.value)}
          />
        </div>
        <div className="filtro-group">
          <label>Monto máx.</label>
          <input
            type="number"
            placeholder="500.000"
            value={filtros.montoMax}
            onChange={(e) => updateFiltro("montoMax", e.target.value)}
          />
        </div>
      </div>

      <div className="filtro-tabs">
        {["TODOS", "RECARGA", "PASAJE", "TRANSFERENCIA"].map((tipo) => (
          <button
            key={tipo}
            type="button"
            className={`filtro-tab ${filtros.tipo === tipo ? "active" : ""}`}
            onClick={() => updateFiltro("tipo", tipo)}
          >
            {tipo === "TODOS" && "Todos"}
            {tipo === "RECARGA" && "Recargas"}
            {tipo === "PASAJE" && "Pasajes"}
            {tipo === "TRANSFERENCIA" && "Transferencias"}
          </button>
        ))}
      </div>

      <div className="filtros-actions">
        <button type="submit" className="mov-btn-buscar" disabled={loading}>
          <MdSearch /> Buscar
        </button>
        <button
          type="button"
          className="mov-btn-limpiar"
          onClick={() => {
            limpiarFiltros();
            fetchTransacciones();
          }}
        >
          <MdClear /> Limpiar
        </button>
      </div>
    </form>
  );
};
