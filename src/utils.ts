/**
 * Función básica de sleep en ms
 */
export function sleep(ms: number) {
  new Promise((resolve) => setTimeout(resolve, ms));
}
