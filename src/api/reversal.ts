import {
  ReversalInterface,
  ReversalResponseInterface,
} from "../models/interfaces";
import { routes } from "../models/routes";
import { _BuilderConfig, errorAssert, handleError } from "../utils";

export class Reversal {
  private _partyA: string;
  private _initiator: string;
  private _resultURL: string;
  private _timeoutURL: string;
  private _remarks: string;
  private _transactionID: string;
  private _occasion: string;
  private _amount: number;
  private _receiverIdentifierType: ReversalInterface["RecieverIdentifierType"];

  constructor(private config: _BuilderConfig) {
    this._receiverIdentifierType = "11";
  }

  private _debugAssert() {
    errorAssert(this._partyA, "Party A is required");
    errorAssert(this._initiator, "Initiator is required");
    errorAssert(this._resultURL, "Result URL is required");
    errorAssert(this._timeoutURL, "Timeout URL is required");
  }

  public amount(amount: number): Reversal {
    this._amount = amount;
    return this;
  }

  /**
   * Party A
   * @param {string} code The shortcode of the organization receiving payment
   * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
   * @memberof Reversal
   */
  public shortCode(code: string): Reversal {
    this._partyA = code;
    return this;
  }

  /**
   * Initiator
   * @param {string} name The name of Initiator who is making the request.
   * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
   * @memberof Reversal
   * @description The name of Initiator who is making the request.
   */
  public initiator(name: string): Reversal {
    this._initiator = name;
    return this;
  }

  /**
   * Result URL
   * @param {string} url The URL to which the response from M-Pesa will be sent
   * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
   * @memberof Reversal
   * @description The URL to which the response from M-Pesa will be sent
   */
  public resultURL(url: string): Reversal {
    this._resultURL = url;
    return this;
  }

  /**
   * Timeout URL
   * @param {string} url The URL to which the response from M-Pesa will be sent
   * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
   * @memberof Reversal
   * @description The URL to which the response from M-Pesa will be sent
   */
  public timeoutURL(url: string): Reversal {
    this._timeoutURL = url;
    return this;
  }

  /**
   * Transaction ID
   * @param {string} id The unique identifier for the transaction request
   * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
   * @memberof Reversal
   * @description The unique identifier for the transaction request
   */
  public transactionID(id: string): Reversal {
    this._transactionID = id;
    return this;
  }

  /**
   * Occasion
   * @param {string} occasion The occasion for the transaction
   * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
   * @memberof Reversal
   */
  public occasion(occasion: string): Reversal {
    this._occasion = occasion;
    return this;
  }

  /**
   * Remarks
   * @param {string} remarks The remarks for the transaction
   * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
   * @memberof Reversal
   */
  public remarks(remarks: string): Reversal {
    this._remarks = remarks;
    return this;
  }

  /**
   * Receiver Identifier Type
   * @param {number} type The type of the organization receiving the transaction
   * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
   */
  public receiverIdentifierType(
    type: ReversalInterface["RecieverIdentifierType"]
  ): Reversal {
    this._receiverIdentifierType = type;
    return this;
  }

  /**
   * Builds the request object for the reversal API
   * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
   * @memberof Reversal
   */
  public async send() {
    this._debugAssert();
    const app = this.config;
    const token = await app.getAuthToken();

    try {
      const data = await app.http.post<ReversalInterface>(
        routes.reversal,
        {
          ReceiverParty: this._partyA,
          Amount: this._amount,
          RecieverIdentifierType: this._receiverIdentifierType,
          Initiator: this._initiator ?? "testapi",
          SecurityCredential: this.config.securityCredential,
          TransactionID: this._transactionID,
          QueueTimeOutURL: this._timeoutURL,
          ResultURL: this._resultURL,
          CommandID: "TransactionReversal",
          Remarks: this._remarks ?? "Reversal ",
          Occasion: this._occasion ?? "Reversal",
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      const values = new ReversalResponseWrapper(data as any);
      return Promise.resolve(values);
    } catch (error) {
      return handleError(error);
    }
  }
}

class ReversalResponseWrapper {
  constructor(public data: ReversalResponseInterface) {}

  public getResponseCode(): string {
    return this.data.ResponseCode;
  }

  public getResponseDescription(): string {
    return this.data.ResponseDescription;
  }

  public isOkay(): boolean {
    return this.getResponseCode() === "0";
  }
}
