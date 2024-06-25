const Repository = require('./repository');
const util = require('util');

/**
 * Provides a customizable logging adapter.
 * @memberof base.log
 */
class Logger {
  /**
   * Initializes a new instance of `Logger`.
   * @param {String} [name] The name of the logger.
   * @param {Object} [state] The state of the logger.
   */
  constructor(name, state = {}) {
    /**
     * The name of this logger.
     *
     * If the logger has a name, each log message will automatically get the name
     * prepended to the beginning of the message.
     * @type {String}
     */
    this.name = name;

    /**
     * The logger's state.
     *
     * If the logger has a state, each log message will get the stringified
     * state appended to the end of the message.
     * @type {Object}
     */
    this.state = Logger.filterIncomingMessage(state);

    /**
     * Set of writers that this `Logger` writes to.
     * @type {Set}
     */
    this.writers = new Set();

    /**
     * Store timer label with time, to log the duration
     * like console.time and console.timeEnd
     * @type {Map}
     */
    this.timers = new Map();
  }

  /**
   * Writes the log message to all attached log writers.
   * @param {String} severity The message severity.
   * @param {String} message The log message to write.
   * @param {Object[]} [rest] Parameters to use as substitution values
   *     for any template placeholders in `message`.
   */
  log(...args) {
    this.writers.forEach((writer) => {
      writer.log.apply(writer, args);
    });
    // Do debug trace
    _writeDebugTrace(args);
  }

  /**
   * Writes the log message using the `Repository.DEFAULT` writer.
   * @param {String} severity The message severity.
   * @param {String} message The log message to write.
   * @param {Object[]} [rest] Parameters to use as substitution values
   *     for any template placeholders in `message`.
   */
  static log(...args) {
    if (args.length > 2) {
      args[args.length - 1] = Logger.filterIncomingMessage(args[args.length - 1]);
    }

    Repository.DEFAULT.log.apply(Repository.DEFAULT, args);

    // Do debug trace
    _writeDebugTrace(args);
  }

  /**
   * Adds a timer into `this.timers`. This will be returned or used when timeEnd is called.
   * @param {string} label A timer identifier.
   * @param {string} logLevel Decides while level to use for logging. Defaults to debug.
   */
  time(label = 'default', logLevel = 'debug') {
    this.timers.set(label, { time: new Date().getTime(), level: logLevel || 'debug' });
  }

  /**
   * Fetch the timer with specified label and log the time duration.
   * @param {string} label
   */
  timeEnd(label = 'default') {
    const timer = this.timers.get(label);
    if (!timer) {
      return;
    }

    this.log(timer.level, `[${this.name}] [Timer] ${label} : ${new Date().getTime() - timer.time}ms`, this.state);
    this.timers.delete(label);
  }

  /**
   * Sets the specified `levels` as log methods.
   *
   * The specified levels are set both statically and as instance methods for future instances of `Logger`.
   * @param {string[]} levels The list of log severity levels to set.
   */
  static setupLevels(levels) {
    // if we have previously attached already, delete that first
    if (Logger.__levels) {
      Logger.__levels.forEach((level) => {
        delete Logger.prototype[level];
        delete Logger[level];
      });
    }

    levels.forEach((level) => {
      // attach to all future instances of Logger
      Logger.prototype[level] = _getLoggerFn(level);

      // attach statically to the Logger object
      Logger[level] = (...args) => Logger.log.apply(Logger, [level, ...args]);
    });

    Logger.__levels = Array.from(levels);
  }

  /**
   * Filters the specified `state` from unnecessary properties.
   *
   * The filtering happens only if the type of `state` is an `IncomingMessage`
   * (the name of type of the `express` server's `req` argument typically
   * used in routes and middleware).
   *
   * The filtered version will be an object that matches specification:
   * ```javascript
   * {
   *     url: string,
   *     host: string,
   *     type: string, // request method
   *
   *     // if present as requestId
   *     requestId: number,
   *
   *     // if present as user: { ID, name, client }
   *     userId: number,
   *     userName: string,
   *     clientName: string,
   *
   *     // if present as session: { id }
   *     sessionId: string
   * }
   * ```
   * @param {Object} state The object to filter.
   * @return {Object} A filtered version of `state`, if its type is
   * `IncomingMessage`, or the unmodified `state` if it isn't.
   */
  static filterIncomingMessage(state) {
    if (state === undefined || state === null) {
      return {};
    }

    if (state.constructor.name !== 'IncomingMessage') {
      return state;
    }

    const result = {};

    if (state.requestId) {
      result.requestId = state.requestId;
    }

    result.url = state.path;
    result.host = state.headers && state.headers.host ? state.headers.host : '';
    result.type = state.method;
    result.queryParams = state.metaData ? state.metaData.queryParams : '';

    const { user } = state;

    if (user) {
      result.userId = user.ID;
      result.userName = user.name;
      result.clientName = user.client;
    } else if (state.metaData) {
      result.userId = state.metaData.userId;
      result.userName = state.metaData.userName;
      result.clientName = state.metaData.client;
    }

    return result;
  }
}

function _getLoggerFn(level) {
  return function (message) {
    // sometimes we expect first parameter to be an object
    // For e.g.-> logger.info(user, _addMetaData(username, client, user.ID));, server/lib/db/mssql/middleware.js
    let msg;
    if (typeof message === 'object') {
      msg = util.format(message);
    } else {
      msg = message;
    }

    const args = Array.from(arguments);
    args[0] = this.name ? `[${this.name}] ${msg}` : msg;

    if (Object.keys(this.state).length) {
      const lastArg = args[args.length - 1];
      // Backward compatibility - Remove it when we got rid of debugFunction
      if (args.length > 1 && lastArg === Object(lastArg) && lastArg.__source === 'debugFunction') {
        delete lastArg.__source;
        args[args.length - 1] = Object.assign({}, this.state, lastArg);
      } else {
        args.push(this.state);
      }
    }

    if (args[args.length - 1] && typeof args[args.length - 1] === 'object' && args[args.length - 1].__source === 'debugFunction') {
      delete args[args.length - 1].__source;
    }

    this.log.apply(this, [level, ...args]);
  };
}

function _writeDebugTrace(args) {
  const state = args[args.length - 1];
  if (state?.userId && state?.clientName) {
    const traceId = state.userId + '@' + state.clientName;
    const writers = Repository.getDebugWriterByPartialMatch(traceId);

    if (writers?.length > 0) {
      writers.forEach((writer) => writer.log.apply(writer, args));
    }
  }
}

module.exports = Logger;
