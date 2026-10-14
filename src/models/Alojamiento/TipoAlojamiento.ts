// src/models/Alojamiento/TipoAlojamiento.ts
import type { Regla } from "./Regla";
import type { IPoliticaContrato } from "../Bridge/IPoliticaContrato";

export abstract class TipoAlojamiento {
  private serviciosEspecificos: string[] = [];
  private reglasEspecificas: Regla[] = [];
  
  // EL PUENTE (Bridge)
  protected politicaContrato: IPoliticaContrato;

  constructor(politicaContrato: IPoliticaContrato) {
    this.politicaContrato = politicaContrato;
  }

  public abstract getNombre(): string;

  // Delega la responsabilidad de la política al puente
  public getContratoAnual(): boolean {
    return this.politicaContrato.requiereContratoAnual();
  }

  public setReglas(reglas: Regla[]): void {
    // Filtra las reglas válidas según la política asignada
    this.reglasEspecificas = reglas.filter(r => 
      this.politicaContrato.validarReglaPermitida(r.getDescripcion())
    );
  }

  public getReglas(): Regla[] {
    return this.reglasEspecificas;
  }

  public getServicios(): string[] { return this.serviciosEspecificos; }
  public setServicios(servicios: string[]): void { this.serviciosEspecificos = servicios; }
  
  public getPolitica(): IPoliticaContrato { return this.politicaContrato; }
}