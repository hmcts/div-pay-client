const request = require('request-promise-native');
const logger = require('@hmcts/nodejs-logging').getLogger(__filename);

/**
 * Create a payment
 *
 * @param {Object} options
 * @param {Object} user User information
 * @param {string} serviceToken Bearer token for service to service calls
 * @param {number|string} user.id
 * @param {string} user.bearerToken
 * @param {string} [caseReference]
 * @param {string} [siteId=AA00] The identifier of the site associated with payment
 * @param {string} feeCode Fee type as taken from the fees register
 * @param {number} amount Fee amount as taken from the fees register. Amount is
 *   specified in pence, e.g 1000 for £10.00
 * @param {string} description Fee description as taken from the fees register
 * @param {string} returnUrl Must be a https URL to pass upstream validation
 *
 * @returns {Promise} Request promise as returned by request-promise-native
 * @see https://tools.hmcts.net/confluence/display/RP/Payment+Reference+Standardisation
 */
const create = (options = {}, user = {}, serviceToken = '', caseReference = '', siteId = 'AA00', feeCode = '',
  feeVersion = 1, amount = 0, description = '', returnUrl = '') => {
  if (!serviceToken) {
    return Promise.reject(new Error('Service Authorization Token must be set'));
  }

  if (!caseReference) {
    logger.error('Case Reference is not supplied.');
    return Promise.reject(new Error('Case Reference not supplied, throwing error'));
  }

  if (siteId === 'AA00') {
    logger.info('Default Site ID is being used.');
  }

  const uri = `${options.apiBaseUrl}/card-payments`;

  const body = {
    amount,
    ccd_case_number: caseReference,
    description,
    service: 'DIVORCE',
    currency: 'GBP',
    site_id: `${siteId}`,
    fees: [
      {
        calculated_amount: amount,
        code: feeCode,
        version: feeVersion
      }
    ]
  };
  const headers = {
    Authorization: `Bearer ${user.bearerToken}`,
    ServiceAuthorization: `Bearer ${serviceToken}`,
    'return-url': returnUrl
  };

  return request.post({ uri, body, headers, json: true });
};

module.exports = create;
