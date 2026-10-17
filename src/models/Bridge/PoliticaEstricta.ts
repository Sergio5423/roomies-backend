// src/models/Alojamiento/Bridge/PoliticaEstricta.ts
import type { IPoliticaContrato } from './IPoliticaContrato';

export class PoliticaEstricta implements IPoliticaContrato {
  public requiereContratoAnual(): boolean {
    return false; // No aplica contrato anual estricto
  }

  public validarReglaPermitida(descripcionRegla: string): boolean {
    // Ejemplo de regla no permitida en esta política
    if (descripcionRegla.toLowerCase().includes("mascota") || descripcionRegla.toLowerCase().includes("animal")) {
      return false; 
    }
    return true;
  }

  public getPoliticaNombre(): string {
    return "Política Restringida de Edificio/Pensionado";
  }
}