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
exports.AccountBalance = void 0;
const routes_1 = require("../models/routes");
const utils_1 = require("../utils");
class AccountBalance {
    constructor(config) {
        this.config = config;
        this._initiator = "testapi";
    }
    _debugAssert() {
        (0, utils_1.errorAssert)(this._partyA, "Party A is required");
        (0, utils_1.errorAssert)(this._initiator, "Initiator is required");
        (0, utils_1.errorAssert)(this._resultURL, "Result URL is required");
        (0, utils_1.errorAssert)(this._timeoutURL, "Timeout URL is required");
    }
    /**
     * Party A
     * @param {string} code The shortcode of the organization receiving payment
     * @returns {AccountBalance} Returns a reference to the AccountBalance object for further manipulation
     * @memberof AccountBalance
     */
    shortCode(code) {
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
    initiator(name) {
        this._initiator = name;
        return this;
    }
    /**
     * Result URL
     * @param {string} url The URL to which the response from M-Pesa will be sent
     * @returns {AccountBalance} Returns a reference to the AccountBalance object for further manipulation
     * @memberof AccountBalance
     */
    resultURL(url) {
        this._resultURL = url;
        return this;
    }
    /**
     * Timeout URL
     * @param {string} url The URL to which the response from M-Pesa will be sent
     * @returns {AccountBalance} Returns a reference to the AccountBalance object for further manipulation
     * @memberof AccountBalance
     */
    timeoutURL(url) {
        this._timeoutURL = url;
        return this;
    }
    /**
     * Remarks
     * @param {string} value Any additional remarks to pass along - Optional
     * @returns {AccountBalance} Returns a reference to the AccountBalance object for further manipulation
     * @memberof AccountBalance
     */
    remarks(value) {
        this._remarks = value;
        return this;
    }
    /**
     * Builds the request object for the AccountBalance API
     * @returns {Mpesa} Returns a reference to the Mpesa object for further manipulation
     * @memberof AccountBalance
     */
    query() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this._debugAssert();
            const app = this.config;
            const token = yield app.getAuthToken();
            try {
                const { data } = yield app.http.post(routes_1.routes.accountbalance, {
                    PartyA: this._partyA,
                    IdentifierType: "4",
                    Initiator: (_a = this._initiator) !== null && _a !== void 0 ? _a : "testapi",
                    SecurityCredential: this.config.securityCredential,
                    QueueTimeOutURL: this._timeoutURL,
                    ResultURL: this._resultURL,
                    CommandID: "AccountBalance",
                    Remarks: (_b = this._remarks) !== null && _b !== void 0 ? _b : "Account balance query",
                }, {
                    Authorization: `Bearer ${token}`,
                });
                const values = new AccountBalanceResponseWrapper(data);
                return Promise.resolve(values);
            }
            catch (error) {
                return (0, utils_1.handleError)(error);
            }
        });
    }
}
exports.AccountBalance = AccountBalance;
class AccountBalanceResponseWrapper {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(data) {
        this.data = data;
    }
    get ResponseCode() {
        return this.data.ResponseCode;
    }
    get ResponseDescription() {
        return this.data.ResponseDescription;
    }
    isOkay() {
        return this.ResponseCode === "0";
    }
}
//# sourceMappingURL=accountBalance.js.map