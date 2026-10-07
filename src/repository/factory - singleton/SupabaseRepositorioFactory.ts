import type { IRepositorioFactory } from './IRepositorioFactory';
import { SupabaseAlojamientoRepository } from '../SupabaseAlojamientoRepository';
import { SupabasePropietarioRepository } from '../SupabasePropietarioRepository';

export class SupabaseRepositorioFactory implements IRepositorioFactory {
  // 1. Instancia única estática
  private static instance: SupabaseRepositorioFactory;

  private readonly alojamientos: SupabaseAlojamientoRepository;
  private readonly propietarios: SupabasePropietarioRepository;

  // 2. Constructor PRIVADO
  private constructor() {
    this.alojamientos = new SupabaseAlojamientoRepository();
    this.propietarios = new SupabasePropietarioRepository();
  }

  // 3. Método de acceso global
  public static getInstance(): SupabaseRepositorioFactory {
    if (!SupabaseRepositorioFactory.instance) {
      SupabaseRepositorioFactory.instance = new SupabaseRepositorioFactory();
    }
    return SupabaseRepositorioFactory.instance;
  }

  public crearAlojamientoRepository() { return this.alojamientos; }
  public crearPropietarioRepository() { return this.propietarios; }
}