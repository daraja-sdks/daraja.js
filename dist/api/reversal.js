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
exports.Reversal = void 0;
const routes_1 = require("../models/routes");
const utils_1 = require("../utils");
class Reversal {
    constructor(config) {
        this.config = config;
        this._receiverIdentifierType = "11";
    }
    _debugAssert() {
        (0, utils_1.errorAssert)(this._partyA, "Party A is required");
        (0, utils_1.errorAssert)(this._initiator, "Initiator is required");
        (0, utils_1.errorAssert)(this._resultURL, "Result URL is required");
        (0, utils_1.errorAssert)(this._timeoutURL, "Timeout URL is required");
    }
    amount(amount) {
        this._amount = amount;
        return this;
    }
    /**
     * Party A
     * @param {string} code The shortcode of the organization receiving payment
     * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
     * @memberof Reversal
     */
    shortCode(code) {
        this._partyA = code;
        return this;
    }
    /**
     * Initiator
     * @param {string} name The name of Initiator who is making the request.
     * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
     * @memberof Reversal
     * @description The name of Initiator who is making the request.
     */
    initiator(name) {
        this._initiator = name;
        return this;
    }
    /**
     * Result URL
     * @param {string} url The URL to which the response from M-Pesa will be sent
     * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
     * @memberof Reversal
     * @description The URL to which the response from M-Pesa will be sent
     */
    resultURL(url) {
        this._resultURL = url;
        return this;
    }
    /**
     * Timeout URL
     * @param {string} url The URL to which the response from M-Pesa will be sent
     * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
     * @memberof Reversal
     * @description The URL to which the response from M-Pesa will be sent
     */
    timeoutURL(url) {
        this._timeoutURL = url;
        return this;
    }
    /**
     * Transaction ID
     * @param {string} id The unique identifier for the transaction request
     * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
     * @memberof Reversal
     * @description The unique identifier for the transaction request
     */
    transactionID(id) {
        this._transactionID = id;
        return this;
    }
    /**
     * Occasion
     * @param {string} occasion The occasion for the transaction
     * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
     * @memberof Reversal
     */
    occasion(occasion) {
        this._occasion = occasion;
        return this;
    }
    /**
     * Remarks
     * @param {string} remarks The remarks for the transaction
     * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
     * @memberof Reversal
     */
    remarks(remarks) {
        this._remarks = remarks;
        return this;
    }
    /**
     * Receiver Identifier Type
     * @param {number} type The type of the organization receiving the transaction
     * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
     */
    receiverIdentifierType(type) {
        this._receiverIdentifierType = type;
        return this;
    }
    /**
     * Builds the request object for the reversal API
     * @returns {Reversal} Returns a reference to the Reversal object for further manipulation
     * @memberof Reversal
     */
    send() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            this._debugAssert();
            const app = this.config;
            const token = yield app.getAuthToken();
            try {
                const { data } = yield app.http.post(routes_1.routes.reversal, {
                    ReceiverParty: this._partyA,
                    Amount: this._amount,
                    RecieverIdentifierType: this._receiverIdentifierType,
                    Initiator: (_a = this._initiator) !== null && _a !== void 0 ? _a : "testapi",
                    SecurityCredential: this.config.securityCredential,
                    TransactionID: this._transactionID,
                    QueueTimeOutURL: this._timeoutURL,
                    ResultURL: this._resultURL,
                    CommandID: "TransactionReversal",
                    Remarks: (_b = this._remarks) !== null && _b !== void 0 ? _b : "Reversal ",
                    Occasion: (_c = this._occasion) !== null && _c !== void 0 ? _c : "Reversal",
                }, {
                    Authorization: `Bearer ${token}`,
                });
                const values = new ReversalResponseWrapper(data);
                return Promise.resolve(values);
            }
            catch (error) {
                return (0, utils_1.handleError)(error);
            }
        });
    }
}
exports.Reversal = Reversal;
class ReversalResponseWrapper {
    constructor(data) {
        this.data = data;
    }
    getResponseCode() {
        return this.data.ResponseCode;
    }
    getResponseDescription() {
        return this.data.ResponseDescription;
    }
    isOkay() {
        return this.getResponseCode() === "0";
    }
}
//# sourceMappingURL=reversal.js.map