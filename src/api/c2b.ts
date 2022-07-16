import { Mpesa } from "../index";
import { C2BRegisterInterface } from "../models/interfaces";
import { routes } from "../models/routes";
import { errorAssert } from "../utils";

export class CustomerToBusiness {
  private _amount: number;
  private _shortCode: string;
  private _callbackUrl: string;
  private _phoneNumber: number;
  private _validationUrl: string;
  private _confirmationUrl: string;
  private _commandID: string;
  private _billRefNo: string;
  private _responseType: string;

  constructor(private app: Mpesa) {
    // setup defaults
    this._commandID = "CustomerPayBillOnline";
    this._responseType = "Cancelled";
  }

  private _debugAssert(level: string) {
    errorAssert(this._amount, "An amount must be set for C2B to function");
    errorAssert(
      this._phoneNumber,
      "A Phone Number must be set for C2B to function"
    );
    errorAssert(this._shortCode, "Short code must be set for C2B to function");
    this._commandID === "CustomerPayBillOnline" &&
      errorAssert(
        this._billRefNo,
        "An account number must be provided when using paybill payment type"
      );

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
  public paymentType(id: string): CustomerToBusiness {
    if (id.toLowerCase() === "paybill") {
      this._commandID = "CustomerPayBillOnline";
    } else {
      this._commandID = "CustomerBuyGoodsOnline";
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
  public callbackUrl(url: string): CustomerToBusiness {
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
  public confirmationUrl(url: string): CustomerToBusiness {
    this._confirmationUrl = url;
    return this;
  }
  /**
   * @description A method used to set the validation URL. The validation URL is only called if the external validation on the registered shortcode is enabled. (By default External Validation is dissabled)
   * @param  {string} url This is the URL that receives the validation request from API upon payment submission
   * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
   */
  public validationUrl(url: string): CustomerToBusiness {
    this._validationUrl = url;
    return this;
  }

  public async simulate() {
    // run assertions
    this._debugAssert("basic");
    const app = this.app;
    const token = await app._getAuthToken();

    try {
      const { data } = await app._http.post(
        routes.c2bsimulate,
        {
          ShortCode: this._shortCode,
          CommandID: this._commandID,
          Amount: this._amount,
          Msisdn: this._phoneNumber,
          BillRefNumber: this._billRefNo,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log(data);
      return data;
    } catch (error) {
      console.log(error.data);
      throw new Error(error);
    }
  }

  public async registerUrls() {
    // run assertions
    this._debugAssert("full");

    const app = this.app;
    const token = await app._getAuthToken();

    try {
      const { data } = await app._http.post<C2BRegisterInterface>(
        routes.c2bregister,
        {
          ShortCode: +this._shortCode,
          ConfirmationURL: this._confirmationUrl,
          ValidationURL: this._validationUrl,
          ResponseType:
            this._responseType === "Cancelled" ? "Cancelled" : "Completed",
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      console.log(data);
      return data;
    } catch (error) {
      console.log(error.data);
      throw new Error(error);
    }
  }
}
