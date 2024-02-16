import { AxiosError } from "axios";
export interface _BuilderConfig {
    http: HttpClient;
    shortCode: number;
    securityCredential: string;
    getAuthToken(): Promise<string>;
    debug(...args: any[]): void;
}
export declare function pretty(obj: Record<string, unknown>): string;
export declare function handleError(error: AxiosError): Promise<{
    isOkay: () => boolean;
    data: {};
    ResponseDescription: string;
    ResponseCode: string;
    getResponseDescription: () => string;
    getResponseCode: () => string;
    getResultCode: () => string;
    getResultDescription: () => string;
    getTransactionID: () => string;
}>;
export declare function errorAssert(condition: any, msg: string): void;
export declare class HttpClient {
    private env;
    private baseUrl;
    constructor(env?: string);
    get<T>(url: string, headers: any): Promise<import("axios").AxiosResponse<T, any>>;
    post<T>(url: string, body: T, hds: any): Promise<import("axios").AxiosResponse<any, any>>;
}
export declare function getProductionCert(): string;
export declare function getSandboxCert(): string;
