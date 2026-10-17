import type { IAlojamientoRepository } from '../repository/IAlojamientoRepository';

export class RoomieService {
  constructor(private alojamientoRepository: IAlojamientoRepository) {}

  public async cambiarEstadoBusquedaRoomie(alojamientoId: string, buscandoRoomie: boolean): Promise<boolean> {
    const alojamiento = await this.alojamientoRepository.obtenerPorId(alojamientoId);
    if (!alojamiento) {
      throw new Error("El alojamiento seleccionado no existe.");
    }

    return await this.alojamientoRepository.actualizarBusquedaRoomie(alojamientoId, buscandoRoomie);
  }
}