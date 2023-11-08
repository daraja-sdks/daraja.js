import { RSA_PKCS1_PADDING } from "constants";
import { publicEncrypt } from "crypto";
import { promises } from "fs";
import { AccountBalance } from "./api/accountBalance";
import { BusinessToCustomer } from "./api/b2c";
import { CustomerToBusiness } from "./api/c2b";
import { Reversal } from "./api/reversal";
import { STKPush, STKPushResultWrapper } from "./api/stkPush";
import { TransactionStatus } from "./api/transactionStatus";
import { routes } from "./models/routes";
import {
  HttpClient,
  _BuilderConfig,
  getProductionCert,
  getSandboxCert,
} from "./utils";
import { ValidationRequestWrapper } from "./wrappers";

interface MpesaCredentials {
  consumerKey: string;
  consumerSecret: string;
  securityCredential?: string;
  initiatorPassword?: string;
  certificatePath?: string;
  organizationShortCode?: number;
}

export class Mpesa {
  private _http: HttpClient;
  private _lastTokenTime: number;
  private _currentToken: string;
  private consumerKey: string;
  private consumerSecret: string;
  private initiatorPassword: string;
  private securityCredential: string;
  private globalShortCode: number;
  private builderCfg: _BuilderConfig;
  private debugMode: boolean;

  constructor(
    {
      consumerKey,
      consumerSecret,
      securityCredential,
      initiatorPassword,
      certificatePath,
      organizationShortCode,
      debug = process.env.DEBUG === "true",
    }: MpesaCredentials & { debug?: boolean },
    private environment = "sandbox"
  ) {
    this.debugMode = debug;
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.globalShortCode = organizationShortCode;
    this._http = new HttpClient(this.environment);

    if (!initiatorPassword && this.environment === "sandbox") {
      this.initiatorPassword = "Safaricom999!*!";
    }

    if (!securityCredential && !initiatorPassword) {
      throw new Error(
        "You must provide either the security credential or initiator password. Both cannot be null"
      );
    }

    if (!securityCredential) {
      this.generateSecurityCredential(initiatorPassword, certificatePath);
    } else {
      this.securityCredential = securityCredential;
    }

    this.builderCfg = {
      debug: this.debug.bind(this),
      getAuthToken: this._getAuthToken.bind(this),
      securityCredential: this.securityCredential,
      http: this._http,
      shortCode: this.globalShortCode,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private debug(...args: any[]) {
    this.debugMode && console.log(...args);
  }

  private async _getAuthToken(): Promise<string> {
    if (Date.now() - this._lastTokenTime < 3599) {
      // cache hit, sort of :)
      return this._currentToken;
    } else {
      // token expired
      try {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const { data } = await this._http.get<any>(routes.oauth, {
          Authorization:
            "Basic " +
            Buffer.from(this.consumerKey + ":" + this.consumerSecret).toString(
              "base64"
            ),
        });

        this._currentToken = data.access_token;
        this._lastTokenTime = Date.now();

        return data.access_token;
      } catch (error) {
        process.env.DEBUG && console.log(error);
        throw new Error(error);
      }
    }
  }

  private async generateSecurityCredential(
    password: string,
    certificatePath: string
  ) {
    let certificate: string;

    if (certificatePath != null) {
      const certificateBuffer = await promises.readFile(certificatePath);

      certificate = String(certificateBuffer);
    } else {
      certificate =
        this.environment === "production"
          ? getProductionCert()
          : getSandboxCert();
    }

    this.securityCredential = publicEncrypt(
      {
        key: certificate,
        padding: RSA_PKCS1_PADDING,
      },
      Buffer.from(password)
    ).toString("base64");
  }

  /**
   * Customer To Business
   *
   * @description This method returns an instance of the `CustomerToBusiness` class to which you attach methods in a builder-style interface.
   * @returns {CustomerToBusiness} An instance of the CustomerToBusiness class
   * @example
   * let app = new Mpesa({...}) // Pass credentials here
   *
   * // c2b simulate example
   * const c2b = await app
   *   .c2b()
   *   .shortCode("600998")
   *   .accountNumber("Bill payment")
   *   .amount(1)
   *   .phoneNumber(254708374149)
   *   .simulate(); // This method builds the request and invokes the daraja api, returning the response asynchronously.
   *
   * // c2b resgiter URLs example
   * const res = await app
   *  .c2b()
   *  .shortCode("600998")
   *  .confirmationURL("https://example.com/callback")
   *  .validationURL("https://example.com/callback")
   *  .callbackURL("https://example.com/callback")
   *  .registerURLS(); // Builds the request and invokes the api, returning the response wrapped in a utility class
   */
  public c2b(): CustomerToBusiness {
    return new CustomerToBusiness(this.builderCfg);
  }

  /**
   * Business to Customer
   *
   * @description This method returns an instance of the `BusinessToCustomer` class to which you attach methods in a builder-style interface. The required fields are: `amount`, `phoneNumber`, `shortCode`, `resultURL` and `timeoutURL`.
   * @returns {BusinessToCustomer} An instance of the BusinessToCustomer class
   * @example
   * let app = new Mpesa({...}) // Pass credentials here
   *
   * const res = await app
   *   .b2c()
   *   .amount(1)
   *   .phoneNumber(254708374149)
   *   .shortCode("600982")
   *   .resultURL("https://example.com/callback")
   *   .timeoutURL("https://example.com/callback")
   *   .send(); // The actual method that invokes the request
   */
  public b2c(): BusinessToCustomer {
    return new BusinessToCustomer(this.builderCfg);
  }

  /**
   * Lipa Na Mpesa Online / STK Push / Mpesa Express
   * @description This method is used to construct an instance of the `STKPush` class by passing various credentials after which you can either send and stk push request or query the status of an already sent transaction
   * @returns {STKPush} Returns an instance of the `STKPush` class for further manipulation
   * @example
   * let app = new Mpesa({...}) // Pass credentials here
   *
   * // STK Push request example
   * const res = await app
   *  .stkPush()
   *  .shortCode("174379")
   *  .amount(1)
   *  .callbackURL("https://example.com/callback")
   *  .phoneNumber(254708374149)
   *  .lipaNaMpesaPassKey(process.env.LNM_PASSKEY)
   *  .send(); // sends the request
   *
   * // Query status of an STK Push transaction
   * const res = await app
   *  .stkPush()
   *  .shortCode("174379")
   *  .checkoutRequestID("ws_CO_DMZ_123212312_2342347678234")
   *  .lipaNaMpesaPassKey(process.env.LNM_PASSKEY)
   *  .queryStatus(); // sends the query request
   */
  public stkPush(): STKPush {
    return new STKPush(this.builderCfg);
  }

  /**
   * Transaction Status API
   *
   * @description This method is used to construct a request to query the API for the status of a transation. The required fields are `shortCode`, `transactionID`, `timeoutURL` and `resultURL`.
   * @returns {TransactionStatus} An instance of the `TransactionStatus` class for further manipulation.
   * @example
   * let app = new Mpesa({...}) // Pass credentials here
   *
   * const res = await app
   *  .transactionStatus()
   *  .shortCode("600998")
   *  .transactionID("OEI2AK4Q16")
   *  .timeoutURL("https://example.com/callback")
   *  .resultURL("https://example.com/callback")
   *  .queryStatus(); // this method sends the actual request
   */
  public transactionStatus(): TransactionStatus {
    return new TransactionStatus(this.builderCfg);
  }

  /**
   * Account Balance API
   *
   * @description A method that constructs a request and invokes it against the Account Balance API. The required fields are `shortCode`, `timeoutURL` and `resultURL`.
   * @returns {AccountBalance} An instance of the `AccountBalance` class
   * @example
   * let app = new Mpesa({...}) // Pass credentials here
   *
   * const res = await app
   *  .accountBalance()
   *  .shortCode("600998")
   *  .timeoutURL("https://example.com/callback")
   *  .resultURL("https://example.com/callback")
   *  .query(); // sends the actual request
   */
  public accountBalance(): AccountBalance {
    return new AccountBalance(this.builderCfg);
  }

  /**
   * Reversal API
   *
   * @description This method builds a request to be made against the Reversal API. The required fields are: `amount`, `shortCode`, `initiator`, `transactionID`, `resultURL` and `timeoutURL`
   * @returns {Reversal} An instance of the Reversal class for further manipulation.
   * @example
   * let app = new Mpesa({...}) // Pass credentials here
   *
   * const res = await app
   *  .reversal()
   *  .amount(1)
   *  .shortCode("600998")
   *  .initiator("testapi")
   *  .transactionID("OEI2AK4Q16")
   *  .resultURL("https://example.com/callback")
   *  .timeoutURL("https://example.com/callback")
   *  .send();
   */
  public reversal(): Reversal {
    return new Reversal(this.builderCfg);
  }
}

export { STKPushResultWrapper, ValidationRequestWrapper };
