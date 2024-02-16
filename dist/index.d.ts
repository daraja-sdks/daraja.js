import { AccountBalance } from "./api/accountBalance";
import { BusinessToCustomer } from "./api/b2c";
import { CustomerToBusiness } from "./api/c2b";
import { Reversal } from "./api/reversal";
import { STKPush, STKPushResultWrapper } from "./api/stkPush";
import { TransactionStatus } from "./api/transactionStatus";
import { ValidationRequestWrapper } from "./wrappers";
interface MpesaCredentials {
    consumerKey: string;
    consumerSecret: string;
    securityCredential?: string;
    initiatorPassword?: string;
    certificatePath?: string;
    organizationShortCode?: number;
}
export declare class Mpesa {
    private environment;
    private _http;
    private consumerKey;
    private consumerSecret;
    private initiatorPassword;
    private securityCredential;
    private globalShortCode;
    private builderCfg;
    private debugMode;
    constructor({ consumerKey, consumerSecret, securityCredential, initiatorPassword, certificatePath, organizationShortCode, debug, }: MpesaCredentials & {
        debug?: boolean;
    }, environment?: string);
    private debug;
    private _getAuthToken;
    private generateSecurityCredential;
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
    c2b(): CustomerToBusiness;
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
    b2c(): BusinessToCustomer;
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
    stkPush(): STKPush;
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
    transactionStatus(): TransactionStatus;
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
    accountBalance(): AccountBalance;
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
    reversal(): Reversal;
}
export { STKPushResultWrapper, ValidationRequestWrapper };
