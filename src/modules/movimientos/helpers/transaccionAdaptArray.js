import { adaptTransaccionFromBackend } from "../../../adapters/transaccionAdapter";
export const convertirTransaccionArray = (transaccionArray) =>
  Array.isArray(transaccionArray)
    ? transaccionArray.map(adaptTransaccionFromBackend)
    : [];
