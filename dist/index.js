"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationRequestWrapper = exports.STKPushResultWrapper = exports.Mpesa = void 0;
const constants_1 = require("constants");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const accountBalance_1 = require("./api/accountBalance");
const b2c_1 = require("./api/b2c");
const c2b_1 = require("./api/c2b");
const reversal_1 = require("./api/reversal");
const stkPush_1 = require("./api/stkPush");
Object.defineProperty(exports, "STKPushResultWrapper", { enumerable: true, get: function () { return stkPush_1.STKPushResultWrapper; } });
const transactionStatus_1 = require("./api/transactionStatus");
const routes_1 = require("./models/routes");
const storage_1 = __importDefault(require("./storage"));
const utils_1 = require("./utils");
const wrappers_1 = require("./wrappers");
Object.defineProperty(exports, "ValidationRequestWrapper", { enumerable: true, get: function () { return wrappers_1.ValidationRequestWrapper; } });
class Mpesa {
    constructor({ consumerKey, consumerSecret, securityCredential, initiatorPassword, certificatePath, organizationShortCode, debug = process.env.DEBUG === "true", }, environment = "sandbox") {
        this.environment = environment;
        this.debugMode = debug;
        this.consumerKey = consumerKey;
        this.consumerSecret = consumerSecret;
        this.globalShortCode = organizationShortCode;
        this._http = new utils_1.HttpClient(this.environment);
        if (!initiatorPassword && this.environment === "sandbox") {
            this.initiatorPassword = "Safaricom999!*!";
        }
        if (!securityCredential && !initiatorPassword) {
            throw new Error("You must provide either the security credential or initiator password. Both cannot be null");
        }
        if (!securityCredential) {
            this.generateSecurityCredential(initiatorPassword, certificatePath);
        }
        else {
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
    debug(...args) {
        this.debugMode && console.log(...args);
    }
    _getAuthToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield storage_1.default.getItem("mpesa_api_access_token");
            if (accessToken && (new Date().getTime() - new Date(accessToken.initial_timestamp).getTime()) / 1000 < accessToken.expires_in) {
                return accessToken.token;
            }
            else {
                // token expired
                try {
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    const { data } = yield this._http.get(routes_1.routes.oauth, {
                        Authorization: "Basic " +
                            Buffer.from(this.consumerKey + ":" + this.consumerSecret).toString("base64"),
                    });
                    yield storage_1.default.setItem("mpesa_api_access_token", {
                        token: data.access_token,
                        expires_in: data.expires_in,
                        initial_timestamp: new Date().toISOString()
                    });
                    return data.access_token;
                }
                catch (error) {
                    process.env.DEBUG && console.log(error);
                    throw new Error(error);
                }
            }
        });
    }
    generateSecurityCredential(password, certificatePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let certificate;
            if (certificatePath != null) {
                const certificateBuffer = yield fs_1.promises.readFile(certificatePath);
                certificate = String(certificateBuffer);
            }
            else {
                certificate =
                    this.environment === "production"
                        ? (0, utils_1.getProductionCert)()
                        : (0, utils_1.getSandboxCert)();
            }
            this.securityCredential = (0, crypto_1.publicEncrypt)({
                key: certificate,
                padding: constants_1.RSA_PKCS1_PADDING,
            }, Buffer.from(password)).toString("base64");
        });
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
    c2b() {
        return new c2b_1.CustomerToBusiness(this.builderCfg);
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
    b2c() {
        return new b2c_1.BusinessToCustomer(this.builderCfg);
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
    stkPush() {
        return new stkPush_1.STKPush(this.builderCfg);
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
    transactionStatus() {
        return new transactionStatus_1.TransactionStatus(this.builderCfg);
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
    accountBalance() {
        return new accountBalance_1.AccountBalance(this.builderCfg);
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
    reversal() {
        return new reversal_1.Reversal(this.builderCfg);
    }
}
exports.Mpesa = Mpesa;
//# sourceMappingURL=index.js.map