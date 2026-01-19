// infraestructura
import "dotenv/config";
import express from 'express';
import commonRoutes from "#src/common/routes.js";

/**
 * se instancia la API
 */
const api = express();

/**
 * middlewares de la aplicación
 */

/**
 * providers de la aplicación
 */

/**
 * router general de la API:
 * aqui se definen las rutas base para las
 * diversas funcionalidades de la aplicación
 */
api.get('/', commonRoutes());

export default api;
