const userApi = require('./userApi');

/**
 * initialize routes of user API
 * @param {*} app
 */
module.exports = function initializeRoutes(app) {
  userApi.register(app);
};
