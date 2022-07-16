import { Mpesa } from "../index";
import {
  StkPushInterface,
  StkPushResponseInterface,
  StkQueryInterface,
} from "../models/interfaces";
import { routes } from "../models/routes";

export class STKPush {
  private _amount: number;
  private _shortCode: string;
  private _phoneNumber: number;
  private _callbackURL: string;
  private _accountRef: string;
  private _password: string;
  private _description: string;
  private _transactionType: string;
  private _checkoutRequestID: string;

  constructor(private app: Mpesa) {
    // defaults
    this._transactionType = "CustomerPayBillOnline";
  }

  private _getTimeStamp(): string {
    return new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, -3);
  }

  private _getPassword(): string {
    return Buffer.from(
      this._shortCode + this._password + this._getTimeStamp()
    ).toString("base64");
  }

  /**
   * Business/Organization shortcode
   *
   * @description A method that sets the shortcode of the organization receiving payment
   * @param {string} code The shortcode of the organization receiving payment
   * @returns {STKPush} Returns a reference to the STKPush object for further manipulation
   */
  public shortCode(code: string): STKPush {
    this._shortCode = code;
    return this;
  }

  /**
   * Payer Phone Number
   *
   * @param {number} no The phone number of the payer in the format 254...
   * @returns {STKPush} Returns a reference to the STKPush object for further manipulation
   */
  public phoneNumber(no: number): STKPush {
    this._phoneNumber = no;
    return this;
  }

  /**
   * Payable amount
   *
   * @param {number} amount The amount to be paid to the the business
   * @returns {STKPush} Returns a reference to the STKPush object for further manipulation
   */
  public amount(amount: number): STKPush {
    this._amount = amount;
    return this;
  }

  /**
   * Payment Type / Transaction Type
   *
   * @description Set the transaction type to be made
   * @param {string} id The type of transaction to be made. This refers to the whether the transaction is buy goods and services or paybill. Valid values are `paybill` or `buy-goods`.
   * @returns {STKPush} Returns a reference to the STKPush object for further manipulation
   */
  public paymentType(id: string): STKPush {
    if (id.toLowerCase() === "paybill") {
      this._transactionType = "CustomerPayBillOnline";
    } else {
      this._transactionType = "CustomerBuyGoodsOnline";
    }
    return this;
  }

  /**
   * Account Number/ Bill Ref No.
   *
   * @description Setup the account number/billref no. This is only applicable when the payment type is `paybill`
   * @param  {string} account The account number to be referenced in the payment
   * @returns {STKPush} Returns a reference to the STKPush object for further manipulation
   */
  public accountNumber(account: string): STKPush {
    this._accountRef = account;
    return this;
  }

  /**
   * Transaction description
   *
   * @description Pass any additional info. Max 13 characters.
   * @param  {string} value This is any additional information/comment that can be sent along with the request from your system. Maximum of 13 Characters.
   * @returns {STKPush} Returns a reference to the STKPush object for further manipulation
   */
  public description(value: string): STKPush {
    this._description = value;
    return this;
  }

  /**
   * Callback URL
   *
   * @decscription This method is used to set the callback url that will be invoked once a payment has been made. Note that the value cannot be empty and must be a `https` route, otherwise, the request will fail.
   * @param  {string} url The Callback URL to be invoked after a payment is made
   * @returns {STKPush} Returns a reference to the STKPush object for further manipulation
   */
  public callbackURL(url: string): STKPush {
    this._callbackURL = url;
    return this;
  }

  public async makePayment(): Promise<StkPushResponseInterface> {
    const app = this.app;
    const token = await app._getAuthToken();
    const password = this._getPassword();

    try {
      const { data } = await app._http.post<StkPushInterface>(
        routes.stkpush,
        {
          AccountReference: this._accountRef,
          Amount: this._amount,
          BusinessShortCode: +this._shortCode,
          CallBackURL: this._callbackURL,
          PartyA: String(this._phoneNumber),
          PartyB: this._shortCode,
          passKey: password,
          PhoneNumber: String(this._phoneNumber),
          TransactionDesc: this._description,
          TransactionType:
            this._transactionType === "CustomerPayBillOnline"
              ? "CustomerPayBillOnline"
              : "CustomerBuyGoodsOnline",
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      const values: StkPushResponseInterface = data;
      this._checkoutRequestID = values.CheckoutRequestID;

      return values;
    } catch (error) {
      console.log(error.data);
      throw new Error(error);
    }
  }

  public async queryStatus() {
    const app = this.app;
    const password = this._getPassword();
    const token = await app._getAuthToken();
    try {
      const { data } = await app._http.post<StkQueryInterface>(
        routes.stkquery,
        {
          BusinessShortCode: +this._shortCode,
          CheckoutRequestID: this._checkoutRequestID,
          passKey: password,
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

export class STKPushResultWrapper {
  constructor(private data: StkPushResponseInterface) {}
}

export class STKPushV2ResultWrapper {
  constructor(private data: StkPushResponseInterface) {}
}
