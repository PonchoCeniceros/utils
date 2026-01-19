/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Respuseta generica para toda la aplicacion
 */
export interface ApiResponse<T> {
  isOk: boolean;
  mssg: string;
  data?: T;
  expired?: boolean;
}

/**
 * Type Guard para verificar si un objeto es una ApiResponse<T>
 */
export function isApiResponse<T>(
  obj: unknown,
  validateData?: (data: unknown) => data is T // Recibimos el isOrder aquí
): obj is ApiResponse<T> {

  const isBasicResponse = (
    typeof obj === 'object' &&
    obj !== null &&
    'isOk' in obj &&
    'mssg' in obj
  );

  if (!isBasicResponse) return false;

  // Si no pasamos validador, solo validamos la estructura básica
  if (!validateData) return true;

  // Si pasamos validador, comprobamos que 'data' cumpla con él
  return validateData((obj as any).data);
}
