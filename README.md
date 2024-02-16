# Daraja.js

A node.js wrapper for seamless integration with Mpesa's Daraja API. This library provides a builder-style interface to enhance the ease of use. Visit https://daraja-sdks.github.io to find implementations in other languages and more documentation.

## Integrated APIs:

- ✅ Mpesa Customer to Business (C2B)
- ✅ Mpesa Express/Lipa na Mpesa Online/STK Push
- ✅ Lipa na Mpesa Query
- ✅ Mpesa Business to Customer (B2C)
- ✅ Mpesa Transaction Status query
- ✅ Mpesa Account Balance query
- ✅ Mpesa Reversals

## Documentation

This is a fork of the original. More In-depth documentation on library usage can be found [here](https://daraja-sdks.github.io/en/impl/node).

## Getting Started
```shell
pnpm add https://github.com/kgarchie/daraja.js.git
```

## Creating an app instance

To get started, create an instance of the `Mpesa` class:

```js
// with es-modules syntax
import { Mpesa } from "daraja.js"

// with common-modules syntax
const Mpesa = require("daraja.js").Mpesa

// create an app instance
const app = new Mpesa({
    consumerKey: process.env.APP_KEY, // required
    consumerSecret: process.env.APP_SECRET, // required
    initiatorPassword: "Safaricom999!*!", // required only in production
    organizationShortCode: 174379, // optional
    certificatePath: "some/path", // optional
    securityCredential: "someSecureCredential" // optional
})
```

## STK Push / Lipa na Mpesa Online / Mpesa Express API:

```js
// ...

const res = await app
  .stkPush()
  .amount(1)
  .callbackURL("https://example.com/callback")
  .phoneNumber(254708374149)
  .lipaNaMpesaPassKey(process.env.LNM_PASSKEY)
  .send();

console.log(res.isOkay());
```

## STK Query API:

```js
// ...

const res = await app
  .stkPush()
  .shortCode("174379")
  .checkoutRequestID("ws_CO_DMZ_123212312_2342347678234")
  .lipaNaMpesaPassKey(process.env.LNM_PASSKEY)
  .queryStatus(); // sends the query request
```

## Customer to business(C2B) simulate API:

```js
// ...

const res = await app
  .c2b()
  .shortCode("600998")
  .accountNumber("Bill payment")
  .amount(1)
  .phoneNumber(254708374149)
  .simulate();
```

## Customer to business(C2B) Register URLs API:

```js
// ...

const res = await app
  .c2b()
  .shortCode("600998")
  .confirmationURL("https://example.com/callback")
  .validationURL("https://example.com/callback")
  .callbackURL("https://example.com/callback")
  .registerURLS();
```

## Business to customer(B2C) API:

```js
// ...

const res = await app
  .b2c()
  .amount(1)
  .phoneNumber(254708374149)
  .shortCode("600982")
  .resultURL("https://example.com/callback")
  .timeoutURL("https://example.com/callback")
  .send();
```

## Transaction Status API:

```js
// ...

const res = await app
  .transactionStatus()
  .shortCode("600998")
  .transactionID("OEI2AK4Q16")
  .timeoutURL("https://example.com/callback")
  .resultURL("https://example.com/callback")
  .queryStatus();
```

## Account Balance API:

```js
// ...

const res = await app
  .accountBalance()
  .shortCode("600998")
  .timeoutURL("https://example.com/callback")
  .resultURL("https://example.com/callback")
  .query();
```

## Reversals API:

```js
// ...

const res = await app
  .reversal()
  .amount(1)
  .shortCode("600998")
  .initiator("testapi")
  .transactionID("OEI2AK4Q16")
  .resultURL("https://example.com/callback")
  .timeoutURL("https://example.com/callback")
  .send();
```
