// src/models/Alojamiento/Apartamento.ts
import { TipoAlojamiento } from "./TipoAlojamiento";
import { PoliticaEstricta } from "../Bridge/PoliticaEstricta";
import type { IPoliticaContrato } from "../Bridge/IPoliticaContrato";

export class Apartamento extends TipoAlojamiento {
  constructor(politica: IPoliticaContrato = new PoliticaEstricta()) {
    super(politica);
  }

  public getNombre(): string {
    return "Apartamento";
  }
}