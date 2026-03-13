import { format, isSameWeek } from "date-fns";
import { es } from "date-fns/locale";

export const getMovimientoLabelFecha = (fecha) => {
  const date = new Date(fecha);
  const today = new Date();

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // domingo
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // sábado

  // if (date >= startOfWeek && date <= endOfWeek) {
  //   // Mostrar solo el día (ej: "Martes")
  //   return format(date, "EEEE", { locale: es });
  // }
  
  if(isSameWeek(date,today,{locale:es})){
    return format(date, "EEEE", { locale: es });
  }

  // Mostrar fecha corta (ej: "03/03/2026")
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
};
