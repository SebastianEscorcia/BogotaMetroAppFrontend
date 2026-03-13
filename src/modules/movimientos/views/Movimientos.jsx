import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../global/context/AuthUserContext";
import { useMovimientos } from "../hooks/useMovimientos";

import { FondoPag } from "../../../components/common";
import {
  MovimientosFiltros,
  MovimientosHeader,
  MovimientosLista,
  MovimientosStats,
  MovimientoCard
} from "../components";

import "../styles/movimiento.css";
export const Movimientos = () => {
  const { user } = useAuth(); // Debemos destructurar porque el contexto devuelve todo el objeto completo
  const navigate = useNavigate();

  const {
    transacciones,
    transaccionesPasadas,
    loading,
    error,
    filtros,
    updateFiltro,
    limpiarFiltros,
    fetchTransacciones,
    buscarConFiltros,
    stats,
    mostrarBoton,
    fetchMasTransacciones,
  } = useMovimientos(user?.id);

  useEffect(() => {
    if (user?.id) {
      fetchTransacciones();
    }
  }, [user?.id, fetchTransacciones]);

  return (
    <FondoPag>
      <div className="movimientos-page">
        <MovimientosHeader
          onBack={() => navigate("/homeBalance", { replace: false })}
        />
        <MovimientosStats stats={stats} />
        <MovimientosFiltros
          filtros={filtros}
          updateFiltro={updateFiltro}
          limpiarFiltros={limpiarFiltros}
          buscarConFiltros={buscarConFiltros}
          fetchTransacciones={fetchTransacciones}
          loading={loading}
        />
        <MovimientosLista
          transacciones={transacciones }
          masTransacciones={transaccionesPasadas}
          loading={loading}
          error={error}
          onVerMas={fetchMasTransacciones}
          mostrarBoton={mostrarBoton}
        />
        {transaccionesPasadas.length > 0 && (
          <div className="mov-pasados">
            <h3>Movimientos pasados</h3>
            {transaccionesPasadas.map((tx) => (
              <MovimientoCard key={tx.id} tx={tx} />
            ))}
          </div>
        )}
      </div>
    </FondoPag>
  );
};
