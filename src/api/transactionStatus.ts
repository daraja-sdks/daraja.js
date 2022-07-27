import {
  TransactionStatusInterface,
  TransactionStatusResponseInterface,
} from "../models/interfaces";
import { routes } from "../models/routes";
import { errorAssert, _BuilderConfig } from "../utils";
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
    this._identifierType = "1";
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
   * @param  {string} url The timeout end-point that receives a timeout response.
   * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
   */
  public timeoutURL(url: string): TransactionStatus {
    this._timeoutURL = url;
    return this;
  }

  public async query(): Promise<TransactionStatusResponseWrapper> {
    this._debugAssert();

    const app = this.config;
    const token = await app.getAuthToken();

    try {
      const { data } = await app.http.post<TransactionStatusInterface>(
        routes.transactionstatus,
        {
          PartyA: this._shortCode,
          IdentifierType: this._identifierType,
          Initiator: this._initiator,
          QueueTimeOutURL: this._timeoutURL,
          ResultURL: this._resultURL,
          TransactionID: this._transactionID,
          CommandID: this._commandID,
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
      if (process.env.DEBUG) {
        console.log(error);
      }
      return Promise.reject(error);
    }
  }
}

class TransactionStatusResponseWrapper implements MpesaResponse {
  constructor(public data: TransactionStatusResponseInterface) {}

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
