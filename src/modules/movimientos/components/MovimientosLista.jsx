import { MovimientoCard } from "./MovimientoCard";
export const MovimientosLista = ({
  transacciones,
  masTransacciones,
  loading,
  error,
  onVerMas,
  mostrarBoton,
}) => {
  if (loading) {
    return (
      <div className="mov-loading">
        <div className="mov-spinner" /> <p>Cargando movimientos...</p>
      </div>
    );
  }
  if (error) {
    return <div className="mov-error">{error}</div>;
  }
  if (transacciones.length === 0 && masTransacciones.length === 0) {
    return (
      <div className="mov-empty">
        <p>No hay movimientos para mostrar</p>
        <span>Tus transacciones aparecerán aquí</span>
      </div>
    );
  }

  return (
    <div className="mov-lista">
      <h3>Hoy</h3>
      {transacciones.length === 0 ? (
        <p>Hoy no has realizado transacciones</p>
      ) : (
        transacciones.map((tx, index) => (
          <MovimientoCard key={`${tx.id}-${tx.fechaPago ?? index}`} tx={tx} />
        ))
      )}
      {mostrarBoton && (
        <div className="mov-ver-mas">
          <button onClick={onVerMas}>Ver más movimientos</button>
        </div>
      )}
    </div>
  );
};
