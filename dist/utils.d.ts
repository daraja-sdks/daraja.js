import { type FetchError } from "ofetch";
export interface _BuilderConfig {
    http: HttpClient;
    shortCode: number;
    securityCredential: string;
    getAuthToken(): Promise<string>;
    debug(...args: any[]): void;
}
export declare function pretty(obj: Object): string;
export declare function handleError(error: FetchError): Promise<{
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
    get<T>(url: string, _headers: any): Promise<T>;
    post<T>(url: string, _body: T, _headers: any): Promise<T>;
}
export declare function getProductionCert(): string;
export declare function getSandboxCert(): string;
