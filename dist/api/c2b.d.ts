import { C2BRegisterResponseInterface, C2BSimulateResponseInterface } from "../models/interfaces";
import { _BuilderConfig } from "../utils";
export declare class CustomerToBusiness {
    private config;
    private _amount;
    private _shortCode;
    private _callbackUrl;
    private _phoneNumber;
    private _validationUrl;
    private _confirmationUrl;
    private _commandID;
    private _billRefNo;
    private _responseType;
    constructor(config: _BuilderConfig);
    private _debugAssert;
    /**
     * Business/Organization shortcode
     *
     * @description A method that sets the shortcode of the organization receiving payment
     * @param {string} code The shortcode of the organization receiving payment
     * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
     */
    shortCode(code: string): CustomerToBusiness;
    /**
     * Payer Phone Number
     *
     * @param {number} no The phone number of the payer in the format 254...
     * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
     */
    phoneNumber(no: number): CustomerToBusiness;
    /**
     * Payable amount
     *
     * @param {number} amount The amount to be paid to the the business
     * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
     */
    amount(amount: number): CustomerToBusiness;
    /**
     * Payment Type / Command ID
     *
     * @description Set the payment type to be made
     * @param {string} id The type of payment to be made. This refers to the whether the payment is buy goods and services or paybill. Valid values are `paybill` or `buy-goods`.
     * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
     */
    paymentType(id: "CustomerPayBillOnline" | "CustomerBuyGoodsOnline"): CustomerToBusiness;
    /**
     * Account Number/ Bill Ref No.
     *
     * @description Setup the account number/billref no. This is only applicable when the payment type is `paybill`
     * @param  {string} account The account number to be referenced in the payment
     * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
     */
    accountNumber(account: string): CustomerToBusiness;
    /**
     * @description Configure whether or not a payment should be completed or cancelled when the Validation URL is unreachable for any reason
     * @param  {boolean} value Whether or not to cancel the payment
     * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
     */
    cancelIfUnreachable(value: boolean): CustomerToBusiness;
    /**
     * Callback URL
     *
     * @decscription This method is used to set the callback url that will be invoked once a payment has been made. Note that the value cannot be empty and must be a `https` route, otherwise, the request will fail.
     * @param  {string} url The Callback URL to be invoked after a payment is made
     * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
     */
    callbackURL(url: string): CustomerToBusiness;
    /**
     * Confirmation URL
     *
     * @description This method is used to define a custom confirmation url that receives the confirmation request from API upon payment completion.
     * @param  {string} url The custom confirmation URL for an organization
     * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
     */
    confirmationURL(url: string): CustomerToBusiness;
    /**
     * @description A method used to set the validation URL. The validation URL is only called if the external validation on the registered shortcode is enabled. (By default External Validation is dissabled)
     * @param  {string} url This is the URL that receives the validation request from API upon payment submission
     * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
     */
    validationURL(url: string): CustomerToBusiness;
    /**
     * @description A method used to send the actual simulation request when in sandbox environment. Since C2B is customer-initiated in a production environment, you can only simulate while on sandbox.
     * @returns {Promise<C2BSimulateResponseWrapper>} returns the c2b simulate response wrapped in a class that provides utility methods to access the values.
     */
    simulate(): Promise<C2BSimulateResponseWrapper>;
    /**
     * @description This method is invoked when one intends to register the configured validation and confirmation urls
     * @returns {Promise<C2BRegisterResponseWrapper>} A promise that resolves to the c2b register response wrapper if the request completes with no errors whatsoever.
     */
    registerURLS(): Promise<C2BRegisterResponseWrapper>;
}
declare class C2BSimulateResponseWrapper {
    data: C2BSimulateResponseInterface | any;
    constructor(data: C2BSimulateResponseInterface | any);
    isOkay(): boolean;
    getResponseDescription(): string;
}
declare class C2BRegisterResponseWrapper {
    data: C2BRegisterResponseInterface | any;
    constructor(data: C2BRegisterResponseInterface | any);
    isOkay(): boolean;
    getResponseDescription(): string;
    getResponseCode(): string;
}
export {};
