import { useState } from "react";
import {
  MdVisibility,
  MdCreditCard,
  MdDirectionsSubway,
  MdUnfoldMore,
  MdExpandLess,
  MdExpandMore,
  MdFirstPage,
  MdLastPage,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { formatCurrency, formatFecha } from "../../../adapters/transaccionAdapter";
import "./transaccionesTable.css";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

/**
 * Tabla de transacciones con paginación y ordenamiento.
 */
export const TransaccionesTable = ({ transacciones, tipo, onVerDetalle, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState("fechaPago");
  const [sortDirection, setSortDirection] = useState("desc");

  // — Ordenamiento —
  const sorted = [...transacciones].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === "valorPagado") {
      valA = Number(valA) || 0;
      valB = Number(valB) || 0;
    } else if (sortField === "fechaPago") {
      valA = new Date(valA || 0).getTime();
      valB = new Date(valB || 0).getTime();
    } else {
      valA = String(valA || "").toLowerCase();
      valB = String(valB || "").toLowerCase();
    }

    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // — Paginación —
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIdx = (safeCurrentPage - 1) * pageSize;
  const pageData = sorted.slice(startIdx, startIdx + pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <MdUnfoldMore className="sort-icon inactive" />;
    return sortDirection === "asc" ? (
      <MdExpandLess className="sort-icon active" />
    ) : (
      <MdExpandMore className="sort-icon active" />
    );
  };

  // — Columnas según el tipo —
  const isRecarga = tipo === "RECARGA";

  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner" />
        <p>Cargando transacciones...</p>
      </div>
    );
  }

  if (transacciones.length === 0) {
    return (
      <div className="table-empty">
        {isRecarga ? (
          <MdCreditCard className="empty-icon" />
        ) : (
          <MdDirectionsSubway className="empty-icon" />
        )}
        <h3>No se encontraron {isRecarga ? "recargas" : "pagos al metro"}</h3>
        <p>Ajusta los filtros o el rango de fechas para ver resultados</p>
      </div>
    );
  }

  return (
    <div className="transacciones-table-wrapper">
      <div className="table-info">
        <span>
          Mostrando {startIdx + 1}–{Math.min(startIdx + pageSize, sorted.length)} de{" "}
          <strong>{sorted.length}</strong> {isRecarga ? "recargas" : "pagos"}
        </span>
      </div>

      <div className="table-scroll">
        <table className="transacciones-table">
          <thead>
            <tr>
              <th className="th-sortable" onClick={() => handleSort("id")}>
                <span>ID</span>
                <SortIcon field="id" />
              </th>
              <th className="th-sortable" onClick={() => handleSort("nombreUsuario")}>
                <span>Pasajero</span>
                <SortIcon field="nombreUsuario" />
              </th>
              <th className="th-sortable" onClick={() => handleSort("valorPagado")}>
                <span>Valor</span>
                <SortIcon field="valorPagado" />
              </th>
              <th className="th-sortable" onClick={() => handleSort("fechaPago")}>
                <span>Fecha</span>
                <SortIcon field="fechaPago" />
              </th>
              {isRecarga ? (
                <>
                  <th>Medio de Pago</th>
                  <th>Pasarela</th>
                </>
              ) : (
                <th>Estación</th>
              )}
              <th>Descripción</th>
              <th className="th-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((tx) => (
              <tr key={tx.id} className="table-row" onClick={() => onVerDetalle(tx)}>
                <td className="td-id">#{tx.id}</td>
                <td className="td-usuario">{tx.nombreUsuario}</td>
                <td className="td-valor">
                  <span className={`valor-badge ${isRecarga ? "recarga" : "pasaje"}`}>
                    {formatCurrency(tx.valorPagado, tx.moneda)}
                  </span>
                </td>
                <td className="td-fecha">{formatFecha(tx.fechaPago)}</td>
                {isRecarga ? (
                  <>
                    <td className="td-medio-pago">
                      <span className="medio-pago-chip">{tx.medioDePagoLabel}</span>
                    </td>
                    <td className="td-pasarela">{tx.nombrePasarela || "—"}</td>
                  </>
                ) : (
                  <td className="td-estacion">
                    <span className="estacion-chip">
                      <MdDirectionsSubway /> Est. {tx.idEstacion}
                    </span>
                  </td>
                )}
                <td className="td-descripcion" title={tx.descripcion}>
                  {tx.descripcion}
                </td>
                <td className="td-actions">
                  <button
                    className="btn-ver-detalle"
                    onClick={(e) => {
                      e.stopPropagation();
                      onVerDetalle(tx);
                    }}
                    title="Ver detalle"
                  >
                    <MdVisibility />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="table-pagination">
        <div className="pagination-size">
          <span>Filas por página:</span>
          <select value={pageSize} onChange={handlePageSizeChange}>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="pagination-info">
          Página {safeCurrentPage} de {totalPages}
        </div>

        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(1)}
            disabled={safeCurrentPage === 1}
          >
            <MdFirstPage />
          </button>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage === 1}
          >
            <MdChevronLeft />
          </button>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage === totalPages}
          >
            <MdChevronRight />
          </button>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(totalPages)}
            disabled={safeCurrentPage === totalPages}
          >
            <MdLastPage />
          </button>
        </div>
      </div>
    </div>
  );
};
