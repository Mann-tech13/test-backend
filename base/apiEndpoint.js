/**
 * Defines an API endpoint
 * @memberof base
 */
class ApiEndpoint {
  /** *
     * Initializes a new instance of endpoint.
     * @param {Object|Endpoint} [endpoint] The object that contains values to initialize
     *     the new instance with.
     */
  constructor(endpoint = {}) {
    /**
         * The endpoint's path (the part of the `uri` specific to this endpoint).
         * @type {string}
         */
    this.path = endpoint.path || '';

    /**
         *
         * @type {string}
         */
    this.verb = endpoint.verb || 'get';

    /**
         * An object that describes the endpoints's handler
         *
         * The handler consists of
         * - `controller` - the endpoint's controller class
         * - `method` - the endpoint's controller method
         * - `arguments` - array of expressions that specify the arguments to pass to the controller method when executing it.
         * @type {object}
         */
    this.handler = endpoint.handler || {};

    /**
         * An object that describes the endpoints's middleware.
         * @type {object<string,object[]>}
         */
    this.middleware = endpoint.middleware || {};

    /**
         * An object that describes how a valid request for this endpoint should look like.
         * @type {object}
         */
    this.request = endpoint.request || {};

    /**
         * A object that describes the result returned by this endpoint.
         * @type {object}
         */
    this.response = endpoint.response || {};
  }
}

module.exports = ApiEndpoint;
