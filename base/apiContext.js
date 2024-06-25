const { Factory: LoggerFactory } = require('./log');

/**
 * Provides access to the execution context within an HTTP request.
 * @class
 * @memberof base
 */
class ApiContext {
  /**
   * Initializes a new instance of `ApiContext`.
   * @param {IncomingMessage} request The request instance to initialize the context with.
   * @param {base.log.Logger} [logger] The logger to use with this context. If omitted, a new instance
   *     will be created automatically and initialized with the specified `request` object.
   */
  constructor(request, logger) {
    /**
     * The current request object
     * @type {IncomingMessage}
     */
    this.request = request;

    /**
     * The current response object
     * @type {ServerResponse}
     */
    this.response = request.res;

    /**
     * User of the express Request
     * @type {Object}
     */
    this.user = request.user;

    /**
     * Session of the express
     * @type {Object}
     */
    this.session = request.session;

    /**
     * The logger to use with this context.
     * @type {base.log.Logger}
     */
    this.logger = logger;

    if (!this.logger) {
      this.logger = LoggerFactory.createLogger('context', request);
    }
  }

  /**
   * Gets the cookies of this context's `request` property.
   * @type {Object}
   */
  get cookies() {
    return this.request.cookies;
  }

  /**
   * Sets header in response. Accepts multiple arguments for content-disposition.
   * @param {string} key Header key.
   * @param  {...any} args Arguments to be set in value.
   */
  setHeader(key, ...args) {
    if (String(key).toLowerCase() === 'content-disposition' && args.length === 2) {
      this.response.setHeader(key, getContentDispositionValue(...args));
      return;
    }
    this.response.setHeader(key, ...args);
  }
}

/**
 * Return content disposition value
 * @param {srtring} type
 * @param {string} name
 * @returns string containing value
 */
const getContentDispositionValue = (type = 'attachment', name = '') => {
  return `${type || 'attachment'};` + ` filename="${encodeURIComponent(name)}";` + ` filename*=UTF-8''${encodeURIComponent(name)}`;
};

module.exports = ApiContext;
