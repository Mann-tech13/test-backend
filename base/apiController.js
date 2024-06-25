const ApiContext = require('./apiContext');

/**
 * Provides a base class for other API controllers
 * @memberOf base
 * @requires ApiContext
 */
class ApiController {
  /**
   * Initializes a new instance of ApiController
   * @param {ApiContext} context The context to use with this controller.
   * @throws {Error} If the `context` is undefined, or not an instance of `ApiContext`.
   */
  constructor(context) {
    if (context === null || !(context instanceof ApiContext)) {
      throw new Error('The context argument needs to be an instance of ApiContext');
    }

    /**
     * The context under which the controller is executing.
     * @type {ApiContext}
     */
    this.context = context;
  }

  /**
   * Sets the response code to 200 (Ok) and outputs the specified result as JSON.
   * @param {Object} result The object to output.
   */
  respondOk(result = {}) {
    this.respondJson(result, 200);
  }

  /**
   * Sets the response code to the specified `errorCode`, and outputs the specified result.
   * @param {Object} result The object to output.
   * @param {Number} [errorCode] The error code to use.
   */
  respondError(result = {}, errorCode = 500) {
    this.respondJson(result, result.code ?? errorCode);
  }

  /**
   * Sets the response code to 404 (NotFound) and outputs the specified result as JSON.
   * @param {Object} result The object to output.
   */
  respondNotFound(result = {}) {
    this.respondJson(result, 404);
  }

  /**
   * Sets the specified response `statusCode` and outputs the specified result as JSON.
   * @param {Object} result The object to output.
   * @param {Number} [statusCode] The HTTP status code to set.
   * @private
   */
  respondJson(result = {}, statusCode = 200) {
    const response = this.context.response;
    response.status(statusCode).json(result);
  }

  /**
   * Sets the specified response `statusCode` and outputs the specified result.
   * @param {Object} result The object to output.
   * @param {Number} [statusCode] The HTTP status code to set.
   * @private
   */
  sendResponse(result = {}, statusCode = 200) {
    const response = this.context.response;
    response.status(statusCode).send(result);
  }

  /**\
   *
   */
  sendFile(result = '') {
    const response = this.context.response;
    response.setHeader('Content-disposition', `attachment; ${result.fileName}`);
    response.sendFile(result.filePath);
  }

  sendFileAsStream(stream) {
    const response = this.context.response;
    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
    stream.pipe(response);
  }
}

module.exports = ApiController;
