# Client library for payment-api

Client library for the Pay common component.

## Requirements

* Node >=10.15.2
* yarn


## Installation

As of now, this module is published only in a private repository.
We are working on publishing this project to NPM.
Until then, the package can be installed from its github URL, examples:

```bash
# Install the latest version
yarn add https://github.com/hmcts/div-pay-client

# Install a specific version
yarn add https://github.com/hmcts/div-pay-client#4.0.2
```


## Usage

First get a client

```es6
const payClient = require('@hmcts/div-pay-client')

const client = payClient.init({
  apiBaseUrl: 'https://payment-api:4501', // Base URL of payment-api
  serviceIdentification: 'DIV1', // Service ID for use in payment reference
})
```

### Create a payment

```js
client.create(user, serviceToken, caseReference, caseType, feeCode, amount, description, returnUrl)
  .then(responsePayload => {
    // JSON response payload should be available here.
  })
  .catch(err => {
    // Or an error in case of an error.
    throw err
  }) 
```

### Query a payment

```js
client.query(user, serviceToken, paymentId)
  .then(responsePayload => {
    // JSON response payload should be available here.
  })
  .catch(err => {
    // Or an error in case of an error.
    throw err
  }) 
```

### Cancel a payment

```js
client.cancel(user, serviceToken, paymentId)
  .then(responsePayload => {
    // The response body is empty with status code 204 on success.
    // A new query needs to run in order to confirm status.
  })
  .catch(err => {
    // Or an error in case of an error.
    throw err
  }) 
```

Please refer to the JSDoc blocks in `/src` for the function signatures.
See response examples in the `/examples` folder in this repo.


## Implementation notes


### User tokens

To make calls to payment-api the user must already be logged in and authenticated. For requests, the user id and the
token are required for every API call.


### Service tokens

In order to make requests a service token is required. This can be obtained from the `/lease` endpoint of
service-auth-provider-api using the already registered service name and a one time password generated using a service
secret.

See `@divorce/service-auth-provider-client` for an example implementation.


### Chargeable Fees

The fee being charged needs to come from the fees-register service.
To create payments, Fee Code, Fee Description and the Amount charged should be obtained from a fees-register service
response.


### Payment Reference

The payment reference is a string containing the service ID, a Case Reference, the Divorce Case Type, and a Fee Code concatenated with `$$$`.
For transactions where the Case Reference is not known, a random identifier is generated.
In these cases the Case Reference must be assigned to the payment for reconciliation purposes.


### Payment Status

The payment status will determine whether the transaction was successful. No details are given if an error occurs
as all payment errors are displayed to the user on the Gov Pay payment pages.
