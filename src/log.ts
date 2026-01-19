const DEBUGG_MODE = process.env.DEBUGG_MODE ?? true;

/**
 * ANSI color & style codes
 */
export const colors = {
  // básicos
  black: "\x1b[30m%s\x1b[0m",
  red: "\x1b[31m%s\x1b[0m",
  green: "\x1b[32m%s\x1b[0m",
  yellow: "\x1b[33m%s\x1b[0m",
  blue: "\x1b[34m%s\x1b[0m",
  magenta: "\x1b[35m%s\x1b[0m",
  cyan: "\x1b[36m%s\x1b[0m",
  white: "\x1b[37m%s\x1b[0m",

  // brillantes
  gray: "\x1b[90m%s\x1b[0m",
  brightRed: "\x1b[91m%s\x1b[0m",
  brightGreen: "\x1b[92m%s\x1b[0m",
  brightYellow: "\x1b[93m%s\x1b[0m",
  brightBlue: "\x1b[94m%s\x1b[0m",
  brightMagenta: "\x1b[95m%s\x1b[0m",
  brightCyan: "\x1b[96m%s\x1b[0m",
  brightWhite: "\x1b[97m%s\x1b[0m",

  // estilos
  bold: "\x1b[1m%s\x1b[0m",
  dim: "\x1b[2m%s\x1b[0m",
  underline: "\x1b[4m%s\x1b[0m",
  inverse: "\x1b[7m%s\x1b[0m",
};


/**
 *
 */
export class Log {
  private static enabled = DEBUGG_MODE;

  static enable() {
    Log.enabled = true;
  }

  static disable() {
    Log.enabled = false;
  }

  private static print(color: string, ...msg: unknown[]) {
    if (!Log.enabled) return;
    console.log(color, ...msg);
  }

  // semánticos
  static ok(...msg: unknown[]) {
    Log.print(colors.green, ...msg);
  }

  static success(...msg: unknown[]) {
    Log.print(colors.brightGreen, ...msg);
  }

  static error(...msg: unknown[]) {
    Log.print(colors.brightRed, ...msg);
  }

  static warn(...msg: unknown[]) {
    Log.print(colors.yellow, ...msg);
  }

  static info(...msg: unknown[]) {
    Log.print(colors.cyan, ...msg);
  }

  static debug(...msg: unknown[]) {
    Log.print(colors.gray, ...msg);
  }

  // banners / títulos
  static banner(...msg: unknown[]) {
    Log.print(colors.bold, ...msg);
  }

  static bannerBlue(...msg: unknown[]) {
    Log.print(colors.brightBlue, ...msg);
  }

  static bannerMagenta(...msg: unknown[]) {
    Log.print(colors.brightMagenta, ...msg);
  }

  static bannerInverse(...msg: unknown[]) {
    Log.print(colors.inverse, ...msg);
  }

  // utilitario
  static custom(color: keyof typeof colors, ...msg: unknown[]) {
    Log.print(colors[color], ...msg);
  }
}
