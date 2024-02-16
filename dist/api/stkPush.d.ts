import { StkPushResponseInterface, STKPushResultInterface, StkQueryResponseInterface } from "../models/interfaces";
import { _BuilderConfig } from "../utils";
import { MpesaResponse } from "../wrappers";
export declare class STKPush {
    private config;
    private _amount;
    private _shortCode;
    private _phoneNumber;
    private _callbackURL;
    private _accountRef;
    private _passkey;
    private _description;
    private _transactionType;
    private _checkoutRequestID;
    constructor(config: _BuilderConfig);
    private _getTimeStamp;
    private _getPassword;
    private _debugAssert;
    /**
     * Business/Organization shortcode
     *
     * @description A method that sets the shortcode of the organization receiving payment
     * @param {string} code The shortcode of the organization receiving payment
     * @returns {STKPush} Returns a reference to the STKPush object for further manipulation
     */
    shortCode(code: string): STKPush;
    /**
     * Payer Phone Number
     *
     * @param {number} no The phone number of the payer in the format 254...
     * @returns {STKPush} Returns a reference to the STKPush object for further manipulation
     */
    phoneNumber(no: number): STKPush;
    /**
     * Payable amount
     *
     * @param {number} amount The amount to be paid to the the business
     * @returns {STKPush} Returns a reference to the STKPush object for further manipulation
     */
    amount(amount: number): STKPush;
    /**
     * Payment Type / Transaction Type
     *
     * @description Set the transaction type to be made
     * @param {string} id The type of transaction to be made. This refers to the whether the transaction is buy goods and services or paybill. Valid values are `CustomerPayBillOnline` or `CustomerBuyGoodsOnline`.
     * @returns {STKPush} Returns a reference to the STKPush object for further manipulation
     */
    paymentType(id: "CustomerPayBillOnline" | "CustomerBuyGoodsOnline"): STKPush;
    /**
     * Account Number/ Bill Ref No.
     *
     * @description Setup the account number/billref no. This is only applicable when the payment type is `paybill`
     * @param  {string} account The account number to be referenced in the payment
     * @returns {STKPush} Returns a reference to the STKPush object for further manipulation
     */
    accountNumber(account: string): STKPush;
    /**
     * Transaction description
     *
     * @description Pass any additional info. Max 13 characters.
     * @param  {string} value This is any additional information/comment that can be sent along with the request from your system. Maximum of 13 Characters.
     * @returns {STKPush} Returns a reference to the STKPush object for further manipulation
     */
    description(value: string): STKPush;
    /**
     * Callback URL
     *
     * @decscription This method is used to set the callback url that will be invoked once a payment has been made. Note that the value cannot be empty and must be a `https` route, otherwise, the request will fail.
     * @param  {string} url The Callback URL to be invoked after a payment is made
     * @returns {STKPush} Returns a reference to the STKPush object for further manipulation
     */
    callbackURL(url: string): STKPush;
    /**
     * @description Use this method to manually set the checkout request ID.
     * @param  {string} id This is a global unique identifier of the processed checkout transaction request.
     * @returns {STKPush} Returns a reference to the STKPush object for further manipulation
     */
    checkoutRequestID(id: string): STKPush;
    lipaNaMpesaPassKey(pass: string): STKPush;
    /**
     * Make the STKPush/Lipa na Mpesa online payment request
     *
     * @description This method actually invokes the API endpoint using the configured fields. Once a response is received from the daraja API, it gets wrapped in the `STKPushResponseWrapper` class which provides you with a lot of convenience methods.
     * @returns {Promise<STKPushResponseWrapper>} A class that wraps the bare response to give you access to methods such as `.isOkay()` etc.
     */
    send(): Promise<STKPushResponseWrapper>;
    /**
     * Query the status of an STKPush Transactions
     *
     * @description This method queries the daraja API for the status of a transaction already executed. The received response from daraja is then wrapped in the `STKQueryResponseWrapper` which contains various utility methods to access the data.
     * @returns {Promise<STKQueryResponseWrapper>} A class that wraps the bare response from Daraja after querrying the status of an STKPush transaction.
     */
    queryStatus(): Promise<STKQueryResponseWrapper>;
}
declare class STKPushResponseWrapper implements MpesaResponse {
    data: StkPushResponseInterface | any;
    constructor(data: StkPushResponseInterface | any);
    isOkay(): boolean;
    getResponseCode(): string;
    getResponseDescription(): string;
    /**
     * @description This method is used to get the checkout request id which is globally unique identifier used to identify your transaction. It can be used to query the status of the transaction.
     * @returns {string} The transaction id/checkout request id
     */
    getTransactionID(): string;
}
declare class STKQueryResponseWrapper implements MpesaResponse {
    data: StkQueryResponseInterface | any;
    constructor(data: StkQueryResponseInterface | any);
    isOkay(): boolean;
    getResponseCode(): string;
    getResponseDescription(): string;
    /**
     * @returns {string} This is a numeric status code that indicates the status of the transaction processing. 0 means successful processing and any other code means an error occured or the transaction failed.
     */
    getResultCode(): string;
    /**
     * @returns {string} Result description is a message from the API that gives the status of the request processing, usualy maps to a specific ResultCode value. It can be a Success processing message or an error description message. e.g 1032: Request cancelled by user
     */
    getResultDescription(): string;
}
export declare class STKPushResultWrapper {
    data: STKPushResultInterface;
    constructor(data: STKPushResultInterface);
    private _getCallbackField;
    /**
     * @description This method is used to determine whether the payment was made by the sender and the transaction completed successfully.
     * @returns {boolean} Whether the stkPush transaction was completed successfully
     */
    isOkay(): boolean;
    /**
     * @description A method used to get the result code of the transaction
     * @returns {number} The result code of the lipa na mpesa transaction.  0 means successful processing and any other code means an error occured or the transaction failed.
     */
    getResultCode(): number;
    /**
     * @returns {string} Result description is a message from the API that gives the status of the request processing, usualy maps to a specific ResultCode value. It can be a Success processing message or an error description message.
     */
    getResultDescription(): string;
    /**
     * @description A method to get the Mpesa Receipt No eg. LHG31AA5TX
     * @returns {string} This is the unique M-PESA transaction ID for the payment request. Same value is sent to customer over SMS upon successful processing.
     */
    getMpesaReceiptNo(): string;
    /**
     * @description A method to get the sender's phone no. In the V2 API, some of the digits are masked for customer privacy protection
     * @returns {string} This is the number of the customer who made the payment.
     */
    getSenderPhoneNo(): string;
    /**
     * @returns {number} This is the Amount that was transacted
     */
    getTransactionAmount(): number;
    /**
     * @returns {number} This is the Balance of the account for the shortcode used as partyB
     */
    getAccountBalance(): number;
    /**
     * @returns {string} This is a timestamp that represents the date and time that the transaction completed in the formart YYYYMMDDHHmmss
     */
    getTransactionTimestamp(): string;
}
export {};
