// infraestructura
import express from 'express';
import * as controller from './controllers.js';

/**
 *
 */
export default function commonRoutes() {
  const router = express.Router();

  /**
   * Rutas definidas para la API
   */
  router.get('/', controller.healthEndpoint);
  return router;
}
