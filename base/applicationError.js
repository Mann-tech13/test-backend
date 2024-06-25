/**
 * Provides a base class and a factory for errors thrown by the application.
 * @memberOf base
 * @extends {Error}
 * @requires util
 */
class ApplicationError extends Error {
  /**
   * Initializes a new instance of `ApplicationError`.
   * @param {string} message The error message.
   * @param {Object} data Optional error data.
   */
  constructor(message, data) {
    super();

    if (typeof data === 'object') {
      Object.assign(this, data);
    }

    /**
     * Error message
     * @type {string}
     */
    this.message = message;

    /**
     * Http response code for error
     * @type {number}
     */
    this.code = ApplicationError.InvalidOperation;
  }
}

/**
 * `BadRequest` is an error that results from invalid inputs or parameters.
 * @const
 * @type {number}
 */
ApplicationError.BadRequest = 400;

/**
 * `InvalidOperation` is the default error code for for error that don't have a more specific representation.
 * @const
 * @type {number}
 */
ApplicationError.InvalidOperation = 500;

/**
 * `Unauthorized` is an error that indicates that the authentication is required of was invalid.
 * @const
 * @type {number}
 */
ApplicationError.Unauthorized = 401;

/**
 * `Forbidden` is any error where the current requestor doesn't have access to the requested object.
 * @const
 * @type {number}
 */
ApplicationError.Forbidden = 403;

/**
 * `NotFound` is any error where the object that was requested doesn't exist.
 * @const
 * @type {number}
 */
ApplicationError.NotFound = 404;

/**
 * `Conflict` isIndicates that the request could not be processed because of conflict in the current
 * state of the resource, such as an edit conflict between multiple simultaneous updates.
 * @const
 * @type {number}
 */
ApplicationError.Conflict = 409;

/**
 * `NotSupported` is any error where unsupported media type is provided.
 * @const
 * @type {number}
 */
ApplicationError.NotSupported = 415;

/**
 * `NotImplemented` is thrown when a given operation has been accounted for but
 * has not been implemented (for any reason).
 * @type {number}
 */
ApplicationError.NotImplemented = 501;

/**
 * `Timeout` error indicates that an operation didn't compelete within the
 * allocated amount of time.
 * @type {number}
 */
ApplicationError.Timeout = 504;

/**
 * Creates an instance of `ApplicationError`
 *
 * If `err` is provided as object, Message is extracted from it, otherwise Message is extracted from
 * `data` based on if it's description or error object.
 * @param {Object} err An error description, code or key.
 * @param {Object} data Error data, or description in case `err` is a code or a key.
 * @return {ApplicationError} A new instance of `ApplicationError`.
 */
ApplicationError.create = (err, data) => {
  let message = err;
  let info = data;
  let code = ApplicationError.InvalidOperation;
  let messageFromError;

  if (info) {
    messageFromError = typeof info === 'string' ? info : info.message;
  }

  if (typeof err === 'number') {
    const key = Object.keys(ApplicationError).filter((k) => ApplicationError[k] === err)[0];

    if (key) {
      code = ApplicationError[key];
      message = messageFromError || key;
    } else {
      code = err;
      message = messageFromError || String(err);
    }
  } else if (typeof err === 'string' && ApplicationError[err]) {
    code = ApplicationError[err];
    message = messageFromError || err;
  } else if (typeof err !== 'string' && info === undefined) {
    info = err;
    message = info.message || 'InvalidOperation';
  }

  const error = new ApplicationError(message, info);
  error.code = code;
  return error;
};

/**
 * Creates a new `ApplicationError` using the specified `message` and sets it's code to `ApplicationError.NotFound`
 * @param {string} message The error message.
 * @return {ApplicationError} The created error object.
 */
ApplicationError.notFound = (message) => ApplicationError.create(ApplicationError.NotFound, message);

/**
 * Creates a new `ApplicationError` using the specified `message` and sets it's code to `ApplicationError.NotSupported`
 * @param {string} message The error message.
 * @return {ApplicationError} The created error object.
 */
ApplicationError.notSupported = (message) => ApplicationError.create(ApplicationError.NotSupported, message);

/**
 * Creates a new `ApplicationError` using the specified `message` and sets it's code to `ApplicationError.InvalidOperation`
 * @param {string} message The error message.
 * @return {ApplicationError} The created error object.
 */
ApplicationError.invalidOperation = (message) => ApplicationError.create(ApplicationError.InvalidOperation, message);

/**
 * Creates a new `ApplicationError` using the specified `message` and sets it's code to `ApplicationError.NotImplemented`
 * @param {string} message The error message.
 * @return {ApplicationError} The created error object.
 */
ApplicationError.notImplemented = (message) => ApplicationError.create(ApplicationError.NotImplemented, message);

/**
 * Creates a new `ApplicationError` using the specified `message` and sets it's code to `ApplicationError.Timeout`
 * @param {string} message The error message.
 * @return {ApplicationError} The created error object.
 */
ApplicationError.timeout = (message) => ApplicationError.create(ApplicationError.Timeout, message);

/**
 * Creates a new `ApplicationError` using the specified `message` and sets it's code to `ApplicationError.Forbidden`
 * @param {string} message The error message.
 * @return {ApplicationError} The created error object.
 */
ApplicationError.forbidden = (message) => ApplicationError.create(ApplicationError.Forbidden, message);

/**
 * Creates a new `ApplicationError` using the specified `message` and sets it's code to `Unauthorized.NotFound`
 * @param {string} message The error message.
 * @return {ApplicationError} The created error object.
 */
ApplicationError.unauthorized = (message) => ApplicationError.create(ApplicationError.Unauthorized, message);

/**
 * Creates a new `ApplicationError` using the specified `message` and sets it's code to `BadRequest.NotFound`
 * @param {string} message The error message.
 * @return {ApplicationError} The created error object.
 */
ApplicationError.badRequest = (message) => ApplicationError.create(ApplicationError.BadRequest, message);

module.exports = ApplicationError;
