/**
 * Get jwt string based on role
 * @param {string} role
 * @returns String for jwt cookie name
 */
const getJwt = (role) => {
    return role + 'jwt';
  };
  
  module.exports = {
    user: 'user',
    admin: 'admin',
    getJwt
  };
  