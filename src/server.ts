// infraestructura
import "dotenv/config";
import api from "#src/api.js";
import { Log } from "#utils";

/**
 * definir puerto de salida de la api
 */
const PORT = process.env.PORT ?? 3000;

/**
 * lanzamiento de la api
 */
const log = new Log();

api.listen(PORT, async () => {
  log.ok(`[🚀] api corriendo por el puerto ${PORT}`)
});
