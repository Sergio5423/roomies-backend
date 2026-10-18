import type { Request, Response } from 'express';
import { RoomieService } from '../services/roomie.service';

export class RoomieController {
    constructor(private roomieService: RoomieService) { }

    public alternarBusquedaRoomie = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ error: "Usuario no autenticado" });
                return;
            }

            const alojamientoId = req.params.id;
            const estudianteId = req.user.id; // ID del estudiante obtenido del token JWT
            const { buscandoRoomie } = req.body;

            if (!alojamientoId || typeof alojamientoId !== 'string') {
                res.status(400).json({ error: "El ID proporcionado no es válido" });
                return;
            }

            if (typeof buscandoRoomie !== 'boolean') {
                res.status(400).json({ error: "El valor de 'buscandoRoomie' debe ser un booleano." });
                return;
            }

            await this.roomieService.cambiarEstadoBusquedaRoomie(alojamientoId, estudianteId, buscandoRoomie);

            res.status(200).json({
                mensaje: `Estado de búsqueda de roomie actualizado a: ${buscandoRoomie}`
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}