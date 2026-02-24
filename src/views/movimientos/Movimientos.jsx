import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoChevronLeft } from "react-icons/go";
import {
  MdReceipt,
  MdFilterList,
  MdSearch,
  MdClear,
  MdArrowDownward,
  MdAccountBalanceWallet,
  MdDirectionsTransit,
  MdCalendarToday,
  MdSyncAlt,
} from "react-icons/md";
import { FondoPag } from "../../components/common";
import { useAuth } from "../../context/AuthUserContext";
import { useMovimientos } from "../../hooks/pasajero/useMovimientos";
import {
  formatCurrency,
  formatFechaCorta,
} from "../../adapters/transaccionAdapter";

import "./movimientos.css";

export function Movimientos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    transacciones,
    loading,
    error,
    filtros,
    updateFiltro,
    limpiarFiltros,
    fetchTransacciones,
    buscarConFiltros,
    stats,
  } = useMovimientos(user?.id);

  // Cargar al montar
  useEffect(() => {
    if (user?.id) fetchTransacciones();
  }, [user?.id, fetchTransacciones]);

  const handleBuscar = (e) => {
    e.preventDefault();
    buscarConFiltros();
  };

  // Helpers para renderizar cada tarjeta según el tipo
  const getTipoClass = (tipo) => {
    if (tipo === "RECARGA") return "tipo-recarga";
    if (tipo === "TRANSFERENCIA") return "tipo-transferencia";
    return "tipo-pasaje";
  };

  const getTipoIcono = (tipo) => {
    if (tipo === "RECARGA") return <MdAccountBalanceWallet />;
    if (tipo === "TRANSFERENCIA") return <MdSyncAlt />;
    return <MdDirectionsTransit />;
  };

  const getTipoLabel = (tipo) => {
    if (tipo === "RECARGA") return "Recarga de saldo";
    if (tipo === "TRANSFERENCIA") return "Transferencia enviada";
    return "Pago pasaje";
  };

  const getValorClass = (tipo) => {
    return tipo === "RECARGA" ? "valor-positivo" : "valor-negativo";
  };

  const getValorPrefix = (tipo) => {
    return tipo === "RECARGA" ? "+" : "-";
  };

  return (
    <FondoPag>
      <div className="movimientos-page">
        {/* ─── HEADER ─── */}
        <header className="mov-header">
          <button
            className="mov-btn-back"
            onClick={() => navigate("/homeBalance")}
          >
            <GoChevronLeft />
          </button>
          <h2>Mis Movimientos</h2>
          <div className="mov-header-spacer" />
        </header>

        {/* ─── STATS RESUMEN ─── */}
        <div className="mov-stats">
          <div className="mov-stat-card">
            <MdReceipt className="stat-icon" />
            <div>
              <span className="stat-number">{stats.totalTransacciones}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          <div className="mov-stat-card recargas">
            <MdArrowDownward className="stat-icon" />
            <div>
              <span className="stat-number">{stats.cantRecargas}</span>
              <span className="stat-label">Recargas</span>
            </div>
          </div>
          <div className="mov-stat-card pasajes">
            <MdDirectionsTransit className="stat-icon" />
            <div>
              <span className="stat-number">{stats.cantPasajes}</span>
              <span className="stat-label">Pasajes</span>
            </div>
          </div>
          {/* ── NUEVO: Stat de Transferencias ── */}
          <div className="mov-stat-card transferencias">
            <MdSyncAlt className="stat-icon" />
            <div>
              <span className="stat-number">{stats.cantTransFerencias}</span>
              <span className="stat-label">Transferencias</span>
            </div>
          </div>
        </div>

        {/* ─── FILTROS ─── */}
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

          {/* ── Tipo de transacción — ahora incluye TRANSFERENCIA ── */}
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

        {/* ─── LISTA DE MOVIMIENTOS ─── */}
        <main className="mov-lista">
          {loading && (
            <div className="mov-loading">
              <div className="mov-spinner" />
              <p>Cargando movimientos...</p>
            </div>
          )}

          {error && <div className="mov-error">{error}</div>}

          {!loading && !error && transacciones.length === 0 && (
            <div className="mov-empty">
              <MdReceipt className="empty-icon" />
              <p>No hay movimientos para mostrar</p>
              <span>Tus transacciones aparecerán aquí</span>
            </div>
          )}

          {!loading &&
            transacciones.map((tx) => (
              <div
                key={tx.id}
                className={`mov-card ${getTipoClass(tx.tipo)}`}
              >
                <div className="mov-card-icon">
                  {getTipoIcono(tx.tipo)}
                </div>

                <div className="mov-card-info">
                  <div className="mov-card-top">
                    <span className="mov-card-tipo">
                      {getTipoLabel(tx.tipo)}
                    </span>
                    <span className={`mov-card-valor ${getValorClass(tx.tipo)}`}>
                      {getValorPrefix(tx.tipo)}
                      {formatCurrency(tx.valorPagado, tx.moneda)}
                    </span>
                  </div>

                  <div className="mov-card-bottom">
                    <span className="mov-card-fecha">
                      {formatFechaCorta(tx.fechaPago)}
                    </span>
                    {tx.medioDePagoLabel && tx.tipo === "RECARGA" && (
                      <span className="mov-card-medio">{tx.medioDePagoLabel}</span>
                    )}
                    {tx.idEstacion && (
                      <span className="mov-card-estacion">
                        Estación #{tx.idEstacion}
                      </span>
                    )}

                    {tx.tipo === "TRANSFERENCIA" && (
                      <span className="mov-card-transferencia-badge">
                        <MdSyncAlt /> {tx.medioDePagoLabel}
                      </span>
                    )}
                  </div>

                  {tx.descripcion && tx.descripcion !== "Sin descripción" && (
                    <span className="mov-card-desc">{tx.descripcion}</span>
                  )}
                </div>
              </div>
            ))}
        </main>
      </div>
    </FondoPag>
  );
}

export default Movimientos;