import { ReversalInterface, ReversalResponseInterface } from "../models/interfaces";
import { _BuilderConfig } from "../utils";
export declare class Reversal {
    private config;
    private _partyA;
    private _initiator;
    private _resultURL;
    private _timeoutURL;
    private _remarks;
    private _transactionID;
    private _occasion;
    private _amount;
    private _receiverIdentifierType;
    constructor(config: _BuilderConfig);
    private _debugAssert;
    amount(amount: number): Reversal;
    /**
     * Party A
     * @param {string} code The shortcode of the organization receiving payment
     * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
     * @memberof Reversal
     */
    shortCode(code: string): Reversal;
    /**
     * Initiator
     * @param {string} name The name of Initiator who is making the request.
     * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
     * @memberof Reversal
     * @description The name of Initiator who is making the request.
     */
    initiator(name: string): Reversal;
    /**
     * Result URL
     * @param {string} url The URL to which the response from M-Pesa will be sent
     * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
     * @memberof Reversal
     * @description The URL to which the response from M-Pesa will be sent
     */
    resultURL(url: string): Reversal;
    /**
     * Timeout URL
     * @param {string} url The URL to which the response from M-Pesa will be sent
     * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
     * @memberof Reversal
     * @description The URL to which the response from M-Pesa will be sent
     */
    timeoutURL(url: string): Reversal;
    /**
     * Transaction ID
     * @param {string} id The unique identifier for the transaction request
     * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
     * @memberof Reversal
     * @description The unique identifier for the transaction request
     */
    transactionID(id: string): Reversal;
    /**
     * Occasion
     * @param {string} occasion The occasion for the transaction
     * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
     * @memberof Reversal
     */
    occasion(occasion: string): Reversal;
    /**
     * Remarks
     * @param {string} remarks The remarks for the transaction
     * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
     * @memberof Reversal
     */
    remarks(remarks: string): Reversal;
    /**
     * Receiver Identifier Type
     * @param {number} type The type of the organization receiving the transaction
     * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
     */
    receiverIdentifierType(type: ReversalInterface["RecieverIdentifierType"]): Reversal;
    /**
     * Builds the request object for the reversal API
     * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
     * @memberof Reversal
     */
    send(): Promise<{
        isOkay: () => boolean;
        data: {};
        ResponseDescription: string;
        ResponseCode: string;
        getResponseDescription: () => string;
        getResponseCode: () => string;
        getResultCode: () => string;
        getResultDescription: () => string;
        getTransactionID: () => string;
    } | ReversalResponseWrapper>;
}
declare class ReversalResponseWrapper {
    data: ReversalResponseInterface;
    constructor(data: ReversalResponseInterface);
    getResponseCode(): string;
    getResponseDescription(): string;
    isOkay(): boolean;
}
export {};
