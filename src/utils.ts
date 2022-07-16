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

  public async get<T>(url: string, headers: any) {
    return axios.get<T>(this.baseUrl + url, {
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });
  }

  public async post<T>(url: string, body: T, hds: any) {
    return axios.post(this.baseUrl + url, body, {
      headers: {
        ...hds,
        "Content-Type": "application/json",
      },
    });
  }
}
