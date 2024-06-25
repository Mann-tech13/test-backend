const ApplicationError = require('../applicationError');

const writers = new Map();
const WriterName = {
  DEFAULT: 'DEFAULT',
};

/**
 * Provides a repository for writers.
 * @memberOf base.log
 * @static
 * @description The repository makes it easy to register and retrieve loggers, so that
 *     they can be reused as required.
 */
class Repository {
  /**
     * Gets the default writer.
     * @return {winstonLogger}
     * @throws {ApplicationError} ApplicationError.NotImplemented if a default writer hasn't been set yet.
     */
  static get DEFAULT() {
    if (!Repository.has(WriterName.DEFAULT)) {
      throw ApplicationError.create(ApplicationError.NotImplemented, 'Default writer not set!');
    }

    return Repository.get(WriterName.DEFAULT);
  }

  /**
     * Stores the specified `writer` under the specified `writerId`.
     * @param {string} writerId The key under which to store the writer.
     * @param {winstonLogger} writer The writer to store.
     * @return {winstonLogger}
     */
  static set(writerId, writer) {
    writers.set(writerId, writer);
  }

  /**
     * Gets the writer with the specified `writerId`.
     *
     * @param {string} writerId The key of the writer to get
     * @return {winstonLogger} The writer with the specified `writerId`.
     */
  static get(writerId) {
    return writers.get(writerId);
  }

  /**
     * Returns a value indicating whether the repository has a writer with the
     * specified `writerId`.
     * @param {string} writerId The key to check.
     * @return {boolean} `true` if a writer with the specified `writerId` exists.
     */
  static has(writerId) {
    return writers.has(writerId);
  }

  /**
     * Deletes the writer with the specified id.
     * @param {string} writerId The key of the writer to delete.
     */
  static delete(writerId) {
    writers.delete(writerId);
  }

  /**
     * Sets the default writer.
     * @param {winston.Logger} writer The writer to set.
     */
  static setDefault(writer) {
    Repository.set(WriterName.DEFAULT, writer);
  }

  /**
     * Get all the writers matched by trace id.
     * @param {string} traceId debug trace id of the user.
     * @return {Array<winston.Logger>} multiple writers based on trace id.
     */
  static getDebugWriterByPartialMatch(traceId) {
    const _writers = [];
    for (const key of writers.keys()) {
      if (key.indexOf(traceId) === 0) {
        _writers.push(writers.get(key));
      }
    }
    return _writers;
  }
}

module.exports = Repository;
