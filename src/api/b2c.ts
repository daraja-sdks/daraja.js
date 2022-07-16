import { B2CInterface, CommandID } from "models/interfaces";
import { routes } from "models/routes";
import { Mpesa } from "../index";

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

  constructor(private app: Mpesa) {}

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

  public initiatorName(name: string): BusinessToCustomer {
    this._initiator = name;
    return this;
  }

  public remarks(value: string): BusinessToCustomer {
    this._remarks = value;
    return this;
  }

  public timeoutURL(url: string): BusinessToCustomer {
    this._timeoutURL = url;
    return this;
  }

  public resultURL(url: string): BusinessToCustomer {
    this._resultURL = url;
    return this;
  }

  public occassion(value: string): BusinessToCustomer {
    this._occassion = value;
    return this;
  }

  public async makePayment() {
    const app = this.app;
    const token = await app._getAuthToken();

    try {
      const { data } = await app._http.post<B2CInterface>(
        routes.b2c,
        {
          Amount: this._amount,
          CommandID: this._commandID,
          Initiator: this._initiator,
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

      console.log(data);
      return data;
    } catch (error) {
      console.log(error.data);
      throw new Error(error);
    }
  }
}
