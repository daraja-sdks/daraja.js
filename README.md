
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/daraja-sdks/daraja.js/daraja.js-ci-workflow?label=CI&logo=github-actions)
![Codecov](https://img.shields.io/codecov/c/gh/ndaba1/daraja.js)


# Daraja.js

A node.js wrapper for seamless integration with Mpesa's Daraja API. This library provides a builder-style interface to enhance the ease of use.

## Integrated APIs:

- ✅ Mpesa Customer to Business (C2B)
- ✅ Mpesa Express/Lipa na Mpesa Online/STK Push
- ✅ Lipa na Mpesa Query
- ✅ Mpesa Business to Customer (B2C)
- ✅ Mpesa Transaction Status query
- ✅ Mpesa Account Balance query
- ✅ Mpesa Reversals

## Documentation

More In-depth documentation on library usage can be found [here](https://daraja-sdks.github.io/en/impl/node). Also, full-blown examples on library usage can be found at the daraja-sdks github repos.

### STK Push API

```js
const res = await app
  .stkPush()
  .amount(1)
  .callbackURL("https://example.com/callback")
  .phoneNumber(254708374149)
  .lipaNaMpesaPassKey(process.env.LNM_PASSKEY)
  .send();

console.log(res.isOkay());
```
