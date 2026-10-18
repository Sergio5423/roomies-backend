import type { TipoAlojamiento } from "./TipoAlojamiento";
import { Caracteristica } from "./Caracteristica";
import { Precio } from "./Precio";
import { Ubicacion } from "./Ubicacion";
import { ReglaFactory } from '../Factory/ReglaFactory';
import { Regla } from "./Regla";
import type { Clonable } from '../Prototype/Clonable';
import { TipoAlojamientoFactory } from '../Factory/TipoAlojamientoFactory';
import { v4 as uuidv4 } from 'uuid';

export class Alojamiento implements Clonable<Alojamiento> {
  private readonly id: string;
  private titulo: string;
  private descripcion: string;
  private tipoAlojamiento: TipoAlojamiento;
  private imagenes: string[];
  private puntuacionPromedio: number;
  private readonly fechaPublicacion: Date;
  private estado: string;
  private ubicacion: Ubicacion;
  private caracteristicas: Caracteristica;
  private precio: Precio;
  public landlord_id?: string | undefined;
  public propietarioId?: string | undefined;

  constructor(
    id: string,
    titulo: string,
    descripcion: string,
    tipoAlojamiento: TipoAlojamiento,
    imagenes: string[],
    puntuacionPromedio: number,
    fechaPublicacion: Date,
    estado: string,
    ubicacion: Ubicacion,
    caracteristicas: Caracteristica,
    precio: Precio,
    landlord_id?: string
  ) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.tipoAlojamiento = tipoAlojamiento;
    this.imagenes = [...imagenes];
    this.puntuacionPromedio = puntuacionPromedio;
    this.fechaPublicacion = fechaPublicacion;
    this.estado = estado;
    this.ubicacion = ubicacion;
    this.caracteristicas = caracteristicas;
    this.precio = precio;
    this.landlord_id = landlord_id;
    this.propietarioId = landlord_id;
  }

  // ==========================================
  // IMPLEMENTACIÓN DEL PATRÓN PROTOTYPE
  // ==========================================
  public clonar(): Alojamiento {
    const tipoClonado = TipoAlojamientoFactory.crear(this.tipoAlojamiento.getNombre());

    const reglasClonadas = this.getReglas().map(
      (r) => ReglaFactory.obtenerRegla(uuidv4(), r.getDescripcion())
    );
    tipoClonado.setReglas(reglasClonadas);

    const ubicacionClonada = new Ubicacion(
      this.ubicacion.getDireccion(),
      this.ubicacion.getCiudad(),
      this.ubicacion.getBarrio(),
      this.ubicacion.getDistancia(),
      this.ubicacion.getLatitud(),
      this.ubicacion.getLongitud()
    );

    const caracteristicasClonadas = new Caracteristica(
      this.caracteristicas.getNumeroCuartos(),
      this.caracteristicas.getMetrosCuadrados(),
      this.caracteristicas.getCapacidad(),
      this.caracteristicas.getAmoblado(),
      this.caracteristicas.getBuscandoRoomie()
    );

    const precioClonado = new Precio(this.precio.getPrecioMensual());

    return new Alojamiento(
      uuidv4(),
      `Copia de ${this.titulo}`,
      this.descripcion,
      tipoClonado,
      [...this.imagenes],
      0,
      new Date(),
      'disponible',
      ubicacionClonada,
      caracteristicasClonadas,
      precioClonado,
      this.landlord_id
    );
  }

  public actualizarAlojamiento(datos: Alojamiento): void {
    this.titulo = datos.titulo;
    this.descripcion = datos.descripcion;
    this.tipoAlojamiento = datos.tipoAlojamiento;
    this.imagenes = [...datos.imagenes];
    this.puntuacionPromedio = datos.puntuacionPromedio;
    this.ubicacion = datos.ubicacion;
    this.caracteristicas = datos.caracteristicas;
    this.precio = datos.precio;
    if (datos.landlord_id) {
      this.landlord_id = datos.landlord_id;
      this.propietarioId = datos.landlord_id;
    }
  }

  public actualizarEstado(nuevoEstado: string): void {
    this.estado = nuevoEstado;
  }

  public getId(): string { return this.id; }
  public getTitulo(): string { return this.titulo; }
  public getDescripcion(): string { return this.descripcion; }
  public getTipoAlojamiento(): TipoAlojamiento { return this.tipoAlojamiento; }
  public getImagenes(): string[] { return [...this.imagenes]; }
  public getPuntuacionPromedio(): number { return this.puntuacionPromedio; }
  public getFechaPublicacion(): Date { return this.fechaPublicacion; }
  public getEstado(): string { return this.estado; }
  public getUbicacion(): Ubicacion { return this.ubicacion; }
  public getCaracteristicas(): Caracteristica { return this.caracteristicas; }
  public getPrecio(): Precio { return this.precio; }
  public getLandlordId(): string | undefined { return this.landlord_id || this.propietarioId; }
  public getPropietarioId(): string | undefined { return this.propietarioId || this.landlord_id; }

  public getTipoAlojamientoNombre(): string {
    return this.tipoAlojamiento.getNombre();
  }

  public getRequiereContratoAnual(): boolean {
    return this.tipoAlojamiento.getContratoAnual();
  }

  public getServiciosIncluidos(): string[] {
    return this.tipoAlojamiento.getServicios();
  }

  public getReglas(): Regla[] {
    return this.tipoAlojamiento.getReglas();
  }
}
