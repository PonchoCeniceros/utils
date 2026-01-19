// infraestructura
import { Request, Response } from 'express';

/**
 * Endpoint para checar la salud de la aplicacion
 */
export const healthEndpoint = async (_req: Request, res: Response) => {
  res.status(200).json({
    isOk: true,
    mssg: "ok",
    data: {
      uptime: process.uptime(),
      timestamp: Date.now()
    }
  });
}
