import {httpClient} from '../../global/utils/helpers'

export const pasarSaldo = (numTelefono, valor) => {
    if (typeof numTelefono !== 'string' || !numTelefono.trim()) {
        throw new Error("El número de teléfono es inválido");
    }
    if (typeof valor !== 'number' || valor <= 0) {
        throw new Error("El valor debe ser un número mayor a cero");
    }

    return httpClient("/pagos/pasar-saldo", {
        method: "POST",
        body: JSON.stringify({ numTelefono, valor }),
    });
};