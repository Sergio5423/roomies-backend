// src/models/Alojamiento/UbicacionFlyweight.ts
export class UbicacionFlyweight {
  constructor(
    private readonly ciudad: string,
    private readonly barrio: string
  ) {}

  public getCiudad(): string {
    return this.ciudad;
  }

  public getBarrio(): string {
    return this.barrio;
  }
}