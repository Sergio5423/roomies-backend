import type { IRepositorioFactory } from '../repository/factory - singleton/IRepositorioFactory';
import { SupabaseRepositorioFactory } from '../repository/factory - singleton/SupabaseRepositorioFactory';

// Punto de composición: Obtenemos la instancia única mediante Singleton
export const repositorioFactory: IRepositorioFactory = SupabaseRepositorioFactory.getInstance();