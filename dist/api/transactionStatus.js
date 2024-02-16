"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatusResultWrapper = exports.TransactionStatus = void 0;
const routes_1 = require("../models/routes");
const utils_1 = require("../utils");
class TransactionStatus {
    constructor(config) {
        this.config = config;
        // defaults
        this._commandID = "TransactionStatusQuery";
        this._identifierType = "1";
        this._initiator = "testapi";
    }
    _debugAssert() {
        // if no shortcode provided, check if global shortcode present
        if (!this._shortCode) {
            this._shortCode = String(this.config.shortCode);
        }
        (0, utils_1.errorAssert)(this._shortCode, "Please provide a shortcode");
        (0, utils_1.errorAssert)(this._initiator, "Please provide an initiator name");
        (0, utils_1.errorAssert)(this._resultURL, "A result URL is required");
        (0, utils_1.errorAssert)(this._timeoutURL, "A timeout URL is required");
    }
    /**
     * @description Set the shortcode of the organization
     * @param  {string} code The shortcode of the organization to which the payment was made
     * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
     */
    shortCode(code) {
        this._shortCode = code;
        return this;
    }
    /**
     * @param  {string} name The name of Initiator who is making the request.
     * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
     */
    initiator(name) {
        this._initiator = name;
        return this;
    }
    /**
     * @param  {string} id The transaction ID of the transaction to be queried
     * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
     */
    transactionID(id) {
        this._transactionID = id;
        return this;
    }
    /**
     * @param  {string} value Any additional remarks to pass along - Optional
     * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
     */
    remarks(value) {
        this._remarks = value;
        return this;
    }
    /**
     * @param  {string} value A value specifying the occassion necessitating the payment
     * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
     */
    occassion(value) {
        this._occassion = value;
        return this;
    }
    /**
     * @param  {string} url The end-point that receives the response of the transaction
     * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
     */
    resultURL(url) {
        this._resultURL = url;
        return this;
    }
    /**
     * @param  {string} url The timeout end-point that receives a timeout response.
     * @returns {TransactionStatus} A reference to the TransactionStatus object for further manipulation
     */
    timeoutURL(url) {
        this._timeoutURL = url;
        return this;
    }
    queryStatus() {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            this._debugAssert();
            const app = this.config;
            const token = yield app.getAuthToken();
            try {
                const { data } = yield app.http.post(routes_1.routes.transactionstatus, {
                    PartyA: this._shortCode,
                    IdentifierType: (_a = this._identifierType) !== null && _a !== void 0 ? _a : "1",
                    Initiator: (_b = this._initiator) !== null && _b !== void 0 ? _b : "testapi",
                    SecurityCredential: this.config.securityCredential,
                    QueueTimeOutURL: this._timeoutURL,
                    ResultURL: this._resultURL,
                    TransactionID: this._transactionID,
                    CommandID: (_c = this._commandID) !== null && _c !== void 0 ? _c : "TransactionStatusQuery",
                    Occasion: (_d = this._occassion) !== null && _d !== void 0 ? _d : "Transaction Status",
                    Remarks: (_e = this._remarks) !== null && _e !== void 0 ? _e : "Transaction Status",
                }, {
                    Authorization: `Bearer ${token}`,
                });
                const values = new TransactionStatusResponseWrapper(data);
                return Promise.resolve(values);
            }
            catch (error) {
                return (0, utils_1.handleError)(error);
            }
        });
    }
}
exports.TransactionStatus = TransactionStatus;
class TransactionStatusResponseWrapper {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(data) {
        this.data = data;
    }
    isOkay() {
        return this.data.ResponseCode === "0";
    }
    getResponseCode() {
        return this.data.ResponseCode;
    }
    getResponseDescription() {
        return this.data.ResponseDescription;
    }
}
class TransactionStatusResultWrapper {
}
exports.TransactionStatusResultWrapper = TransactionStatusResultWrapper;
//# sourceMappingURL=transactionStatus.js.map