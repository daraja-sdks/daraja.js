import { MpesaResponse } from "wrappers";
import { B2CResponseInterface } from "../models/interfaces";
import { _BuilderConfig } from "../utils";
export declare class BusinessToCustomer {
    private config;
    private _initiator;
    private _amount;
    private _shortCode;
    private _phoneNumber;
    private _commandID;
    private _remarks;
    private _timeoutURL;
    private _resultURL;
    private _occassion;
    constructor(config: _BuilderConfig);
    private _debugAssert;
    /**
     * Business/Organization shortcode
     *
     * @description A method that sets the shortcode of the organization receiving payment
     * @param {string} code The shortcode of the organization receiving payment
     * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
     */
    shortCode(code: string): BusinessToCustomer;
    /**
     * Payer Phone Number
     *
     * @param {number} no The phone number of the payer in the format 254...
     * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
     */
    phoneNumber(no: number): BusinessToCustomer;
    /**
     * Payable amount
     *
     * @param {number} amount The amount to be paid to the the business
     * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
     */
    amount(amount: number): BusinessToCustomer;
    /**
     * Transaction type / Command ID
     *
     * @description Set the type of transaction taking place
     * @param  {"SalaryPayment"|"BusinessPayment"|"PromotionPayment"} type Unique command for each transaction type
     * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
     */
    transactionType(type: "SalaryPayment" | "BusinessPayment" | "PromotionPayment"): BusinessToCustomer;
    /**
     * Initiator Name
     *
     * @description A method to the initiator name for the transaction
     * @param  {string} name This is the credential/username used to authenticate the transaction request.
     * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
     */
    initiatorName(name: string): BusinessToCustomer;
    /**
     * Remarks
     *
     * @description A method used to pass any additional remarks
     * @param  {string} value Comments that are sent along with the transaction.
     * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
     */
    remarks(value: string): BusinessToCustomer;
    /**
     * Timeout URL/ Queue timeout url
     *
     * @description A method for setting the timeout URL
     * @param  {string} url The end-point that receives a timeout response.
     * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
     */
    timeoutURL(url: string): BusinessToCustomer;
    /**
     * Result URL
     *
     * @description A method for setting the Result URL
     * @param  {string} url The end-point that receives the response of the transaction
     * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
     */
    resultURL(url: string): BusinessToCustomer;
    /**
     * Occassion - optional
     *
     * @description A method for setting an optional `occaccion` value
     * @param  {string} value The occassion necessitating the payment
     * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
     */
    occassion(value: string): BusinessToCustomer;
    send(): Promise<B2CResponseWrapper>;
}
declare class B2CResponseWrapper implements MpesaResponse {
    data: B2CResponseInterface | any;
    constructor(data: B2CResponseInterface | any);
    isOkay(): boolean;
    getResponseCode(): string;
    getResponseDescription(): string;
}
export {};
