import type { IRepositorioFactory } from './IRepositorioFactory';
import { MemoriaAlojamientoRepository } from '../memoria/MemoriaAlojamientoRepository';
import { MemoriaPropietarioRepository } from '../memoria/MemoriaPropietarioRepository';

export class MemoriaRepositorioFactory implements IRepositorioFactory {
  // 1. Instancia única guardada estáticamente
  private static instance: MemoriaRepositorioFactory;

  private readonly propietarios: MemoriaPropietarioRepository;
  private readonly alojamientos: MemoriaAlojamientoRepository;

  // 2. Constructor PRIVADO
  private constructor() {
    this.propietarios = new MemoriaPropietarioRepository();
    this.alojamientos = new MemoriaAlojamientoRepository(this.propietarios);
  }

  // 3. Método de acceso global
  public static getInstance(): MemoriaRepositorioFactory {
    if (!MemoriaRepositorioFactory.instance) {
      MemoriaRepositorioFactory.instance = new MemoriaRepositorioFactory();
    }
    return MemoriaRepositorioFactory.instance;
  }

  public crearAlojamientoRepository() { return this.alojamientos; }
  public crearPropietarioRepository() { return this.propietarios; }
}