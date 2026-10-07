export class Regla {
  private id: string;
  //private nombre: string;
  private descripcion: string;

  constructor(
    id: string,
    //nombre: string,
    descripcion: string,
  ) {
    this.id = id;
    //this.nombre = nombre;
    this.descripcion = descripcion;
  }

  public getId(): string {
    return this.id;
  }

  public getDescripcion(): string {
    return this.descripcion;
  }
}