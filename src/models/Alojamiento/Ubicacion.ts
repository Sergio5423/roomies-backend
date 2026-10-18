// src/models/Alojamiento/Ubicacion.ts
import { UbicacionFlyweight } from '../Flyweight/UbicacionFlyweight';
import { UbicacionFactory } from '../Factory/UbicacionFactory';

export class Ubicacion {
  private flyweight: UbicacionFlyweight;
  private direccion: string;
  private distancia: number;
  private latitud: number;
  private longitud: number;

  constructor(
    direccion: string,
    ciudad: string,
    barrio: string,
    distancia: number,
    latitud: number,
    longitud: number
  ) {
    this.direccion = direccion;
    this.distancia = distancia;
    this.latitud = latitud;
    this.longitud = longitud;

    // Obtenemos o reutilizamos la instancia compartida a través de la Fábrica
    this.flyweight = UbicacionFactory.obtenerInstancia(ciudad, barrio);
  }

  // Métodos que delegan al estado intrínseco compartido
  public getCiudad(): string {
    return this.flyweight.getCiudad();
  }

  public getBarrio(): string {
    return this.flyweight.getBarrio();
  }

  // Getters para el estado extrínseco (único por alojamiento)
  public getDireccion(): string {
    return this.direccion;
  }

  public getDistancia(): number {
    return this.distancia;
  }

  public getLatitud(): number {
    return this.latitud;
  }

  public getLongitud(): number {
    return this.longitud;
  }
}