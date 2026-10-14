// src/models/Alojamiento/Bridge/PoliticaCasa.ts
import type { IPoliticaContrato } from './IPoliticaContrato';

export class PoliticaCasa implements IPoliticaContrato {
  public requiereContratoAnual(): boolean {
    return true; // Solo aplica obligatoriamente a casas
  }

  public validarReglaPermitida(_descripcionRegla: string): boolean {
    // En las casas se admiten todas las reglas (incluyendo mascotas)
    return true; 
  }

  public getPoliticaNombre(): string {
    return "Politica Estándar de Casa (Contrato Anual)";
  }
}