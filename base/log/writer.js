/**
 * Provides a writer with different transports.
 * @memberof base.log
 */
class Writer {
  constructor(transports = []) {
    this.transports = transports;
  }

  log(level, ...args) {
    // Stringify Error manually by properties.
    // https://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify
    const parsedArgs = [...args].map((a) => (a instanceof Error ? JSON.stringify(a, Object.getOwnPropertyNames(a)) : a));
    const msg = parsedArgs.reduce((a, b) => `${a} ${typeof b === 'object' ? JSON.stringify(b) : b}`, '');
    this.transports.forEach((transport) => {
      transport[level]?.(msg, ...parsedArgs);
    });
  }
}

module.exports = Writer;
