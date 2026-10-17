import { Alojamiento } from '../../models/Alojamiento/Alojamiento';
import { Ubicacion } from '../../models/Alojamiento/Ubicacion';
import { Caracteristica } from '../../models/Alojamiento/Caracteristica';
import { Precio } from '../../models/Alojamiento/Precio';
import { Regla } from '../../models/Alojamiento/Regla';
import { TipoAlojamientoFactory } from '../../models/Factory/TipoAlojamientoFactory';
import { AlojamientoBuilder } from '../../models/Builder/AlojamientoBuilder';
import type { IAlojamientoRepository } from '../../repository/IAlojamientoRepository';
import type { IPropietarioRepository } from '../../repository/IPropietarioRepository';
import { v4 as uuidv4 } from 'uuid';

export class AlojamientoService {
  constructor(
    private alojamientoRepository: IAlojamientoRepository,
    private propietarioRepository: IPropietarioRepository
  ) { }

  public async publicarAlojamiento(propietarioId: string, datosAlojamiento: any): Promise<Alojamiento> {
    const propietario = await this.propietarioRepository.obtenerPorId(propietarioId);
    if (!propietario) {
      throw new Error("Propietario no encontrado");
    }

    const instanciaTipo = TipoAlojamientoFactory.crear(datosAlojamiento.tipoAlojamiento);

    if (datosAlojamiento.reglas && Array.isArray(datosAlojamiento.reglas)) {
      const reglasDom: Regla[] = datosAlojamiento.reglas.map(
        (descripcion: string) => new Regla(uuidv4(), descripcion)
      );
      instanciaTipo.setReglas(reglasDom);
    }

    const u = datosAlojamiento.ubicacion || {};
    const ubicacion = new Ubicacion(
      u.direccion || '',
      u.ciudad || '',
      u.barrio || '',
      u.distancia || '',
      Number(u.latitud ?? 0),
      Number(u.longitud ?? 0)
    );

    const c = datosAlojamiento.caracteristica || datosAlojamiento.caracteristicas || {};
    const caracteristica = new Caracteristica(
      Number(c.numeroCuartos ?? 1),
      Number(c.metrosCuadrados ?? 0),
      Number(c.capacidad ?? 1),
      Boolean(c.amoblado),
      Boolean(c.buscandoRoomie)
    );

    const p = datosAlojamiento.precio || {};
    const precio = new Precio(
      Number(typeof p === 'object' ? p.precioMensual ?? p.monto : p)
    );

    const nuevoAlojamiento = new AlojamientoBuilder()
      .conIdentidad(uuidv4())
      .conPropietario(propietarioId)
      .conDescripcion(datosAlojamiento.titulo, datosAlojamiento.descripcion)
      .conTipo(instanciaTipo)
      .conImagenes(datosAlojamiento.imagenes || [])
      .conUbicacion(ubicacion)
      .conCaracteristicas(caracteristica)
      .conPrecio(precio)
      .construir();

    propietario.publicarAlojamiento(nuevoAlojamiento);

    return await this.alojamientoRepository.guardar(nuevoAlojamiento, propietarioId);
  }

  public async actualizarAlojamiento(alojamientoId: string, propietarioId: string, datosActualizados: any): Promise<Alojamiento> {
    const alojamientoExistente = await this.alojamientoRepository.obtenerPorId(alojamientoId);
    if (!alojamientoExistente) {
      throw new Error("Alojamiento no encontrado");
    }

    // Validación de seguridad: Verificar que el propietario exista y sea el dueño que lo publicó
    const propietario = await this.propietarioRepository.obtenerPorId(propietarioId);
    if (!propietario) {
      throw new Error("Propietario no autorizado o no encontrado");
    }

    const ownerId = alojamientoExistente.getLandlordId();
    if (ownerId && ownerId !== propietarioId) {
      throw new Error("No tienes autorización para modificar este alojamiento. Solo el propietario que lo publicó puede modificarlo.");
    }

    const tipo = datosActualizados.tipoAlojamiento
      ? TipoAlojamientoFactory.crear(datosActualizados.tipoAlojamiento)
      : alojamientoExistente.getTipoAlojamiento();

    const u = datosActualizados.ubicacion || {};
    const ubicacion = datosActualizados.ubicacion
      ? new Ubicacion(
        u.direccion || alojamientoExistente.getUbicacion().getDireccion(),
        u.ciudad || alojamientoExistente.getUbicacion().getCiudad(),
        u.barrio || alojamientoExistente.getUbicacion().getBarrio(),
        u.distancia || alojamientoExistente.getUbicacion().getDistancia(),
        Number(u.latitud ?? alojamientoExistente.getUbicacion().getLatitud()),
        Number(u.longitud ?? alojamientoExistente.getUbicacion().getLongitud())
      )
      : alojamientoExistente.getUbicacion();

    const c = datosActualizados.caracteristica || datosActualizados.caracteristicas || {};
    const caracteristicas = datosActualizados.caracteristica || datosActualizados.caracteristicas
      ? new Caracteristica(
        Number(c.numeroCuartos ?? alojamientoExistente.getCaracteristicas().getNumeroCuartos()),
        Number(c.metrosCuadrados ?? alojamientoExistente.getCaracteristicas().getMetrosCuadrados()),
        Number(c.capacidad ?? alojamientoExistente.getCaracteristicas().getCapacidad()),
        c.amoblado ?? alojamientoExistente.getCaracteristicas().getAmoblado(),
        c.buscandoRoomie ?? alojamientoExistente.getCaracteristicas().getBuscandoRoomie()
      )
      : alojamientoExistente.getCaracteristicas();

    const p = datosActualizados.precio ?? {};
    const precio = datosActualizados.precio != null
      ? new Precio(Number(typeof p === 'object' ? p.precioMensual ?? p.monto : p))
      : alojamientoExistente.getPrecio();

    const datosNuevos = new AlojamientoBuilder()
      .conIdentidad(alojamientoExistente.getId())
      .conPropietario(ownerId || propietarioId)
      .conDescripcion(
        datosActualizados.titulo ?? alojamientoExistente.getTitulo(),
        datosActualizados.descripcion ?? alojamientoExistente.getDescripcion())
      .conTipo(tipo)
      .conImagenes(datosActualizados.imagenes ?? alojamientoExistente.getImagenes())
      .conPuntuacion(datosActualizados.puntuacionPromedio ?? alojamientoExistente.getPuntuacionPromedio())
      .conPublicacion(alojamientoExistente.getFechaPublicacion(), alojamientoExistente.getEstado())
      .conUbicacion(ubicacion)
      .conCaracteristicas(caracteristicas)
      .conPrecio(precio)
      .construir();

    alojamientoExistente.actualizarAlojamiento(datosNuevos);

    return await this.alojamientoRepository.actualizar(alojamientoExistente);
  }

  public async cambiarEstado(alojamientoId: string, propietarioId: string, nuevoEstado: string): Promise<Alojamiento> {
    const alojamiento = await this.alojamientoRepository.obtenerPorId(alojamientoId);
    if (!alojamiento) {
      throw new Error("Alojamiento no encontrado");
    }

    const propietario = await this.propietarioRepository.obtenerPorId(propietarioId);
    if (!propietario) {
      throw new Error("Propietario no autorizado");
    }

    const ownerId = alojamiento.getLandlordId();
    if (ownerId && ownerId !== propietarioId) {
      throw new Error("No tienes autorización para cambiar el estado de este alojamiento. Solo el propietario que lo publicó puede modificarlo.");
    }

    alojamiento.actualizarEstado(nuevoEstado);

    return await this.alojamientoRepository.actualizar(alojamiento);
  }

  public async listarTodos(): Promise<Alojamiento[]> {
    return await this.alojamientoRepository.listarTodos();
  }

  public async obtenerPorId(id: string): Promise<Alojamiento | null> {
    return await this.alojamientoRepository.obtenerPorId(id);
  }

  public async duplicarAlojamiento(alojamientoIdOriginal: string, propietarioId: string): Promise<Alojamiento> {
    const original = await this.alojamientoRepository.obtenerPorId(alojamientoIdOriginal);
    if (!original) {
      throw new Error("El alojamiento a duplicar no existe.");
    }

    const propietario = await this.propietarioRepository.obtenerPorId(propietarioId);
    if (!propietario) {
      throw new Error("Propietario no encontrado");
    }

    const ownerId = original.getLandlordId();
    if (ownerId && ownerId !== propietarioId) {
      throw new Error("No tienes autorización para duplicar este alojamiento. Solo el propietario que lo publicó puede duplicarlo.");
    }

    const copia = original.clonar();
    propietario.publicarAlojamiento(copia);

    return await this.alojamientoRepository.guardar(copia, propietarioId);
  }

  public async eliminarAlojamiento(alojamientoId: string, propietarioId: string): Promise<boolean> {
    const alojamiento = await this.alojamientoRepository.obtenerPorId(alojamientoId);
    if (!alojamiento) {
      throw new Error("El alojamiento no existe o ya fue eliminado.");
    }

    const propietario = await this.propietarioRepository.obtenerPorId(propietarioId);
    if (!propietario) {
      throw new Error("Propietario no autorizado o no encontrado.");
    }

    const ownerId = alojamiento.getLandlordId();
    if (ownerId && ownerId !== propietarioId) {
      throw new Error("No tienes autorización para eliminar este alojamiento. Solo el propietario que lo publicó puede eliminarlo.");
    }

    return await this.alojamientoRepository.eliminar(alojamientoId);
  }
}
