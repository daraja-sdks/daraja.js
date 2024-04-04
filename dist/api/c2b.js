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
exports.CustomerToBusiness = void 0;
const routes_1 = require("../models/routes");
const utils_1 = require("../utils");
class CustomerToBusiness {
    constructor(config) {
        this.config = config;
        // setup defaults
        this._commandID = "CustomerPayBillOnline";
        this._responseType = "Cancelled";
    }
    _debugAssert(level) {
        if (!this._shortCode) {
            this._shortCode = String(this.config.shortCode);
        }
        if (level === "basic") {
            (0, utils_1.errorAssert)(this._amount, "An amount must be set for C2B to function");
            (0, utils_1.errorAssert)(this._phoneNumber, "A Phone Number must be set for C2B to function");
        }
        (0, utils_1.errorAssert)(this._shortCode, "Short code must be set for C2B to function");
        if (level === "full") {
            (0, utils_1.errorAssert)(this._callbackUrl, "Please set a callback url");
            (0, utils_1.errorAssert)(this._confirmationUrl, "Please set a confirmaiton url");
            (0, utils_1.errorAssert)(this._validationUrl, "Please set a validation url");
        }
    }
    /**
     * Business/Organization shortcode
     *
     * @description A method that sets the shortcode of the organization receiving payment
     * @param {string} code The shortcode of the organization receiving payment
     * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
     */
    shortCode(code) {
        this._shortCode = code;
        return this;
    }
    /**
     * Payer Phone Number
     *
     * @param {number} no The phone number of the payer in the format 254...
     * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
     */
    phoneNumber(no) {
        this._phoneNumber = no;
        return this;
    }
    /**
     * Payable amount
     *
     * @param {number} amount The amount to be paid to the the business
     * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
     */
    amount(amount) {
        this._amount = amount;
        return this;
    }
    /**
     * Payment Type / Command ID
     *
     * @description Set the payment type to be made
     * @param {string} id The type of payment to be made. This refers to the whether the payment is buy goods and services or paybill. Valid values are `paybill` or `buy-goods`.
     * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
     */
    paymentType(id) {
        if (id !== ("CustomerPayBillOnline" || "CustomerBuyGoodsOnline")) {
            this._commandID = "CustomerPayBillOnline";
        }
        else {
            this._commandID = id;
        }
        return this;
    }
    /**
     * Account Number/ Bill Ref No.
     *
     * @description Setup the account number/billref no. This is only applicable when the payment type is `paybill`
     * @param  {string} account The account number to be referenced in the payment
     * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
     */
    accountNumber(account) {
        this._billRefNo = account;
        return this;
    }
    /**
     * @description Configure whether or not a payment should be completed or cancelled when the Validation URL is unreachable for any reason
     * @param  {boolean} value Whether or not to cancel the payment
     * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
     */
    cancelIfUnreachable(value) {
        if (value) {
            this._responseType = "Cancelled";
        }
        else {
            this._responseType = "Completed";
        }
        return this;
    }
    /**
     * Callback URL
     *
     * @decscription This method is used to set the callback url that will be invoked once a payment has been made. Note that the value cannot be empty and must be a `https` route, otherwise, the request will fail.
     * @param  {string} url The Callback URL to be invoked after a payment is made
     * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
     */
    callbackURL(url) {
        this._callbackUrl = url;
        return this;
    }
    /**
     * Confirmation URL
     *
     * @description This method is used to define a custom confirmation url that receives the confirmation request from API upon payment completion.
     * @param  {string} url The custom confirmation URL for an organization
     * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
     */
    confirmationURL(url) {
        this._confirmationUrl = url;
        return this;
    }
    /**
     * @description A method used to set the validation URL. The validation URL is only called if the external validation on the registered shortcode is enabled. (By default External Validation is dissabled)
     * @param  {string} url This is the URL that receives the validation request from API upon payment submission
     * @returns {CustomerToBusiness} Returns a reference to the C2B object for further manipulation
     */
    validationURL(url) {
        this._validationUrl = url;
        return this;
    }
    /**
     * @description A method used to send the actual simulation request when in sandbox environment. Since C2B is customer-initiated in a production environment, you can only simulate while on sandbox.
     * @returns {Promise<C2BSimulateResponseWrapper>} returns the c2b simulate response wrapped in a class that provides utility methods to access the values.
     */
    simulate() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // run assertions
            this._debugAssert("basic");
            const app = this.config;
            const token = yield app.getAuthToken();
            try {
                const data = yield app.http.post(routes_1.routes.c2bsimulate, {
                    ShortCode: this._shortCode,
                    CommandID: this._commandID,
                    Amount: this._amount,
                    Msisdn: this._phoneNumber,
                    BillRefNumber: (_a = this._billRefNo) !== null && _a !== void 0 ? _a : this._phoneNumber,
                }, {
                    Authorization: `Bearer ${token}`,
                });
                const values = new C2BSimulateResponseWrapper(data);
                return Promise.resolve(values);
            }
            catch (error) {
                return (0, utils_1.handleError)(error);
            }
        });
    }
    /**
     * @description This method is invoked when one intends to register the configured validation and confirmation urls
     * @returns {Promise<C2BRegisterResponseWrapper>} A promise that resolves to the c2b register response wrapper if the request completes with no errors whatsoever.
     */
    registerURLS() {
        return __awaiter(this, void 0, void 0, function* () {
            // run assertions
            this._debugAssert("full");
            const app = this.config;
            const token = yield app.getAuthToken();
            try {
                const data = yield app.http.post(routes_1.routes.c2bregister, {
                    ShortCode: +this._shortCode,
                    ConfirmationURL: this._confirmationUrl,
                    ValidationURL: this._validationUrl,
                    ResponseType: this._responseType,
                }, {
                    Authorization: `Bearer ${token}`,
                });
                const values = new C2BRegisterResponseWrapper(data);
                return Promise.resolve(values);
            }
            catch (error) {
                return (0, utils_1.handleError)(error);
            }
        });
    }
}
exports.CustomerToBusiness = CustomerToBusiness;
class C2BSimulateResponseWrapper {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(data) {
        this.data = data;
    }
    isOkay() {
        const desc = this.data.ResponseDescription;
        return desc.includes("successfully") || desc.includes("accepted");
    }
    getResponseDescription() {
        return this.data.ResponseDescription;
    }
}
class C2BRegisterResponseWrapper {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(data) {
        this.data = data;
    }
    isOkay() {
        return (this.data.ResponseDescription.includes("success") ||
            this.data.ResponseCode === "0");
    }
    getResponseDescription() {
        return this.data.ResponseDescription;
    }
    getResponseCode() {
        return this.data.ResponseCode;
    }
}
//# sourceMappingURL=c2b.js.map