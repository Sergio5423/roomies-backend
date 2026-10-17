import { TipoAlojamiento } from "./TipoAlojamiento";
import { PoliticaEstricta } from "../Bridge/PoliticaEstricta";
import type { IPoliticaContrato } from "../Bridge/IPoliticaContrato";

export class Pensionado extends TipoAlojamiento {
    constructor(politica: IPoliticaContrato = new PoliticaEstricta()) {
        super(politica);
    }    

    public getNombre(): string {
        return "Pensionado";
    }
}
