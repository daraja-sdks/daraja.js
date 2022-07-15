import { routes } from "./models/routes";
import { errorAssert, HttpClient } from "./utils";

export class Mpesa {
  _http: HttpClient;

  constructor(
    private clientKey: string,
    private clientSecret: string,
    private environment: string
  ) {
    this._http = new HttpClient(this.environment);

    if (!this.environment) {
      this.environment = "sandbox";
    }
  }

  async _getAuthToken(): Promise<string> {
    try {
      const { data } = await this._http.get(routes.oauth, {
        Authorization:
          "Basic " +
          Buffer.from(this.clientKey + ":" + this.clientSecret).toString(
            "base64"
          ),
      });
      return data.access_token;
    } catch (error) {
      throw new Error(error);
    }
  }

  public c2b(): ClientToBusiness {
    return new ClientToBusiness(this);
  }
}

class ClientToBusiness {
  private _amount!: number;
  private _shortCode!: string;
  private _callbackUrl!: string;
  private _phoneNumber!: number;
  private _validationUrl!: string;
  private _confirmationUrl!: string;
  private _commandID!: string;
  private _billRefNo: string;

  constructor(private app: Mpesa) {
    // setup defaults
    this._commandID = "CustomerBuyGoodsOnline";
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

  public shortCode(code: string): ClientToBusiness {
    this._shortCode = code;
    return this;
  }

  public phoneNumber(no: number): ClientToBusiness {
    this._phoneNumber = no;
    return this;
  }

  public amount(amount: number): ClientToBusiness {
    this._amount = amount;
    return this;
  }

  public paymentType(id: string): ClientToBusiness {
    if (id.toLowerCase() === "paybill") {
      this._commandID = "CustomerPayBillOnline";
    } else {
      this._commandID = "CustomerBuyGoodsOnline";
    }
    return this;
  }

  public accountNumber(account: string): ClientToBusiness {
    this._billRefNo = account;
    return this;
  }

  public callbackUrl(url: string): ClientToBusiness {
    this._callbackUrl = url;
    return this;
  }

  public confirmationUrl(url: string): ClientToBusiness {
    this._confirmationUrl = url;
    return this;
  }

  public validationUrl(url: string): ClientToBusiness {
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
    } catch (error) {
      console.log(error.data);
      throw new Error(error);
    }
  }

  public async registerUrls() {
    // run assertions
    this._debugAssert("full");
  }

  public async makePayment() {
    // run assertions
    this._debugAssert("basic");
  }
}

export class MpesaError {}

export class MpesaResponse {}
