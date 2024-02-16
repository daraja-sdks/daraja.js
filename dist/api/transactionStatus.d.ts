import { TransactionStatusResponseInterface } from "../models/interfaces";
import { _BuilderConfig } from "../utils";
import { MpesaResponse } from "../wrappers";
export declare class TransactionStatus {
    private config;
    private _initiator;
    private _commandID;
    private _transactionID;
    private _shortCode;
    private _identifierType;
    private _resultURL;
    private _timeoutURL;
    private _remarks;
    private _occassion;
    constructor(config: _BuilderConfig);
    private _debugAssert;
    /**
     * @description Set the shortcode of the organization
     * @param  {string} code The shortcode of the organization to which the payment was made
     * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
     */
    shortCode(code: string): TransactionStatus;
    /**
     * @param  {string} name The name of Initiator who is making the request.
     * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
     */
    initiator(name: string): TransactionStatus;
    /**
     * @param  {string} id The transaction ID of the transaction to be queried
     * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
     */
    transactionID(id: string): TransactionStatus;
    /**
     * @param  {string} value Any additional remarks to pass along - Optional
     * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
     */
    remarks(value: string): TransactionStatus;
    /**
     * @param  {string} value A value specifying the occassion necessitating the payment
     * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
     */
    occassion(value: string): TransactionStatus;
    /**
     * @param  {string} url The end-point that receives the response of the transaction
     * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
     */
    resultURL(url: string): TransactionStatus;
    /**
     * @param  {string} url The timeout end-point that receives a timeout response.
     * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
     */
    timeoutURL(url: string): TransactionStatus;
    queryStatus(): Promise<TransactionStatusResponseWrapper>;
}
declare class TransactionStatusResponseWrapper implements MpesaResponse {
    data: TransactionStatusResponseInterface | any;
    constructor(data: TransactionStatusResponseInterface | any);
    isOkay(): boolean;
    getResponseCode(): string;
    getResponseDescription(): string;
}
export declare class TransactionStatusResultWrapper {
}
export {};
