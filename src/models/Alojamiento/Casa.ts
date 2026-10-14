// src/models/Alojamiento/Casa.ts
import { TipoAlojamiento } from "./TipoAlojamiento";
import { PoliticaCasa } from "../Bridge/PoliticaCasa";
import type { IPoliticaContrato } from "../Bridge/IPoliticaContrato";

export class Casa extends TipoAlojamiento {
  constructor(politica: IPoliticaContrato = new PoliticaCasa()) {
    super(politica);
  }

  public getNombre(): string {
    return "Casa";
  }
}