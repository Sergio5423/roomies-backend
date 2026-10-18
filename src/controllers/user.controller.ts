import type { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { SupabaseInquilinoRepository } from '../repository/SupabaseInquilinoRepository';

const inquilinoRepo = new SupabaseInquilinoRepository();

export class UserController {
  /**
   * Obtener perfil del usuario autenticado
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Usuario no autenticado.' });
        return;
      }

      res.status(200).json({
        message: 'Perfil obtenido exitosamente.',
        data: req.user,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener el perfil.' });
    }
  }

  /**
   * Actualizar información del perfil
   */
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Usuario no autenticado.' });
        return;
      }

      const updatedProfile = await UserService.updateProfile(req.user.id, req.body);

      res.status(200).json({
        message: 'Perfil actualizado exitosamente.',
        data: updatedProfile,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al actualizar el perfil.' });
    }
  }

  /**
   * Obtener usuario por ID
   */
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'El ID proporcionado no es válido.' });
        return;
      }

      const user = await UserService.getUserById(id);

      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado.' });
        return;
      }

      res.status(200).json({
        message: 'Usuario encontrado exitosamente.',
        data: user,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener el usuario.' });
    }
  }

  public static async getInquilinosBuscandoRoomie(req: Request, res: Response): Promise<void> {
    try {
      const resultados = await inquilinoRepo.obtenerInquilinosBuscandoRoomie();

      // Formateamos la salida para que sea fácil de consumir en el frontend
      const respuesta = resultados.map(({ inquilino, publicaciones }) => ({
        estudiante: {
          id: inquilino.getId(),
          nombre: `${inquilino.getFirstName()} ${inquilino.getLastName()}`,
          email: inquilino.getEmail(),
          telefono: inquilino.getTelefono()
        },
        publicacionesRoomie: publicaciones.map(pub => ({
          id: pub.getId(),
          descripcion: pub.getDescripcion(),
          estado: pub.getEstado(),
          fecha: pub.getFecha(),
          alojamiento: {
            id: pub.getAlojamiento().getId(),
            titulo: pub.getAlojamiento().getTitulo(),
            tipo: pub.getAlojamiento().getTipoAlojamientoNombre(),
            precio: pub.getAlojamiento().getPrecio().getPrecioMensual(),
            ubicacion: pub.getAlojamiento().getUbicacion(),
            caracteristicas: pub.getAlojamiento().getCaracteristicas()
          }
        }))
      }));

      res.status(200).json({
        mensaje: "Estudiantes y alojamientos buscando roomie obtenidos con éxito",
        data: respuesta
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}