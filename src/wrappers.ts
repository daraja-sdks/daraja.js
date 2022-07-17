import { ValidationRequestV2Interface } from "./models/interfaces";

export interface MpesaResponse {
  /**
   * @description A method used to determine whether the response from Mpesa is okay, meaning that the transaction was successfull. A successfull transaction is okay when the response code is 0.
   * @returns {boolean} Whether or not the transaction was successfull.
   */
  isOkay(): boolean;

  /**
   * @description Get the code that was sent back from the API. Non-zero codes correspond to errors.
   * @returns {string} The response code of the transaction
   */
  getResponseCode(): string;

  /**
   * @description Used to get the response description. This will usually be an explanation of why the request failed if any errors are found.
   * @returns {string} A description of the transaction
   */
  getResponseDescription(): string;
}

export class ValidationRequestWrapper {
  constructor(public data: ValidationRequestV2Interface) {}

  public getTransactionID(): string {
    return this.data.TransID;
  }

  public getPhoneNumber(): string {
    return this.data.MSISDN;
  }

  public getAccountNumber(): string {
    return this.data.BillRefNumber;
  }

  public getTransactionAmount(): number {
    return +this.data.TransAmount;
  }

  public getAccountBalance(): string {
    return this.data.OrgAccountBalance;
  }

  public getSenderName(): string {
    return this.data.FirstName;
  }
}
