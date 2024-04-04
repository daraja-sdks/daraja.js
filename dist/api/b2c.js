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
exports.BusinessToCustomer = void 0;
const routes_1 = require("../models/routes");
const utils_1 = require("../utils");
class BusinessToCustomer {
    constructor(config) {
        this.config = config;
    }
    _debugAssert() {
        if (!this._shortCode) {
            this._shortCode = String(this.config.shortCode);
        }
        (0, utils_1.errorAssert)(this._shortCode, "Shortcode is required");
        (0, utils_1.errorAssert)(this._phoneNumber, "Phone number is required");
        (0, utils_1.errorAssert)(this._amount, "Amount is required");
        (0, utils_1.errorAssert)(this._timeoutURL, "Timeout URL is required");
        (0, utils_1.errorAssert)(this._resultURL, "Result URL is required");
    }
    /**
     * Business/Organization shortcode
     *
     * @description A method that sets the shortcode of the organization receiving payment
     * @param {string} code The shortcode of the organization receiving payment
     * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
     */
    shortCode(code) {
        this._shortCode = code;
        return this;
    }
    /**
     * Payer Phone Number
     *
     * @param {number} no The phone number of the payer in the format 254...
     * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
     */
    phoneNumber(no) {
        this._phoneNumber = no;
        return this;
    }
    /**
     * Payable amount
     *
     * @param {number} amount The amount to be paid to the the business
     * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
     */
    amount(amount) {
        this._amount = amount;
        return this;
    }
    /**
     * Transaction type / Command ID
     *
     * @description Set the type of transaction taking place
     * @param  {"SalaryPayment"|"BusinessPayment"|"PromotionPayment"} type Unique command for each transaction type
     * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
     */
    transactionType(type) {
        this._commandID = type;
        return this;
    }
    /**
     * Initiator Name
     *
     * @description A method to the initiator name for the transaction
     * @param  {string} name This is the credential/username used to authenticate the transaction request.
     * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
     */
    initiatorName(name) {
        this._initiator = name;
        return this;
    }
    /**
     * Remarks
     *
     * @description A method used to pass any additional remarks
     * @param  {string} value Comments that are sent along with the transaction.
     * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
     */
    remarks(value) {
        this._remarks = value;
        return this;
    }
    /**
     * Timeout URL/ Queue timeout url
     *
     * @description A method for setting the timeout URL
     * @param  {string} url The end-point that receives a timeout response.
     * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
     */
    timeoutURL(url) {
        this._timeoutURL = url;
        return this;
    }
    /**
     * Result URL
     *
     * @description A method for setting the Result URL
     * @param  {string} url The end-point that receives the response of the transaction
     * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
     */
    resultURL(url) {
        this._resultURL = url;
        return this;
    }
    /**
     * Occassion - optional
     *
     * @description A method for setting an optional `occaccion` value
     * @param  {string} value The occassion necessitating the payment
     * @returns {BusinessToCustomer} Returns a reference to the B2C object for further manipulation
     */
    occassion(value) {
        this._occassion = value;
        return this;
    }
    send() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            this._debugAssert();
            const app = this.config;
            const token = yield app.getAuthToken();
            try {
                const data = yield app.http.post(routes_1.routes.b2c, {
                    Amount: this._amount,
                    CommandID: (_a = this._commandID) !== null && _a !== void 0 ? _a : "SalaryPayment",
                    InitiatorName: (_b = this._initiator) !== null && _b !== void 0 ? _b : "testapi",
                    SecurityCredential: this.config.securityCredential,
                    PartyA: this._shortCode,
                    PartyB: String(this._phoneNumber),
                    QueueTimeOutURL: this._timeoutURL,
                    ResultURL: this._resultURL,
                    Occasion: (_c = this._occassion) !== null && _c !== void 0 ? _c : "payment",
                    Remarks: (_d = this._remarks) !== null && _d !== void 0 ? _d : "payment",
                }, {
                    Authorization: `Bearer ${token}`,
                });
                const values = new B2CResponseWrapper(data);
                return Promise.resolve(values);
            }
            catch (error) {
                return (0, utils_1.handleError)(error);
            }
        });
    }
}
exports.BusinessToCustomer = BusinessToCustomer;
class B2CResponseWrapper {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(data) {
        this.data = data;
    }
    isOkay() {
        return (this.data.ResponseCode === "0" &&
            this.data.ResponseDescription.toLowerCase().includes("success"));
    }
    getResponseCode() {
        return this.data.ResponseCode;
    }
    getResponseDescription() {
        return this.data.ResponseDescription;
    }
}
//# sourceMappingURL=b2c.js.map