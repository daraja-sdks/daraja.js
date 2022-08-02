import {
  AccountBalanceInterface,
  AccountBalanceResponseInterface,
} from "../models/interfaces";
import { routes } from "../models/routes";
import { errorAssert, handleError, _BuilderConfig } from "../utils";

export class AccountBalance {
  private _partyA: string;
  private _initiator: string;
  private _resultURL: string;
  private _timeoutURL: string;
  private _remarks: string;

  constructor(private config: _BuilderConfig) {
    this._initiator = "testapi";
  }

  private _debugAssert() {
    errorAssert(this._partyA, "Party A is required");
    errorAssert(this._initiator, "Initiator is required");
    errorAssert(this._resultURL, "Result URL is required");
    errorAssert(this._timeoutURL, "Timeout URL is required");
  }

  /**
   * Party A
   * @param {string} code The shortcode of the organization receiving payment
   * @returns {AccountBalance} Returns a reference to the AccountBalance object for further manipulation
   * @memberof AccountBalance
   */
  public shortCode(code: string): AccountBalance {
    this._partyA = code;
    return this;
  }

  /**
   * Initiator
   * @param {string} name The name of Initiator who is making the request.
   * @returns {AccountBalance} Returns a reference to the AccountBalance object for further manipulation
   * @memberof AccountBalance
   *
   */
  public initiator(name: string): AccountBalance {
    this._initiator = name;
    return this;
  }

  /**
   * Result URL
   * @param {string} url The URL to which the response from M-Pesa will be sent
   * @returns {AccountBalance} Returns a reference to the AccountBalance object for further manipulation
   * @memberof AccountBalance
   */
  public resultURL(url: string): AccountBalance {
    this._resultURL = url;
    return this;
  }

  /**
   * Timeout URL
   * @param {string} url The URL to which the response from M-Pesa will be sent
   * @returns {AccountBalance} Returns a reference to the AccountBalance object for further manipulation
   * @memberof AccountBalance
   */
  public timeoutURL(url: string): AccountBalance {
    this._timeoutURL = url;
    return this;
  }

  /**
   * Remarks
   * @param {string} value Any additional remarks to pass along - Optional
   * @returns {AccountBalance} Returns a reference to the AccountBalance object for further manipulation
   * @memberof AccountBalance
   */
  public remarks(value: string): AccountBalance {
    this._remarks = value;
    return this;
  }

  /**
   * Builds the request object for the AccountBalance API
   * @returns {Mpesa} Returns a reference to the Mpesa object for further manipulation
   * @memberof AccountBalance
   */
  public async query(): Promise<AccountBalanceResponseWrapper> {
    this._debugAssert();

    const app = this.config;
    const token = await app.getAuthToken();

    try {
      const { data } = await app.http.post<AccountBalanceInterface>(
        routes.accountbalance,
        {
          PartyA: this._partyA,
          IdentifierType: "4",
          Initiator: this._initiator ?? "testapi",
          SecurityCredential: this.config.securityCredential,
          QueueTimeOutURL: this._timeoutURL,
          ResultURL: this._resultURL,
          CommandID: "AccountBalance",
          Remarks: this._remarks ?? "Account balance query",
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      const values = new AccountBalanceResponseWrapper(data);
      return Promise.resolve(values);
    } catch (error) {
      return handleError(error);
    }
  }
}

class AccountBalanceResponseWrapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public data: AccountBalanceResponseInterface | any) {}

  public get ResponseCode(): string {
    return this.data.ResponseCode;
  }

  public get ResponseDescription(): string {
    return this.data.ResponseDescription;
  }

  public isOkay(): boolean {
    return this.ResponseCode === "0";
  }
}
