/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Respuseta generica para toda la aplicacion
 */
export interface ApiResponse<T> {
  isOk: boolean;
  mssg: string;
  data?: T; // Sigue siendo opcional
  expired?: boolean;
}

/**
 * Firma 1: Si pasas validador, 'data' se vuelve obligatorio y de tipo T
 */
export function isApiResponse<T>(
  obj: any,
  validateData: (data: unknown) => data is T
): obj is ApiResponse<T> & { data: T };

/**
 * Firma 2: Si no pasas validador, 'data' sigue siendo opcional (T | undefined)
 */
export function isApiResponse<T>(
  obj: any
): obj is ApiResponse<T>;

/**
 * Implementación
 */
export function isApiResponse<T>(
  obj: any,
  validateData?: (data: unknown) => data is T
): boolean {
  const basic = obj && typeof obj === 'object' && 'isOk' in obj && 'mssg' in obj;
  if (!basic) return false;

  // Si pedimos validar datos, 'data' debe existir y cumplir la guarda
  if (validateData) {
    return 'data' in obj && obj.data !== undefined && obj.data !== null && validateData(obj.data);
  }

  return true;
}
