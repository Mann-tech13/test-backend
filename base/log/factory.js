const appInsight = require('applicationinsights');
const winston = require('winston');
require('dotenv').config();

const Logger = require('./logger');
const Repository = require('./repository');
const Writer = require('./writer');

/**
 * Provides a factory for loggers and writers.
 * @memberof base.log
 */
class Factory {
  /**
   * Create a new `Logger` instance.
   * @param {string} name The name to give to the created logger. Optional.
   * @param {Object} state The state object to assign to the created logger. Optional.
   * @return {Logger} A new `Logger` instance.
   */
  static createLogger(name, state) {
    const result = new Logger(name, state);
    result.writers.add(Repository.DEFAULT);
    return result;
  }

  static createWriter() {
    const transports = [];

    const transportInstance = Factory.createTransport();
    transports.push(transportInstance);

    return new Writer(transports);
  }

  static createTransport() {
    if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY_FOR_SERVER) {
      appInsight
        .setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY_FOR_SERVER)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true, true)
        .setSendLiveMetrics(false)
        .setDistributedTracingMode(appInsight.DistributedTracingModes.AI)
        .start();
    }

    return winston.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize({ all: true }), winston.format.simple())
        })
      ]
    });
  }
}

module.exports = Factory;
