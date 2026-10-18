import type { IAlojamientoRepository } from './IAlojamientoRepository';
import { Alojamiento } from '../models/Alojamiento/Alojamiento';
import { AlojamientoMapper } from './AlojamientoMapper';
import { supabase } from '../config/supabase';

export class SupabaseAlojamientoRepository implements IAlojamientoRepository {

async guardar(alojamiento: Alojamiento, propietarioId: string): Promise<Alojamiento> {
  const ubicacion = alojamiento.getUbicacion(); // Instancia de la nueva clase Ubicacion con Flyweight
  
  const payload: any = {
    id: alojamiento.getId(),
    landlord_id: propietarioId || alojamiento.getLandlordId() || '',
    title: alojamiento.getTitulo(),
    description: alojamiento.getDescripcion(),
    type: alojamiento.getTipoAlojamiento().getNombre(),
    images: alojamiento.getImagenes(),
    average_rating: alojamiento.getPuntuacionPromedio(),
    status: alojamiento.getEstado(),
    location: {
      direccion: ubicacion.getDireccion(),
      ciudad: ubicacion.getCiudad(), //Flyewight
      barrio: ubicacion.getBarrio(), //Flyweight
      distancia: ubicacion.getDistancia(),
      latitud: ubicacion.getLatitud(),
      longitud: ubicacion.getLongitud()
    },
    features: {
      numeroCuartos: alojamiento.getCaracteristicas().getNumeroCuartos(),
      metrosCuadrados: alojamiento.getCaracteristicas().getMetrosCuadrados(),
      capacidad: alojamiento.getCaracteristicas().getCapacidad(),
      amoblado: alojamiento.getCaracteristicas().getAmoblado(),
      buscandoRoomie: alojamiento.getCaracteristicas().getBuscandoRoomie()
    },
    price: {
      precioMensual: alojamiento.getPrecio().getPrecioMensual()
    }
  };

  const { data, error } = await supabase
    .from('housing')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al guardar la publicación: ${error.message}`);
  }

  return alojamiento;
}

async actualizar(alojamiento: Alojamiento): Promise<Alojamiento> {
  const ubicacion = alojamiento.getUbicacion();

  const { error } = await supabase
    .from('housing')
    .update({
      title: alojamiento.getTitulo(),
      description: alojamiento.getDescripcion(),
      type: alojamiento.getTipoAlojamientoNombre(),
      images: alojamiento.getImagenes(),
      status: alojamiento.getEstado(),
      location: {
        direccion: ubicacion.getDireccion(),
        ciudad: ubicacion.getCiudad(),
        barrio: ubicacion.getBarrio(),
        distancia: ubicacion.getDistancia(),
        latitud: ubicacion.getLatitud(),
        longitud: ubicacion.getLongitud()
      },
      features: alojamiento.getCaracteristicas(),
      price: alojamiento.getPrecio(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', alojamiento.getId());

  if (error) {
    throw new Error(`Error al actualizar el alojamiento: ${error.message}`);
  }

  return alojamiento;
}

  async obtenerPorId(id: string): Promise<Alojamiento | null> {
    const { data, error } = await supabase
      .from('housing')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return AlojamientoMapper.desdeRegistro(data);
  }

  async listarTodos(): Promise<Alojamiento[]> {
    const { data, error } = await supabase
      .from('housing')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((h) => AlojamientoMapper.desdeRegistro(h));
  }

  async eliminar(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('housing')
      .delete()
      .eq('id', id);

    return !error;
  }

async actualizarBusquedaRoomie(id: string, buscandoRoomie: boolean): Promise<boolean> {
    // 1. Obtenemos el registro completo o la columna features actual de la tabla housing
    const { data: current, error: fetchError } = await supabase
      .from('housing')
      .select('features')
      .eq('id', id)
      .single();

    if (fetchError || !current) {
      throw new Error("Alojamiento no encontrado en la base de datos.");
    }

    // 2. Nos aseguramos de mantener un objeto base seguro combinando las propiedades anteriores
    const featuresActuales = typeof current.features === 'object' && current.features !== null 
      ? current.features 
      : {};

    const updatedFeatures = {
      ...featuresActuales,
      buscandoRoomie: Boolean(buscandoRoomie) // Forzamos booleano explícito
    };

    // 3. Actualizamos en Supabase el campo JSONB de manera directa
    const { error } = await supabase
      .from('housing')
      .update({ 
        features: updatedFeatures, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Error al actualizar el estado de roomie en housing: ${error.message}`);
    }

    return true;
  }
}