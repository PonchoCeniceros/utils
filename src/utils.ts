/**
 * Función básica de sleep en ms
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
