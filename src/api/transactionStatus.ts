import {
  TransactionStatusInterface,
  TransactionStatusResponseInterface,
} from "../models/interfaces";
import { routes } from "../models/routes";
import { _BuilderConfig, errorAssert, handleError } from "../utils";
import { MpesaResponse } from "../wrappers";

export class TransactionStatus {
  private _initiator: string;
  private _commandID: "TransactionStatusQuery";
  private _transactionID: string;
  private _shortCode: string;
  private _identifierType: "1" | "2" | "4";
  private _resultURL: string;
  private _timeoutURL: string;
  private _remarks: string;
  private _occassion: string;

  constructor(private config: _BuilderConfig) {
    // defaults
    this._commandID = "TransactionStatusQuery";
    this._identifierType = "4";
    this._initiator = "testapi";
  }

  private _debugAssert() {
    // if no shortcode provided, check if global shortcode present
    if (!this._shortCode) {
      this._shortCode = String(this.config.shortCode);
    }

    errorAssert(this._shortCode, "Please provide a shortcode");
    errorAssert(this._initiator, "Please provide an initiator name");
    errorAssert(this._resultURL, "A result URL is required");
    errorAssert(this._timeoutURL, "A timeout URL is required");
  }

  /**
   * @description Set the shortcode of the organization
   * @param  {string} code The shortcode of the organization to which the payment was made
   * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
   */
  public shortCode(code: string): TransactionStatus {
    this._shortCode = code;
    return this;
  }

  /**
   * @param  {string} name The name of Initiator who is making the request.
   * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
   */
  public initiator(name: string): TransactionStatus {
    this._initiator = name;
    return this;
  }

  /**
   * @param  {string} id The transaction ID of the transaction to be queried
   * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
   */
  public transactionID(id: string): TransactionStatus {
    this._transactionID = id;
    return this;
  }

  /**
   * @param  {string} value Any additional remarks to pass along - Optional
   * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
   */
  public remarks(value: string): TransactionStatus {
    this._remarks = value;
    return this;
  }

  /**
   * @param  {string} value A value specifying the occassion necessitating the payment
   * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
   */
  public occassion(value: string): TransactionStatus {
    this._occassion = value;
    return this;
  }

  /**
   * @param  {string} url The end-point that receives the response of the transaction
   * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
   */
  public resultURL(url: string): TransactionStatus {
    this._resultURL = url;
    return this;
  }

  /**
   * @param  {string} identifierType "1" = MSISDN, "2" = Till Number, "4"=Shortcode
   * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
   */
  public identifierType(identifierType: "1" | "2" | "4"): TransactionStatus {
    this._identifierType = identifierType;
    return this;
  }

  /**
   * @param  {string} url The timeout end-point that receives a timeout response.
   * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
   */
  public timeoutURL(url: string): TransactionStatus {
    this._timeoutURL = url;
    return this;
  }

  public async queryStatus(): Promise<TransactionStatusResponseWrapper> {
    this._debugAssert();

    const app = this.config;
    const token = await app.getAuthToken();

    try {
      const { data } = await app.http.post<TransactionStatusInterface>(
        routes.transactionstatus,
        {
          PartyA: this._shortCode,
          IdentifierType: this._identifierType ?? "4",
          Initiator: this._initiator ?? "testapi",
          SecurityCredential: this.config.securityCredential,
          QueueTimeOutURL: this._timeoutURL,
          ResultURL: this._resultURL,
          TransactionID: this._transactionID,
          CommandID: this._commandID ?? "TransactionStatusQuery",
          Occasion: this._occassion ?? "Transaction Status",
          Remarks: this._remarks ?? "Transaction Status",
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      const values = new TransactionStatusResponseWrapper(data);
      return Promise.resolve(values);
    } catch (error) {
      return handleError(error);
    }
  }
}

class TransactionStatusResponseWrapper implements MpesaResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public data: TransactionStatusResponseInterface | any) {}

  public isOkay(): boolean {
    return this.data.ResponseCode === "0";
  }

  public getResponseCode(): string {
    return this.data.ResponseCode;
  }

  public getResponseDescription(): string {
    return this.data.ResponseDescription;
  }
}

export class TransactionStatusResultWrapper {}
