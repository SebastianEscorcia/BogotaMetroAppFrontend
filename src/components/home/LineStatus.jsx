import { LuLoaderCircle } from "react-icons/lu";

export const LineStatus = () => (
  <div className="line-status">
    <h3>Estados de las líneas</h3>
    <div className="status-tags">
      <span className="blue"><LuLoaderCircle /> Mantenimiento</span>
      <span className="yellow"><LuLoaderCircle /> Novedades</span>
      <span className="green"><LuLoaderCircle /> Operación</span>
    </div>
  </div>
);
