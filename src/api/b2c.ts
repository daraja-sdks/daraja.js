import { MpesaResponse } from "wrappers";
import {
  B2CInterface,
  B2CResponseInterface,
  CommandID,
} from "../models/interfaces";
import { routes } from "../models/routes";
import { errorAssert, _BuilderConfig } from "../utils";

export class BusinessToCustomer {
  private _initiator: string;
  private _amount: number;
  private _shortCode: string;
  private _phoneNumber: number;
  private _commandID: CommandID;
  private _remarks: string;
  private _timeoutURL: string;
  private _resultURL: string;
  private _occassion: string;

  constructor(private config: _BuilderConfig) {}

  private _debugAssert() {
    if (!this._shortCode) {
      this._shortCode = String(this.config.shortCode);
    }

    errorAssert(this._shortCode, "Shortcode is required");
    errorAssert(this._phoneNumber, "Phone number is required");
    errorAssert(this._amount, "Amount is required");
    errorAssert(this._timeoutURL, "Timeout URL is required");
    errorAssert(this._resultURL, "Result URL is required");
  }

  /**
   * Business/Organization shortcode
   *
   * @description A method that sets the shortcode of the organization receiving payment
   * @param {string} code The shortcode of the organization receiving payment
   * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
   */
  public shortCode(code: string): BusinessToCustomer {
    this._shortCode = code;
    return this;
  }

  /**
   * Payer Phone Number
   *
   * @param {number} no The phone number of the payer in the format 254...
   * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
   */
  public phoneNumber(no: number): BusinessToCustomer {
    this._phoneNumber = no;
    return this;
  }

  /**
   * Payable amount
   *
   * @param {number} amount The amount to be paid to the the business
   * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
   */
  public amount(amount: number): BusinessToCustomer {
    this._amount = amount;
    return this;
  }
  /**
   * Transaction type / Command ID
   *
   * @description Set the type of transaction taking place
   * @param  {"SalaryPayment"|"BusinessPayment"|"PromotionPayment"} type Unique command for each transaction type
   * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
   */
  public transactionType(
    type: "SalaryPayment" | "BusinessPayment" | "PromotionPayment"
  ): BusinessToCustomer {
    this._commandID = type;
    return this;
  }

  /**
   * Initiator Name
   *
   * @description A method to the initiator name for the transaction
   * @param  {string} name This is the credential/username used to authenticate the transaction request.
   * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
   */
  public initiatorName(name: string): BusinessToCustomer {
    this._initiator = name;
    return this;
  }

  /**
   * Remarks
   *
   * @description A method used to pass any additional remarks
   * @param  {string} value Comments that are sent along with the transaction.
   * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
   */
  public remarks(value: string): BusinessToCustomer {
    this._remarks = value;
    return this;
  }

  /**
   * Timeout URL/ Queue timeout url
   *
   * @description A method for setting the timeout URL
   * @param  {string} url The end-point that receives a timeout response.
   * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
   */
  public timeoutURL(url: string): BusinessToCustomer {
    this._timeoutURL = url;
    return this;
  }

  /**
   * Result URL
   *
   * @description A method for setting the Result URL
   * @param  {string} url The end-point that receives the response of the transaction
   * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
   */
  public resultURL(url: string): BusinessToCustomer {
    this._resultURL = url;
    return this;
  }

  /**
   * Occassion - optional
   *
   * @description A method for setting an optional `occaccion` value
   * @param  {string} value The occassion necessitating the payment
   * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
   */
  public occassion(value: string): BusinessToCustomer {
    this._occassion = value;
    return this;
  }

  public async send(): Promise<B2CResponseWrapper> {
    this._debugAssert();

    const app = this.config;
    const token = await app.getAuthToken();

    try {
      const { data } = await app.http.post<B2CInterface>(
        routes.b2c,
        {
          Amount: this._amount,
          CommandID: this._commandID ?? "SalaryPayment",
          InitiatorName: this._initiator ?? "testapi",
          SecurityCredential: this.config.securityCredential,
          PartyA: this._shortCode,
          PartyB: String(this._phoneNumber),
          QueueTimeOutURL: this._timeoutURL,
          ResultURL: this._resultURL,
          Occasion: this._occassion ?? "payment",
          Remarks: this._remarks ?? "payment",
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      const values = new B2CResponseWrapper(data);
      return Promise.resolve(values);
    } catch (error) {
      if (process.env.DEBUG) {
        console.log(error);
      }
      Promise.reject(error);
    }
  }
}

class B2CResponseWrapper implements MpesaResponse {
  constructor(private data: B2CResponseInterface) {}

  public isOkay(): boolean {
    return (
      this.data.ResponseCode === "0" &&
      this.data.ResponseDescription.toLowerCase().includes("success")
    );
  }

  public getResponseCode(): string {
    return this.data.ResponseCode;
  }

  public getResponseDescription(): string {
    return this.data.ResponseDescription;
  }

  public getConversationID(): string {
    return this.data.ConversationID;
  }

  public getOriginatorConversationID(): string {
    return this.data.OriginatorConversationID;
  }
}
