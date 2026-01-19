/**
 * Result generico para toda la aplicacion
 */
export interface Result<T> {
  isOk: boolean;
  data?: T;
  mssg: string;
}
