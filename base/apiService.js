const ApiContext = require('./apiContext');

/**
 * Provides the base class for API services.
 * @memberof base
 * @requires ApiContext
 */
class ApiService {
  /**
   * Initializes a new instance of ApiService
   * @param {ApiContext} context The context to use with this service.
   * @throws {Error} If the `context` is undefined, or not an instance of `ApiContext`.
   */
  constructor(context) {
    if (!context || !(context instanceof ApiContext)) {
      throw new Error('The context argument needs to be an instance of ApiContext');
    }

    /**
     * The context under which the service is executing.
     * @type {ApiContext}
     */
    this.context = context;
  }
}

module.exports = ApiService;
