import { LuLoaderCircle } from "react-icons/lu";

export const LineStatus = ({
  interrupcionesActivas = [],
  loading = false,
  isWebSocketConnected = false,
}) => {
  const totalActivas = interrupcionesActivas.length;

  const prioridadClass = (() => {
    if (totalActivas === 0) return "green";
    if (totalActivas <= 2) return "yellow";
    return "blue";
  })();

  const prioridadLabel = (() => {
    if (totalActivas === 0) return "Operación";
    if (totalActivas <= 2) return "Novedades";
    return "Mantenimiento";
  })();

  return (
    <div className="line-status">
      <h3>Estados de las líneas</h3>
      <div className="status-tags">
        <span className={prioridadClass}><LuLoaderCircle /> {prioridadLabel}</span>
        <span className="yellow">
          <LuLoaderCircle /> {totalActivas} interrupciones reportadas
        </span>
        <span className={isWebSocketConnected ? "green" : "blue"}>
          <LuLoaderCircle /> {isWebSocketConnected ? "En línea" : "Sin conexión"}
        </span>
      </div>

      {loading ? <p>Cargando interrupciones...</p> : null}

      {!loading && totalActivas === 0 ? (
        <p>No hay interrupciones activas reportadas por soporte en este momento.</p>
      ) : null}

      {!loading && totalActivas > 0 ? (
        <ul>
          {interrupcionesActivas.slice(0, 5).map((interrupcion, index) => (
            <li key={interrupcion.id ?? interrupcion.idInterrupcion ?? `${interrupcion.tipo || interrupcion.tipoInterrupcion || "interrupcion"}-${index}`}>
              {interrupcion.tipo || interrupcion.tipoInterrupcion || "Interrupción"}
              {interrupcion.descripcion ? `: ${interrupcion.descripcion}` : ""}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
