import { supabase } from '../config/supabase';
import type { IAlojamientoRepository } from '../repository/IAlojamientoRepository';

export class RoomieService {
  constructor(private alojamientoRepository: IAlojamientoRepository) {}

  public async cambiarEstadoBusquedaRoomie(alojamientoId: string, estudianteId: string, buscandoRoomie: boolean): Promise<boolean> {
    const alojamiento = await this.alojamientoRepository.obtenerPorId(alojamientoId);
    if (!alojamiento) {
      throw new Error("El alojamiento seleccionado no existe.");
    }

    // 1. Actualizar el estado en la tabla housing (como ya lo hacías)
    await this.alojamientoRepository.actualizarBusquedaRoomie(alojamientoId, buscandoRoomie);

    // 2. Sincronizar con la tabla publicacion_roomie según el diagrama de clases
    if (buscandoRoomie) {
      // Si activa la búsqueda, creamos la publicación del roomie
      const { error } = await supabase
        .from('publicacion_roomie')
        .upsert({ // upsert para evitar duplicados si ya existe
          inquilino_id: estudianteId,
          housing_id: alojamientoId,
          descripcion: `Buscando roomie para ${alojamiento.getTitulo()}`,
          estado: 'activo'
        }, { onConflict: 'housing_id' });

      if (error) {
        throw new Error(`Error al registrar la publicación de roomie: ${error.message}`);
      }
    } else {
      // Si desactiva la búsqueda, eliminamos la publicación de roomie
      const { error } = await supabase
        .from('publicacion_roomie')
        .delete()
        .eq('housing_id', alojamientoId)
        .eq('inquilino_id', estudianteId);

      if (error) {
        throw new Error(`Error al eliminar la publicación de roomie: ${error.message}`);
      }
    }

    return true;
  }
}