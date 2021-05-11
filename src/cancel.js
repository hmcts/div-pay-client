const request = require('axios');

/**
 * Cancel a payment
 *
 * Note that a payment can be cancelled until it is not in a "finished" status.
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
const cancel = (options = {}, user = {}, serviceToken, paymentId) => {
  if (!serviceToken) {
    return Promise.reject(new Error('Service Authorization Token must be set'));
  }

  if (!paymentId) {
    return Promise.reject(new Error('Missing Payment ID'));
  }

  return request.post({
    uri: `${options.apiBaseUrl}/users/${user.id}/payments/${paymentId}/cancel`,
    headers: {
      Authorization: `Bearer ${user.bearerToken}`,
      ServiceAuthorization: `Bearer ${options.serviceAuthorizationToken}`
    },
    json: true
  });
};

module.exports = cancel;
