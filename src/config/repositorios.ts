import type { IRepositorioFactory } from '../repository/factory/IRepositorioFactory';
import { SupabaseRepositorioFactory } from '../repository/factory/SupabaseRepositorioFactory';

// Punto de composición: Obtenemos la instancia única mediante Singleton
export const repositorioFactory: IRepositorioFactory = SupabaseRepositorioFactory.getInstance();