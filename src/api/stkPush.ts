import {
  StkPushInterface,
  StkPushResponseInterface,
  STKPushResultInterface,
  StkQueryInterface,
  StkQueryResponseInterface,
} from "../models/interfaces";
import { routes } from "../models/routes";
import { _BuilderConfig, errorAssert, handleError, pretty } from "../utils";
import { MpesaResponse } from "../wrappers";

export class STKPush {
  private _amount: number;
  private _shortCode: string;
  private _phoneNumber: number;
  private _callbackURL: string;
  private _accountRef: string;
  private _passkey: string;
  private _description: string;
  private _transactionType: "CustomerPayBillOnline" | "CustomerBuyGoodsOnline";
  private _checkoutRequestID: string;

  constructor(private config: _BuilderConfig) {
    // defaults
    this._transactionType = "CustomerPayBillOnline";
    this._callbackURL = "https://example.com";
  }

  private _getTimeStamp(): string {
    return new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, -3);
  }

  private _getPassword(timestamp: string): string {
    return Buffer.from(this._shortCode + this._passkey + timestamp).toString(
      "base64"
    );
  }

  private _debugAssert() {
    if (!this._shortCode) {
      this._shortCode = String(this.config.shortCode);
    }

    errorAssert(this._shortCode, "A shortcode must be provided");
    errorAssert(this._amount, "An amount must be provided");
    errorAssert(this._phoneNumber, "A phone number must be provided");
    errorAssert(this._passkey, "Please provide your Lipa na Mpesa passkey");
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
   * @param {string} id The type of transaction to be made. This refers to the whether the transaction is buy goods and services or paybill. Valid values are `CustomerPayBillOnline` or `CustomerBuyGoodsOnline`.
   * @returns {STKPush} Returns a reference to the STKPush object for further manipulation
   */
  public paymentType(
    id: "CustomerPayBillOnline" | "CustomerBuyGoodsOnline"
  ): STKPush {
    if (id !== ("CustomerPayBillOnline" || "CustomerBuyGoodsOnline")) {
      this._transactionType = "CustomerPayBillOnline";
    } else {
      this._transactionType = id;
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

  /**
   * @description Use this method to manually set the checkout request ID.
   * @param  {string} id This is a global unique identifier of the processed checkout transaction request.
   * @returns {STKPush} Returns a reference to the STKPush object for further manipulation
   */
  public checkoutRequestID(id: string): STKPush {
    this._checkoutRequestID = id;
    return this;
  }

  public lipaNaMpesaPassKey(pass: string): STKPush {
    this._passkey = pass;
    return this;
  }

  /**
   * Make the STKPush/Lipa na Mpesa online payment request
   *
   * @description This method actually invokes the API endpoint using the configured fields. Once a response is received from the daraja API, it gets wrapped in the `STKPushResponseWrapper` class which provides you with a lot of convenience methods.
   * @returns {Promise<STKPushResponseWrapper>} A class that wraps the bare response to give you access to methods such as `.isOkay()` etc.
   */
  public async send(): Promise<STKPushResponseWrapper> {
    this._debugAssert();

    const app = this.config;
    const token = await app.getAuthToken();
    const Password = this._getPassword(this._getTimeStamp());
    const payload: StkPushInterface = {
      AccountReference: this._accountRef ?? "CompanyXLTD",
      Amount: this._amount,
      BusinessShortCode: +this._shortCode,
      CallBackURL: this._callbackURL,
      PartyA: String(this._phoneNumber),
      PartyB: this._shortCode,
      Password,
      PhoneNumber: String(this._phoneNumber),
      TransactionDesc: this._description ?? "Lipa na Mpesa Online",
      TransactionType: this._transactionType,
      Timestamp: this._getTimeStamp(),
    };

    app.debug(
      "Sending STKPush Request:",
      pretty({
        route: routes.stkpush,
        payload,
      })
    );

    try {
      const { data } = await app.http.post<StkPushInterface>(
        routes.stkpush,
        payload,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      app.debug("Received STKPush Response:", pretty(data));

      const values = new STKPushResponseWrapper(data);
      this._checkoutRequestID = values.getTransactionID();

      return Promise.resolve(values);
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * Query the status of an STKPush Transactions
   *
   * @description This method queries the daraja API for the status of a transaction already executed. The received response from daraja is then wrapped in the `STKQueryResponseWrapper` which contains various utility methods to access the data.
   * @returns {Promise<STKQueryResponseWrapper>} A class that wraps the bare response from Daraja after querrying the status of an STKPush transaction.
   */
  public async queryStatus(): Promise<STKQueryResponseWrapper> {
    // this._debugAssert();

    const app = this.config;
    const Timestamp = this._getTimeStamp();
    const Password = this._getPassword(Timestamp);
    const token = await app.getAuthToken();
    const payload: StkQueryInterface = {
      BusinessShortCode: +this._shortCode,
      CheckoutRequestID: this._checkoutRequestID,
      Password,
      Timestamp,
    };

    app.debug(
      "Sending STK Query Request:",
      pretty({
        route: routes.stkquery,
        payload,
      })
    );

    try {
      const { data } = await app.http.post<StkQueryInterface>(
        routes.stkquery,
        payload,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      return Promise.resolve(new STKQueryResponseWrapper(data));
    } catch (error) {
      return handleError(error);
    }
  }
}

// Wraps the response from Daraja after making payment request
class STKPushResponseWrapper implements MpesaResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public data: StkPushResponseInterface | any) {}

  public isOkay(): boolean {
    return this.data.ResponseCode === "0";
  }

  public getResponseCode(): string {
    return this.data.ResponseCode;
  }

  public getResponseDescription(): string {
    return this.data.ResponseDescription;
  }
  /**
   * @description This method is used to get the checkout request id which is globally unique identifier used to identify your transaction. It can be used to query the status of the transaction.
   * @returns {string} The transaction id/checkout request id
   */
  public getTransactionID(): string {
    return this.data.CheckoutRequestID;
  }
}

// Wraps the response from Daraja after making status query request
class STKQueryResponseWrapper implements MpesaResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public data: StkQueryResponseInterface | any) {}

  public isOkay(): boolean {
    return (this.data.ResultCode && this.data.ResponseCode) === "0";
  }

  public getResponseCode(): string {
    return this.data.ResponseCode;
  }

  public getResponseDescription(): string {
    return this.data.ResponseDescription;
  }

  /**
   * @returns {string} This is a numeric status code that indicates the status of the transaction processing. 0 means successful processing and any other code means an error occured or the transaction failed.
   */
  public getResultCode(): string {
    return this.data.ResultCode;
  }

  /**
   * @returns {string} Result description is a message from the API that gives the status of the request processing, usualy maps to a specific ResultCode value. It can be a Success processing message or an error description message. e.g 1032: Request cancelled by user
   */
  public getResultDescription(): string {
    return this.data.ResultDesc;
  }
}

// Wraps the Result from Daraja received in the callback url
export class STKPushResultWrapper {
  constructor(public data: STKPushResultInterface) {}

  private _getCallbackField(name: string): string {
    const items = this.data.Body.stkCallback.CallbackMetadata.Item;
    for (const { Name, Value } of items) {
      if (Name === name) {
        return Value;
      }
    }
  }

  /**
   * @description This method is used to determine whether the payment was made by the sender and the transaction completed successfully.
   * @returns {boolean} Whether the stkPush transaction was completed successfully
   */
  public isOkay(): boolean {
    return this.data.Body.stkCallback.ResultCode === 0;
  }

  /**
   * @description A method used to get the result code of the transaction
   * @returns {number} The result code of the lipa na mpesa transaction.  0 means successful processing and any other code means an error occured or the transaction failed.
   */
  public getResultCode(): number {
    return this.data.Body.stkCallback.ResultCode;
  }

  /**
   * @returns {string} Result description is a message from the API that gives the status of the request processing, usualy maps to a specific ResultCode value. It can be a Success processing message or an error description message.
   */
  public getResultDescription(): string {
    return this.data.Body.stkCallback.ResultDesc;
  }

  /**
   * @description A method to get the Mpesa Receipt No eg. LHG31AA5TX
   * @returns {string} This is the unique M-PESA transaction ID for the payment request. Same value is sent to customer over SMS upon successful processing.
   */
  public getMpesaReceiptNo(): string {
    return this._getCallbackField("MpesaReceiptNumber");
  }

  /**
   * @description A method to get the sender's phone no. In the V2 API, some of the digits are masked for customer privacy protection
   * @returns {string} This is the number of the customer who made the payment.
   */
  public getSenderPhoneNo(): string {
    return this._getCallbackField("PhoneNumber");
  }

  /**
   * @returns {number} This is the Amount that was transacted
   */
  public getTransactionAmount(): number {
    return +this._getCallbackField("Amount");
  }

  /**
   * @returns {number} This is the Balance of the account for the shortcode used as partyB
   */
  public getAccountBalance(): number {
    return +this._getCallbackField("Balance");
  }

  /**
   * @returns {string} This is a timestamp that represents the date and time that the transaction completed in the formart YYYYMMDDHHmmss
   */
  public getTransactionTimestamp(): string {
    return this._getCallbackField("TransactionDate");
  }
}
