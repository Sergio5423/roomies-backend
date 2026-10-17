// src/models/Alojamiento/Bridge/IPoliticaContrato.ts
import type { Regla } from '../Alojamiento/Regla';

export interface IPoliticaContrato {
  requiereContratoAnual(): boolean;
  validarReglaPermitida(descripcionRegla: string): boolean;
  getPoliticaNombre(): string;
}