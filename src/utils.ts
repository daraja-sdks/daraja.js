import { routes } from "./models/routes";
import axios from "axios";

export function errorAssert(condition: any, msg: string) {
  if (!condition) {
    console.log("\n", "Error:", msg, "\n");
    throw new Error(msg);
  }
}

export class HttpClient {
  private baseUrl: string;

  constructor(private env: string) {
    this.env === "production"
      ? (this.baseUrl = routes.production)
      : (this.baseUrl = routes.sandbox);
  }

  public async get(url: string, headers: any) {
    return axios.get(this.baseUrl + url, {
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });
  }

  public async post(url: string, body: any, hds: any) {
    return axios.post(this.baseUrl + url, body, {
      headers: {
        ...hds,
        "Content-Type": "application/json",
      },
    });
  }
}
