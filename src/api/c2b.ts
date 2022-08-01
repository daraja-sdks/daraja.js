import {
  C2BRegisterInterface,
  C2BRegisterResponseInterface,
  C2BSimulateResponseInterface,
} from "../models/interfaces";
import { routes } from "../models/routes";
import { errorAssert, _BuilderConfig } from "../utils";

export class CustomerToBusiness {
  private _amount: number;
  private _shortCode: string;
  private _callbackUrl: string;
  private _phoneNumber: number;
  private _validationUrl: string;
  private _confirmationUrl: string;
  private _commandID: string;
  private _billRefNo: string;
  private _responseType: "Cancelled" | "Completed";

  constructor(private config: _BuilderConfig) {
    // setup defaults
    this._commandID = "CustomerPayBillOnline";
    this._responseType = "Cancelled";
  }

  private _debugAssert(level: string) {
    if (!this._shortCode) {
      this._shortCode = String(this.config.shortCode);
    }

    if (level === "basic") {
      errorAssert(this._amount, "An amount must be set for C2B to function");
      errorAssert(
        this._phoneNumber,
        "A Phone Number must be set for C2B to function"
      );
    }
    errorAssert(this._shortCode, "Short code must be set for C2B to function");

    if (level === "full") {
      errorAssert(this._callbackUrl, "Please set a callback url");
      errorAssert(this._confirmationUrl, "Please set a confirmaiton url");
      errorAssert(this._validationUrl, "Please set a validation url");
    }
  }

  /**
   * Business/Organization shortcode
   *
   * @description A method that sets the shortcode of the organization receiving payment
   * @param {string} code The shortcode of the organization receiving payment
   * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
   */
  public shortCode(code: string): CustomerToBusiness {
    this._shortCode = code;
    return this;
  }

  /**
   * Payer Phone Number
   *
   * @param {number} no The phone number of the payer in the format 254...
   * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
   */
  public phoneNumber(no: number): CustomerToBusiness {
    this._phoneNumber = no;
    return this;
  }

  /**
   * Payable amount
   *
   * @param {number} amount The amount to be paid to the the business
   * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
   */
  public amount(amount: number): CustomerToBusiness {
    this._amount = amount;
    return this;
  }

  /**
   * Payment Type / Command ID
   *
   * @description Set the payment type to be made
   * @param {string} id The type of payment to be made. This refers to the whether the payment is buy goods and services or paybill. Valid values are `paybill` or `buy-goods`.
   * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
   */
  public paymentType(
    id: "CustomerPayBillOnline" | "CustomerBuyGoodsOnline"
  ): CustomerToBusiness {
    if (id !== ("CustomerPayBillOnline" || "CustomerBuyGoodsOnline")) {
      this._commandID = "CustomerPayBillOnline";
    } else {
      this._commandID = id;
    }
    return this;
  }

  /**
   * Account Number/ Bill Ref No.
   *
   * @description Setup the account number/billref no. This is only applicable when the payment type is `paybill`
   * @param  {string} account The account number to be referenced in the payment
   * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
   */
  public accountNumber(account: string): CustomerToBusiness {
    this._billRefNo = account;
    return this;
  }

  /**
   * @description Configure whether or not a payment should be completed or cancelled when the Validation URL is unreachable for any reason
   * @param  {boolean} value Whether or not to cancel the payment
   * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
   */
  public cancelIfUnreachable(value: boolean): CustomerToBusiness {
    if (value) {
      this._responseType = "Cancelled";
    } else {
      this._responseType = "Completed";
    }

    return this;
  }

  /**
   * Callback URL
   *
   * @decscription This method is used to set the callback url that will be invoked once a payment has been made. Note that the value cannot be empty and must be a `https` route, otherwise, the request will fail.
   * @param  {string} url The Callback URL to be invoked after a payment is made
   * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
   */
  public callbackURL(url: string): CustomerToBusiness {
    this._callbackUrl = url;
    return this;
  }

  /**
   * Confirmation URL
   *
   * @description This method is used to define a custom confirmation url that receives the confirmation request from API upon payment completion.
   * @param  {string} url The custom confirmation URL for an organization
   * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
   */
  public confirmationURL(url: string): CustomerToBusiness {
    this._confirmationUrl = url;
    return this;
  }
  /**
   * @description A method used to set the validation URL. The validation URL is only called if the external validation on the registered shortcode is enabled. (By default External Validation is dissabled)
   * @param  {string} url This is the URL that receives the validation request from API upon payment submission
   * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
   */
  public validationURL(url: string): CustomerToBusiness {
    this._validationUrl = url;
    return this;
  }

  /**
   * @description A method used to send the actual simulation request when in sandbox environment. Since C2B is customer-initiated in a production environment, you can only simulate while on sandbox.
   * @returns {Promise<C2BSimulateResponseWrapper} returns the c2b simulate response wrapped in a class that provides utility methods to access the values.
   */
  public async simulate(): Promise<C2BSimulateResponseWrapper> {
    // run assertions
    this._debugAssert("basic");

    const app = this.config;
    const token = await app.getAuthToken();

    try {
      const { data } = await app.http.post(
        routes.c2bsimulate,
        {
          ShortCode: this._shortCode,
          CommandID: this._commandID,
          Amount: this._amount,
          Msisdn: this._phoneNumber,
          BillRefNumber: this._billRefNo ?? this._phoneNumber,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      const values = new C2BSimulateResponseWrapper(data);
      return Promise.resolve(values);
    } catch (error) {
      if (process.env.DEBUG) {
        console.log(error);
      }
      return Promise.reject(error);
    }
  }

  /**
   * @description This method is invoked when one intends to register the configured validation and confirmation urls
   * @returns {Promise<C2BRegisterResponseWrapper} A promise that resolves to the c2b register response wrapper if the request completes with no errors whatsoever.
   */
  public async registerURLS(): Promise<C2BRegisterResponseWrapper> {
    // run assertions
    this._debugAssert("full");

    const app = this.config;
    const token = await app.getAuthToken();

    try {
      const { data } = await app.http.post<C2BRegisterInterface>(
        routes.c2bregister,
        {
          ShortCode: +this._shortCode,
          ConfirmationURL: this._confirmationUrl,
          ValidationURL: this._validationUrl,
          ResponseType: this._responseType,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      const values = new C2BRegisterResponseWrapper(data);
      return Promise.resolve(values);
    } catch (error) {
      if (process.env.DEBUG) {
        console.log(error);
      }
      return Promise.reject(error);
    }
  }
}

class C2BSimulateResponseWrapper {
  constructor(public data: C2BSimulateResponseInterface) {}

  public isOkay(): boolean {
    const desc = this.data.ResponseDescription;
    return desc.includes("successfully") || desc.includes("accepted");
  }

  public getResponseDescription(): string {
    return this.data.ResponseDescription;
  }

  public getConversationID(): string {
    return this.data.ConversationID;
  }

  public getOriginatorConversationID(): string {
    return this.data.OriginatorCoversationID;
  }
}

class C2BRegisterResponseWrapper {
  constructor(public data: C2BRegisterResponseInterface) {}

  public isOkay(): boolean {
    return (
      this.data.ResponseDescription.includes("success") ||
      this.data.ResponseCode === "0"
    );
  }

  public getResponseDescription(): string {
    return this.data.ResponseDescription;
  }

  public getResponseCode(): string {
    return this.data.ResponseCode;
  }

  public getOriginatorConversationID(): string {
    return this.data.OriginatorCoversationID;
  }
}
