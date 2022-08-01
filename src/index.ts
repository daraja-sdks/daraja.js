import { RSA_PKCS1_PADDING } from "constants";
import { publicEncrypt } from "crypto";
import { promises } from "fs";
import { BusinessToCustomer } from "./api/b2c";
import { CustomerToBusiness } from "./api/c2b";
import { STKPush, STKPushResultWrapper } from "./api/stkPush";
import { TransactionStatus } from "./api/transactionStatus";
import { routes } from "./models/routes";
import {
  getProductionCert,
  getSandboxCert,
  HttpClient,
  _BuilderConfig,
} from "./utils";

interface MpesaCredentials {
  consumerKey: string;
  consumerSecret: string;
  securityCredential?: string;
  initiatorPassword?: string;
  certificatePath?: string;
  organizationShortCode?: number;
}

export class Mpesa {
  private _http: HttpClient;
  private _lastTokenTime: number;
  private _currentToken: string;
  private consumerKey: string;
  private consumerSecret: string;
  private initiatorPassword: string;
  private securityCredential: string;
  private globalShortCode: number;
  private builderCfg: _BuilderConfig;

  constructor(
    {
      consumerKey,
      consumerSecret,
      securityCredential,
      initiatorPassword,
      certificatePath,
      organizationShortCode,
    }: MpesaCredentials,
    private environment: string
  ) {
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.globalShortCode = organizationShortCode;

    if (!this.environment) {
      this.environment = "sandbox";
    }
    this._http = new HttpClient(this.environment);

    if (!initiatorPassword && this.environment === "sandbox") {
      this.initiatorPassword = "Safaricom999!*!";
    }

    if (!securityCredential && !initiatorPassword) {
      throw new Error(
        "You must provide either the security credential or initiator password. Both cannot be null"
      );
    }

    if (!securityCredential) {
      this.generateSecurityCredential(initiatorPassword, certificatePath);
    } else {
      this.securityCredential = securityCredential;
    }

    this.builderCfg = {
      getAuthToken: this._getAuthToken.bind(this),
      securityCredential: this.securityCredential,
      http: this._http,
      shortCode: this.globalShortCode,
    };
  }

  private async _getAuthToken(): Promise<string> {
    if (Date.now() - this._lastTokenTime < 3599) {
      // cache hit, sort of :)
      return this._currentToken;
    } else {
      // token expired
      try {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const { data } = await this._http.get<any>(routes.oauth, {
          Authorization:
            "Basic " +
            Buffer.from(this.consumerKey + ":" + this.consumerSecret).toString(
              "base64"
            ),
        });

        this._currentToken = data.access_token;
        this._lastTokenTime = Date.now();

        return data.access_token;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    }
  }

  private async generateSecurityCredential(
    password: string,
    certificatePath: string
  ) {
    let certificate: string;

    if (certificatePath != null) {
      const certificateBuffer = await promises.readFile(certificatePath);

      certificate = String(certificateBuffer);
    } else {
      certificate =
        this.environment === "production"
          ? getProductionCert()
          : getSandboxCert();
    }

    this.securityCredential = publicEncrypt(
      {
        key: certificate,
        padding: RSA_PKCS1_PADDING,
      },
      Buffer.from(password)
    ).toString("base64");
  }

  public c2b(): CustomerToBusiness {
    return new CustomerToBusiness(this.builderCfg);
  }

  public b2c(): BusinessToCustomer {
    return new BusinessToCustomer(this.builderCfg);
  }

  public stkPush(): STKPush {
    return new STKPush(this.builderCfg);
  }

  public transactionStatus(): TransactionStatus {
    return new TransactionStatus(this.builderCfg);
  }
}

export { STKPushResultWrapper };
