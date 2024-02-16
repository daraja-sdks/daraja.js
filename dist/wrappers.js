"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationRequestWrapper = void 0;
class ValidationRequestWrapper {
    constructor(data) {
        this.data = data;
    }
    getTransactionID() {
        return this.data.TransID;
    }
    getPhoneNumber() {
        return this.data.MSISDN;
    }
    getAccountNumber() {
        return this.data.BillRefNumber;
    }
    getTransactionAmount() {
        return +this.data.TransAmount;
    }
    getAccountBalance() {
        return this.data.OrgAccountBalance;
    }
    getSenderName() {
        return this.data.FirstName;
    }
}
exports.ValidationRequestWrapper = ValidationRequestWrapper;
//# sourceMappingURL=wrappers.js.map