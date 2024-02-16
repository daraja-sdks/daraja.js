import { Mpesa } from "../src/index";
import {beforeAll, describe, it, expect} from "vitest";
import "dotenv/config";

describe("basic endpoints tests", () => {
  let app: Mpesa;

  beforeAll(async () => {
    console.log("APP KEY", process.env.APP_KEY);
    console.log("APP SECRET", process.env.APP_SECRET);
    console.log("LNM PASSKEY", process.env.LNM_PASSKEY);
    app = new Mpesa(
      {
        consumerKey: process.env.APP_KEY!,
        consumerSecret: process.env.APP_SECRET!,
        initiatorPassword: "Safaricom999!*!",
        organizationShortCode: 174379,
      },
      "sandbox"
    );
  });

  it("tests stk push", async () => {
    const res = await app
      .stkPush()
      .amount(1)
      .callbackURL("https://example.com/callback")
      .phoneNumber(254708374149)
      .lipaNaMpesaPassKey(process.env.LNM_PASSKEY!)
      .send();

    expect(res.isOkay()).toBe(true);
  });

  it("tests c2b simulate", async () => {
    const res = await app
      .c2b()
      .shortCode("600998")
      .accountNumber("Bill payment")
      .amount(1)
      .phoneNumber(254708374149)
      .simulate();

    expect(res.isOkay()).toBe(true);
  });

  it("tests c2b register urls", async () => {
    const res = await app
      .c2b()
      .shortCode("600998")
      .confirmationURL("https://example.com/callback")
      .validationURL("https://example.com/callback")
      .callbackURL("https://example.com/callback")
      .registerURLS();

    expect(res.isOkay()).toBe(true);
  });

  it("tests b2c simulation", async () => {
    const res = await app
      .b2c()
      .amount(1)
      .phoneNumber(254708374149)
      .shortCode("600982")
      .resultURL("https://example.com/callback")
      .timeoutURL("https://example.com/callback")
      .send();

    expect(res.isOkay()).toBe(true);
  });

  it("tests the transaction status api", async () => {
    const res = await app
      .transactionStatus()
      .shortCode("600998")
      .transactionID("OEI2AK4Q16")
      .timeoutURL("https://example.com/callback")
      .resultURL("https://example.com/callback")
      .queryStatus();

    expect(res.isOkay()).toBe(true);
  });

  it("tests the account balance api", async () => {
    const res = await app
      .accountBalance()
      .shortCode("600998")
      .timeoutURL("https://example.com/callback")
      .resultURL("https://example.com/callback")
      .query();

    expect(res.isOkay()).toBe(true);
  });

  it("tests the reversal API", async () => {
    const res = await app
      .reversal()
      .amount(1)
      .shortCode("600998")
      .initiator("testapi")
      .transactionID("OEI2AK4Q16")
      .resultURL("https://example.com/callback")
      .timeoutURL("https://example.com/callback")
      .send();

    expect(res.isOkay()).toBe(true);
  });
});
