const ApiEndpoint = require('./apiEndpoint');
const ControllerFactory = require('./controllerFactory');
const MiddlewareFactory = require('./middlewareFactory');
const log = require('./log');

const trim = (value, expr = '/') => String(value).replace(new RegExp(`^${expr}*(.*?)${expr}*$`), '$1');

/**
 * Provides and interface for configuration and registration of API endpoints.
 * @memberof base
 * @requires ApiEndpoint
 * @requires CliTable,
 * @requires ControllerFactory
 * @requires MiddlewareFactory
 */
class ApiSchema {
  /**
   * Initializes a new instance of `ApiSchema'.
   * @param {String} name The public name of this schema.
   * @param {String} url The api base url to use as prefix for endpoint paths.
   * @param {Object<String, Object>} endpoints A dictionary object that defines the endpoints that belong to this schema.
   * @example
   * ```javascript
   * /## @endpoint #/
   * const registerAnimal = {
   *     path: 'register',
   *     validation: {
   *         body: {
   *             kind: Joi.string().allow(AnimalKinds).required(),
   *             age: Joi.number().int().min(0).max(40).required()
   *             name: Joi.string().required()
   *         }
   *     }
   * }
   *
   * /## @endpoint #/
   * const findAnimals = {
   *     path: 'find',
   *     validation: {
   *         query: {
   *             kind: Joi.string().allow(AnimalKinds).optional(),
   *             age: Joi.number().int().optional()
   *             name: Joi.string().optional()
   *         }
   *     }
   * }
   *
   * module.exports = new ApiSchema({
   *     name: 'Animal Shelter',
   *     url: '/api/shelter',
   *     endpoints: [
   *         registerAnimal,
   *         findAnimals
   *     ]
   * });
   * ```
   */
  constructor({ name, url, endpoints = [] } = {}) {
    /**
     * Name of api schema
     * @type {string}
     */
    this.name = name;

    /**
     * prefix url for all requests to an api for this schema
     * @type {string}
     */
    this.url = trim(url);

    /**
     * Array of api endpoints in this schema
     * @type {ApiEndpoint}
     */
    this.endpoints = [];

    /**
     * Object storing controller instance to handle api request with name of controller as key
     * @type {object}
     */
    this.factories = {};
    this.log = log.Factory.createLogger(`ApiSchema[${name}]`);
    if (Array.isArray(endpoints)) {
      endpoints.forEach((endpoint) => this.endpoints.push(new ApiEndpoint(endpoint)));
    } else {
      this.log.warn('Endpoint is not an instance of Array. Feature :', this.name);
    }
  }

  /**
   * Registers the API with the specified express `app`.
   * @param {express} app The express instance to register with.
   * @example
   * ```javascript
   * const schema = new ApiSchema({
   *     name: 'Animal Shelter',
   *     url: '/api/shelter',
   *     endpoints: [
   *         registerAnimal,
   *         findAnimals
   *     ]
   * });
   *
   * schema.register(app);
   * ```
   */
  register(app) {
    const prefix = '';

    this.log.info(`Registering endpoints for ${prefix}/${this.url}`);
    this.endpoints.forEach((endpoint) => this._registerEndpoint(app, prefix, endpoint));
  }

  /**
   * register endpoints
   * @param {string} app
   * @param {string} prefix
   * @param {object} endpoint
   * @returns {any}
   */
  _registerEndpoint(app, prefix, endpoint) {
    let { path, verb } = endpoint;
    const { handler, middleware = {} } = endpoint;

    path = trim(path);
    verb = verb.toLowerCase();

    const url = this.url ? `${prefix}/${this.url}/${path}` : `${prefix}/${path}`;
    const routeArguments = [url];

    const { controller, method } = handler;
    const methodArgs = handler.arguments || [];
    const factory = this.factories[controller] || (this.factories[controller] = new ControllerFactory(controller));

    middleware.validation = [endpoint.request];

    const middlewares = Object.keys(middleware)
      .map((id) => {
        let args = middleware[id];
        if (!Array.isArray(args)) {
          args = [args];
        }
        return MiddlewareFactory.create(id, args);
      })
      .sort((a, b) => {
        return b.priority > a.priority;
      });

    // pushing a anonymous function to execute all middlewares
    for (const middlewareObject of middlewares) {
      routeArguments.push(MiddlewareFactory.wrapMiddleware(middlewareObject));
    }

    routeArguments.push(factory.route(method, ...methodArgs));

    app[verb].apply(app, routeArguments);

    return [url, endpoint.verb, `${controller.name}.${method}(${methodArgs.join(', ')})`];
  }
}

module.exports = ApiSchema;
