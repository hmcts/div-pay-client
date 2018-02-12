const create = require('./src/create');
const query = require('./src/query');
const cancel = require('./src/cancel');

const payClient = {
  /**
   * Create a payment client
   *
   * @param {Object} options Options set with the following properties:
   *  - apiBaseUrl: URL of the payment-api service
   *  - serviceIdentification: A 4 character long string identifying the service
   *    in the payment reference string
   *
   * @returns {{create: (function(...[*]): options), query: (function(...[*])), cancel: (function(...[*]))}}
   */
  init: (options = {}) => {
    if (!options.serviceIdentification) {
      throw new Error('Service Identification must be set');
    }

    return {
      create: (...args) => {
        return create(options, ...args);
      },
      query: (...args) => {
        return query(options, ...args);
      },
      cancel: (...args) => {
        return cancel(options, ...args);
      }
    };
  }
};

module.exports = payClient;
