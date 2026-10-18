// src/models/Alojamiento/UbicacionFactory.ts
import { UbicacionFlyweight } from '../Flyweight/UbicacionFlyweight';

export class UbicacionFactory {
  private static cache: Map<string, UbicacionFlyweight> = new Map();

  public static obtenerInstancia(ciudad: string, barrio: string): UbicacionFlyweight {
    // Normalizamos la clave para evitar duplicados por mayúsculas o espacios
    const key = `${ciudad.trim().toLowerCase()}_${barrio.trim().toLowerCase()}`;

    if (!this.cache.has(key)) {
      this.cache.set(key, new UbicacionFlyweight(ciudad, barrio));
    }

    return this.cache.get(key)!;
  }
}