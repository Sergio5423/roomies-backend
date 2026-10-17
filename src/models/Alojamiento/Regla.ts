export class Regla {
  private id: string;
  
  private descripcion: string;

  constructor(
    id: string,
  
    descripcion: string,
  ) {
    this.id = id;
  
    this.descripcion = descripcion;
  }

  public getId(): string {
    return this.id;
  }

  public getDescripcion(): string {
    return this.descripcion;
  }
}