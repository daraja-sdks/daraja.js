import { AccountBalanceResponseInterface } from "../models/interfaces";
import { _BuilderConfig } from "../utils";
export declare class AccountBalance {
    private config;
    private _partyA;
    private _initiator;
    private _resultURL;
    private _timeoutURL;
    private _remarks;
    constructor(config: _BuilderConfig);
    private _debugAssert;
    /**
     * Party A
     * @param {string} code The shortcode of the organization receiving payment
     * @returns {AccountBalance} Returns a reference to the AccountBalance object for further manipulation
     * @memberof AccountBalance
     */
    shortCode(code: string): AccountBalance;
    /**
     * Initiator
     * @param {string} name The name of Initiator who is making the request.
     * @returns {AccountBalance} Returns a reference to the AccountBalance object for further manipulation
     * @memberof AccountBalance
     *
     */
    initiator(name: string): AccountBalance;
    /**
     * Result URL
     * @param {string} url The URL to which the response from M-Pesa will be sent
     * @returns {AccountBalance} Returns a reference to the AccountBalance object for further manipulation
     * @memberof AccountBalance
     */
    resultURL(url: string): AccountBalance;
    /**
     * Timeout URL
     * @param {string} url The URL to which the response from M-Pesa will be sent
     * @returns {AccountBalance} Returns a reference to the AccountBalance object for further manipulation
     * @memberof AccountBalance
     */
    timeoutURL(url: string): AccountBalance;
    /**
     * Remarks
     * @param {string} value Any additional remarks to pass along - Optional
     * @returns {AccountBalance} Returns a reference to the AccountBalance object for further manipulation
     * @memberof AccountBalance
     */
    remarks(value: string): AccountBalance;
    /**
     * Builds the request object for the AccountBalance API
     * @returns {Mpesa} Returns a reference to the Mpesa object for further manipulation
     * @memberof AccountBalance
     */
    query(): Promise<AccountBalanceResponseWrapper>;
}
declare class AccountBalanceResponseWrapper {
    data: AccountBalanceResponseInterface | any;
    constructor(data: AccountBalanceResponseInterface | any);
    get ResponseCode(): string;
    get ResponseDescription(): string;
    isOkay(): boolean;
}
export {};
