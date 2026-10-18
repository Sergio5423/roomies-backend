import { Inquilino } from '../models/Usuario/Inquilino';
import { PublicacionRoomie } from '../models/PublicacionRoomie';
import { AlojamientoMapper } from './AlojamientoMapper';
import { supabase } from '../config/supabase';

export class SupabaseInquilinoRepository {
  
  // 👇 Firma corregida correctamente con el array al final del objeto
  async obtenerInquilinosBuscandoRoomie(): Promise<{ inquilino: Inquilino; publicaciones: PublicacionRoomie[] }[]> {
    const { data, error } = await supabase
      .from('publicacion_roomie')
      .select(`
        *,
        profiles:inquilino_id (*),
        housing:housing_id (*)
      `);

    if (error || !data) {
      console.error("Error al obtener publicaciones de roomie:", error?.message);
      return [];
    }

    const mapaInquilinos = new Map<string, { inquilino: Inquilino; publicaciones: PublicacionRoomie[] }>();

    for (const row of data) {
      const perfil = row.profiles;
      const registroHousing = row.housing;

      if (!perfil || !registroHousing) continue;

      const inquilinoId = perfil.id;

      if (!mapaInquilinos.has(inquilinoId)) {
        const inquilino = new Inquilino(
          inquilinoId,
          perfil.first_name || '',
          perfil.last_name || '',
          perfil.email,
          perfil.phone || perfil.telefono || '',
          [],
          [],
          []
        );
        mapaInquilinos.set(inquilinoId, { inquilino, publicaciones: [] });
      }

      const alojamientoDom = AlojamientoMapper.desdeRegistro(registroHousing);

      const publicacion = new PublicacionRoomie(
        row.id,
        row.descripcion,
        new Date(row.fecha || row.created_at),
        row.estado || 'activo',
        alojamientoDom
      );

      mapaInquilinos.get(inquilinoId)!.publicaciones.push(publicacion);
    }

    return Array.from(mapaInquilinos.values());
  }
}