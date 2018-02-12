const request = require('request-promise-native');

/**
 * Get the status of a payment
 *
 * @param {Object} options
 * @param {Object} user User information
 * @param {number|string} user.id
 * @param {string} user.bearerToken
 * @param {string} serviceToken Bearer token for service to service calls
 * @param {number|string} paymentId Payment reference returned by payment-api on
 *   creating the payment
 *
 * @returns {Promise} Request promise as returned by request-promise-native
 */
const query = (options = {}, user = {}, serviceToken = '', paymentId = '') => {
  if (!serviceToken) {
    return Promise.reject(new Error('Service Authorization Token must be set'));
  }
  if (!paymentId) {
    return Promise.reject(new Error('Missing Payment ID'));
  }

  return request.get({
    uri: `${options.apiBaseUrl}/users/${user.id}/payments/${paymentId}`,
    headers: {
      Authorization: `Bearer ${user.bearerToken}`,
      ServiceAuthorization: `Bearer ${serviceToken}`
    },
    json: true
  });
};

module.exports = query;
