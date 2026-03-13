import {
  MdAccountBalanceWallet,
  MdSyncAlt,
  MdDirectionsTransit,
} from "react-icons/md";

export const tipoConfig = {
  RECARGA: {
    class: "tipo-recarga",
    icon: MdAccountBalanceWallet ,
    label: "Recarga de salgo",
    valueClass: "valor-positivo",
    valuePrefix: "+",
  },
  TRANSFERENCIA: {
    class: "tipo-transferencia",
    icon: MdSyncAlt ,
    label: "Transferencia",
    valueClass: "valor-negativo",
    valuePrefix: "-",
  },
  PASAJE: {
    class: "tipo-pasaje",
    icon: MdDirectionsTransit ,
    label: "Pago Pasaje",
    valueClass: "valor-negativo",
    valuePrefix: "-",
  },
};

export const getTipoConfig = (tipo) => tipoConfig[tipo] || tipoConfig.PASAJE;

