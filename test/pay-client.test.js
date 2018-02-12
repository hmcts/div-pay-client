/* eslint-env mocha */
/* eslint-disable no-undefined */
const { expect } = require('chai').use(require('chai-as-promised'));
const sinon = require('sinon');
const request = require('request-promise-native');

const payClient = require('../index');

describe('payClient', () => {
  let client = {}, options = {};

  before(() => {
    sinon.stub(request, 'get');
    sinon.stub(request, 'post');
  });

  beforeEach(() => {
    options = {
      apiBaseUrl: 'http://base-url',
      serviceAuthorizationToken: 'service-token',
      serviceIdentification: 'XYZ1'
    };
    client = payClient.init(options);
  });

  afterEach(() => {
    request.get.reset();
    request.post.reset();
  });

  after(() => {
    request.get.restore();
    request.post.restore();
  });

  it('checks for Service Identification', () => {
    // Arrange.
    const payClientWithMissingServiceId = () => {
      return payClient.init({ serviceAuthorizationToken: 'foo' });
    };
    // Assert.
    expect(payClientWithMissingServiceId).to.throw();
  });

  describe('#create', () => {
    let user = {}, serviceToken = '', caseReference = '', siteId = '',
      amount = 0, description = '', returnUrl = '', feeCode = '';
    const fiveThousand = 5000;

    beforeEach(() => {
      user = { id: 99, bearerToken: 'user-token' };
      serviceToken = 'service-token';
      caseReference = 'CASE-REFERENCE';
      siteId = 'some-site-id';
      amount = fiveThousand;
      description = 'description';
      returnUrl = 'https://return-url';
      feeCode = 'CODE';
    });

    context('Service token is not set', () => {
      it('rejects early', () => {
        // Act.
        expect(client.create(user, undefined, caseReference, feeCode, amount,
          description, returnUrl))
          .to.be.rejectedWith('Service Authorization Token must be set');
      });
    });

    context('Case reference is set', () => {
      it('makes the request according to contract', () => {
        // Act.
        client.create(user, serviceToken, caseReference, siteId, feeCode,
          amount, description, returnUrl);
        // Assert.
        const { args } = request.post.getCall(0);
        expect(args[0].uri).to.equal(`${options.apiBaseUrl}/users/${user.id}/payments`);
        expect(args[0].body.amount).to.equal(amount);
        expect(args[0].body.reference).to.equal(`${options.serviceIdentification}$$$${caseReference}$$$${siteId}$$$${feeCode}`);
        expect(args[0].body.description).to.equal(description);
        expect(args[0].body.return_url).to.equal(returnUrl);
        expect(args[0].headers.Authorization).to.equal(`Bearer ${user.bearerToken}`);
        expect(args[0].headers.ServiceAuthorization).to.equal(`Bearer ${serviceToken}`);
      });
    });

    context('Case reference is not set', () => {
      it('creates a UUID as case reference', () => {
        // Act.
        client.create(user, serviceToken, undefined, siteId, feeCode, amount,
          description, returnUrl);
        // Assert.
        const { args } = request.post.getCall(0);
        expect(args[0].body.reference).to.match(new RegExp(`^${options.serviceIdentification}\\$\\$\\$[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\$\\$\\$${siteId}\\$\\$\\$${feeCode}$`));
      });
    });

    context('Site ID is not set', () => {
      it('falls back to the default site ID', () => {
        // Act.
        client.create(user, serviceToken, caseReference, undefined, feeCode,
          amount, description, returnUrl);
        // Assert.
        const { args } = request.post.getCall(0);
        expect(args[0].body.reference).to.match(new RegExp(`^${options.serviceIdentification}\\$\\$\\$${caseReference}\\$\\$\\$AA00\\$\\$\\$${feeCode}$`));
      });
    });
  });

  describe('#query', () => {
    let user = {}, serviceToken = '', paymentId = 0;
    const paymentIdNumber = 21238;

    beforeEach(() => {
      user = { id: 99, bearerToken: 'user-token' };
      serviceToken = 'service-token';
      paymentId = paymentIdNumber;
    });

    context('Payment ID is not set', () => {
      it('rejects early', () => {
        // Act.
        expect(client.query(user, serviceToken)).to.be.rejectedWith('Missing Payment ID');
      });
    });

    context('Service token is not set', () => {
      it('rejects early', () => {
        // Act.
        expect(client.query(user, undefined, paymentId))
          .to.be.rejectedWith('Service Authorization Token must be set');
      });
    });

    context('Payment ID is set', () => {
      it('makes the request according to contract', () => {
        // Act.
        client.query(user, serviceToken, paymentId);
        // Assert.
        const { args } = request.get.getCall(0);
        expect(args[0].uri).to.equal(`${options.apiBaseUrl}/users/${user.id}/payments/${paymentId}`);
        expect(args[0].headers.Authorization).to.equal(`Bearer ${user.bearerToken}`);
        expect(args[0].headers.ServiceAuthorization).to.equal(`Bearer ${options.serviceAuthorizationToken}`);
      });
    });
  });

  describe('#cancel', () => {
    let user = {}, serviceToken = '', paymentId = '';

    beforeEach(() => {
      user = { id: 99, bearerToken: 'user-token' };
      serviceToken = 'service-token';
      paymentId = '234786';
    });

    context('Service token is not set', () => {
      it('rejects early', () => {
        // Act.
        expect(client.cancel(user)).to.be.rejectedWith('Service Authorization Token must be set');
      });
    });

    context('Payment ID is not set', () => {
      it('rejects early', () => {
        // Act.
        expect(client.cancel(user, serviceToken)).to.be.rejectedWith('Missing Payment ID');
      });
    });

    context('Payment ID is set', () => {
      it('makes the request according to contract', () => {
        // Act.
        client.cancel(user, serviceToken, paymentId);
        // Assert.
        const { args } = request.post.getCall(0);
        expect(args[0].uri).to.equal(`${options.apiBaseUrl}/users/${user.id}/payments/${paymentId}/cancel`);
        expect(args[0].headers.Authorization).to.equal(`Bearer ${user.bearerToken}`);
        expect(args[0].headers.ServiceAuthorization).to.equal(`Bearer ${options.serviceAuthorizationToken}`);
      });
    });
  });
});
