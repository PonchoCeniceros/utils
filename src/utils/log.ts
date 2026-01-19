/**
 *
 */
export const colors = {
  red: "\x1b[31m%s\x1b[0m",
  green: "\x1b[32m%s\x1b[0m",
  blue: "\x1b[34m%s\x1b[0m",
  magenta: "\x1b[35m%s\x1b[0m",
  cyan: "\x1b[36m%s\x1b[0m",
};

/**
 *
 */
export class Log {
  ok(mssg: string) {
    console.log(colors.green, mssg);
  }

  error(mssg: string) {
    console.log(colors.red, mssg);
  }

  banner1(mssg: string) {
    console.log(colors.cyan, mssg);
  }

  banner2(mssg: string) {
    console.log(colors.blue, mssg);
  }

  banner3(mssg: string) {
    console.log(colors.magenta, mssg);
  }
}
