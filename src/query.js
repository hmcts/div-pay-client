const request = require('axios');

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
 * @returns {Promise} Request promise as returned by axios
 */
const query = (options = {}, user = {}, serviceToken = '', reference = '') => {
  if (!serviceToken) {
    return Promise.reject(new Error('Service Authorization Token must be set'));
  }
  if (!reference) {
    return Promise.reject(new Error('Missing Reference'));
  }

  return request.get({
    uri: `${options.apiBaseUrl}/card-payments/${reference}`,
    headers: {
      Authorization: `Bearer ${user.bearerToken}`,
      ServiceAuthorization: `Bearer ${serviceToken}`
    },
    json: true
  });
};

module.exports = query;
