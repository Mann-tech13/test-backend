const Logger = require('./logger');
const Repository = require('./repository');
const Factory = require('./factory');

/**
 * The default log levels
 * @type {String[]}
 * @memberOf base.log
 */
const LogLevels = ['debug', 'info', 'warn', 'error', 'fatal'];

function initialize(logLevels = LogLevels) {
  Logger.setupLevels(logLevels);

  Repository.setDefault(Factory.createWriter());
}

initialize();

module.exports = Logger;
module.exports.Logger = Logger;
module.exports.LogLevels = LogLevels;
module.exports.Repository = Repository;
module.exports.Factory = Factory;
module.exports.initialize = initialize;
