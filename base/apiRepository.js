const ApiContext = require('./apiContext');
const { db } = require('../db/connection');

/**
 * Defines the options that specify how a query should be executed.
 * @memberof base
 * @typedef QueryRunOptions
 * @property {Object} [metaData] An object that provides information abbout the current context.
 * @requires ApiContext
 */
/**
 * Provides a data access layer for working with database.
 * @memberof base
 */
class ApiRepository {
  /**
   * Initializes a new instance of Repository
   *
   * @param {ApiContext} context The context to use with this repository.
   * @throws {Error} If the `context` is undefined, or not an instance of `ApiContext`.
   */
  constructor(context) {
    if (context === null || !(context instanceof ApiContext)) {
      throw new Error('The context argument needs to be an instance of ApiContext');
    }
    /**
     * The context under which the repository is executing.
     * @type {ApiContext}
     */
    this.context = context;
    /**
     * @type {object}
     */
    this.models = db;
    /**
     * @type {any}
     */
    this.redisClient = db['redis'];
  }
}
module.exports = ApiRepository;
