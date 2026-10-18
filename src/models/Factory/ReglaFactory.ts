import { Regla } from '../Alojamiento/Regla';

export class ReglaFactory {
  private static cache: Map<string, Regla> = new Map();

  public static obtenerRegla(id: string, descripcion: string): Regla {
    // Usamos la descripción como clave de caché ya que las reglas idénticas se comparten
    const key = descripcion.trim().toLowerCase();
    
    if (!this.cache.has(key)) {
      this.cache.set(key, new Regla(id, descripcion));
    }
    
    return this.cache.get(key)!;
  }
}