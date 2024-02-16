export interface B2CInterface {
    InitiatorName: string;
    /**
     * The amount to be transacted.
     */
    Amount: number;
    /**
     * The Party sending the funds. Either msisdn or business short code
     */
    PartyA: string;
    /**
     * The Party receiving the funds. Either msisdn or business short code
     */
    PartyB: string;
    /**
     * This is a publicly accessible url where mpesa will send the response to when the request times out. Must accept POST requests
     */
    QueueTimeOutURL: string;
    /**
     * This is a publicly accessible url where mpesa will send the response to. Must accept POST requests
     */
    ResultURL: string;
    /**
     * `TransactionReversal` - Reversal for an erroneous C2B transaction.
     *
     * `SalaryPayment` - Used to send money from an employer to employees e.g. salaries
     *
     * `BusinessPayment` -	Used to send money from business to customer e.g. refunds
     *
     * `PromotionPayment` -	Used to send money when promotions take place e.g. raffle winners
     *
     * `AccountBalance` -	Used to check the balance in a paybill/buy goods account (includes utility, MMF, Merchant, Charges paid account).
     *
     * `CustomerPayBillOnline` -	Used to simulate a transaction taking place in the case of C2B Simulate Transaction or to initiate a transaction on behalf of the customer (STK Push).
     *
     * `TransactionStatusQuery` -	Used to query the details of a transaction.
     *
     * `CheckIdentity` -	Similar to STK push, uses M-Pesa PIN as a service.
     *
     * `BusinessPayBill` -	Sending funds from one paybill to another paybill
     *
     * `BusinessBuyGoods` -	sending funds from buy goods to another buy goods.
     *
     * `DisburseFundsToBusiness` -	Transfer of funds from utility to MMF account.
     *
     * `BusinessToBusinessTransfer` -	Transferring funds from one paybills MMF to another paybills MMF account.
     *
     * `BusinessTransferFromMMFToUtility` -	Transferring funds from paybills MMF to another paybills utility account.
     *
     */
    CommandID: CommandID;
    Occasion?: string;
    Remarks?: string;
    SecurityCredential: string;
}
export declare type CommandID = "SalaryPayment" | "BusinessPayment" | "PromotionPayment" | "AccountBalance" | "TransactionStatusQuery" | "TransactionReversal";
export interface B2CResponseInterface {
    ConversationID: string;
    OriginatorConversationID: string;
    /**
     * M-Pesa Result and Response Codes
     *
     * `0` - Success
     *
     * `1` - Insufficient Funds
     *
     * `2` - Less Than Minimum Transaction Value
     *
     * `3` - More Than Maximum Transaction Value
     *
     * `4` - Would Exceed Daily Transfer Limit
     *
     * `5` - Would Exceed Minimum Balance
     *
     * `6` - Unresolved Primary Party
     *
     * `7` - Unresolved Receiver Party
     *
     * `8` - Would Exceed Maxiumum Balance
     *
     * `11` - Debit Account Invalid
     *
     * `12` - Credit Account Invalid
     *
     * `13` - Unresolved Debit Account
     *
     * `14` - Unresolved Credit Account
     *
     * `15` - Duplicate Detected
     *
     * `17` - Internal Failure
     *
     * `20` - Unresolved Initiator
     *
     * `26` - Traffic blocking condition in place
     *
     */
    ResponseCode: string;
    ResponseDescription: string;
}
export interface B2BInterface {
    InitiatorName: string;
    /**
     * The amount to be transacted.
     */
    Amount: number;
    /**
     * The Party sending the funds. Either msisdn or business short code
     */
    PartyA: string;
    /**
     * The Party receiving the funds. Either msisdn or business short code
     */
    PartyB: string;
    /**
     * This is what the customer would enter as the account number when making payment to a paybill
     */
    AccountReference: any;
    /**
     * This is a publicly accessible url where mpesa will send the response to when the request times out. Must accept POST requests
     */
    QueueTimeOutURL: string;
    /**
     * This is a publicly accessible url where mpesa will send the response to. Must accept POST requests
     */
    ResultURL: string;
    /**
     * `TransactionReversal` - Reversal for an erroneous C2B transaction.
     *
     * `SalaryPayment` - Used to send money from an employer to employees e.g. salaries
     *
     * `BusinessPayment` -	Used to send money from business to customer e.g. refunds
     *
     * `PromotionPayment` -	Used to send money when promotions take place e.g. raffle winners
     *
     * `AccountBalance` -	Used to check the balance in a paybill/buy goods account (includes utility, MMF, Merchant, Charges paid account).
     *
     * `CustomerPayBillOnline` -	Used to simulate a transaction taking place in the case of C2B Simulate Transaction or to initiate a transaction on behalf of the customer (STK Push).
     *
     * `TransactionStatusQuery` -	Used to query the details of a transaction.
     *
     * `CheckIdentity` -	Similar to STK push, uses M-Pesa PIN as a service.
     *
     * `BusinessPayBill` -	Sending funds from one paybill to another paybill
     *
     * `BusinessBuyGoods` -	sending funds from buy goods to another buy goods.
     *
     * `DisburseFundsToBusiness` -	Transfer of funds from utility to MMF account.
     *
     * `BusinessToBusinessTransfer` -	Transferring funds from one paybills MMF to another paybills MMF account.
     *
     * `BusinessTransferFromMMFToUtility` -	Transferring funds from paybills MMF to another paybills utility account.
     *
     */
    CommandID?: string;
    /**
     * Identifier types - both sender and receiver - identify an M-Pesa transaction’s sending and receiving party as either a shortcode, a till number or a MSISDN (phone number). There are three identifier types that can be used with M-Pesa APIs.
     *
     * `1` - MSISDN
     *
     * `2` - Till Number
     *
     * `4` - Shortcode
     */
    SenderIdentifierType?: IdentifierType;
    /**
     * Identifier types - both sender and receiver - identify an M-Pesa transaction’s sending and receiving party as either a shortcode, a till number or a MSISDN (phone number). There are three identifier types that can be used with M-Pesa APIs.
     *
     * `1` - MSISDN
     *
     * `2` - Till Number
     *
     * `4` - Shortcode
     */
    RecieverIdentifierType?: IdentifierType;
    Remarks?: string;
}
export declare type IdentifierType = "1" | "2" | "4";
export interface AccountBalanceInterface {
    Initiator: string;
    SecurityCredential: string;
    /**
     * The Party sending the funds. Either msisdn or business short code
     */
    PartyA: string;
    /**
     * Identifier types - both sender and receiver - identify an M-Pesa transaction’s sending and receiving party as either a shortcode, a till number or a MSISDN (phone number). There are three identifier types that can be used with M-Pesa APIs.
     *
     * `1` - MSISDN
     *
     * `2` - Till Number
     *
     * `4` - Shortcode
     */
    IdentifierType: IdentifierType;
    /**
     * This is a publicly accessible url where mpesa will send the response to when the request times out. Must accept POST requests
     */
    QueueTimeOutURL: string;
    /**
     * This is a publicly accessible url where mpesa will send the response to. Must accept POST requests
     */
    ResultURL: string;
    /**
     * `TransactionReversal` - Reversal for an erroneous C2B transaction.
     *
     * `SalaryPayment` - Used to send money from an employer to employees e.g. salaries
     *
     * `BusinessPayment` -	Used to send money from business to customer e.g. refunds
     *
     * `PromotionPayment` -	Used to send money when promotions take place e.g. raffle winners
     *
     * `AccountBalance` -	Used to check the balance in a paybill/buy goods account (includes utility, MMF, Merchant, Charges paid account).
     *
     * `CustomerPayBillOnline` -	Used to simulate a transaction taking place in the case of C2B Simulate Transaction or to initiate a transaction on behalf of the customer (STK Push).
     *
     * `TransactionStatusQuery` -	Used to query the details of a transaction.
     *
     * `CheckIdentity` -	Similar to STK push, uses M-Pesa PIN as a service.
     *
     * `BusinessPayBill` -	Sending funds from one paybill to another paybill
     *
     * `BusinessBuyGoods` -	sending funds from buy goods to another buy goods.
     *
     * `DisburseFundsToBusiness` -	Transfer of funds from utility to MMF account.
     *
     * `BusinessToBusinessTransfer` -	Transferring funds from one paybills MMF to another paybills MMF account.
     *
     * `BusinessTransferFromMMFToUtility` -	Transferring funds from paybills MMF to another paybills utility account.
     *
     */
    CommandID: CommandID;
    Remarks?: string;
}
export interface AccountBalanceResponseInterface {
    OriginatorConversationID: string;
    ConversationID: string;
    /**
     * M-Pesa Result and Response Codes
     *
     * `0` - Success
     *
     * `1` - Insufficient Funds
     *
     * `2` - Less Than Minimum Transaction Value
     *
     * `3` - More Than Maximum Transaction Value
     *
     * `4` - Would Exceed Daily Transfer Limit
     *
     * `5` - Would Exceed Minimum Balance
     *
     * `6` - Unresolved Primary Party
     *
     * `7` - Unresolved Receiver Party
     *
     * `8` - Would Exceed Maxiumum Balance
     *
     * `11` - Debit Account Invalid
     *
     * `12` - Credit Account Invalid
     *
     * `13` - Unresolved Debit Account
     *
     * `14` - Unresolved Credit Account
     *
     * `15` - Duplicate Detected
     *
     * `17` - Internal Failure
     *
     * `20` - Unresolved Initiator
     *
     * `26` - Traffic blocking condition in place
     *
     */
    ResponseCode: string;
    ResponseDescription: string;
}
export interface TransactionStatusInterface {
    Initiator: string;
    SecurityCredential: string;
    TransactionID: string;
    /**
     * The Party sending the funds. Either msisdn or business short code
     */
    PartyA: string;
    /**
     * Identifier types - both sender and receiver - identify an M-Pesa transaction’s sending and receiving party as either a shortcode, a till number or a MSISDN (phone number). There are three identifier types that can be used with M-Pesa APIs.
     *
     * `1` - MSISDN
     *
     * `2` - Till Number
     *
     * `4` - Shortcode
     */
    IdentifierType: IdentifierType;
    /**
     * This is a publicly accessible url where mpesa will send the response to. Must accept POST requests
     */
    ResultURL: string;
    /**
     * This is a publicly accessible url where mpesa will send the response to when the request times out. Must accept POST requests
     */
    QueueTimeOutURL: string;
    /**
     * `TransactionReversal` - Reversal for an erroneous C2B transaction.
     *
     * `SalaryPayment` - Used to send money from an employer to employees e.g. salaries
     *
     * `BusinessPayment` -	Used to send money from business to customer e.g. refunds
     *
     * `PromotionPayment` -	Used to send money when promotions take place e.g. raffle winners
     *
     * `AccountBalance` -	Used to check the balance in a paybill/buy goods account (includes utility, MMF, Merchant, Charges paid account).
     *
     * `CustomerPayBillOnline` -	Used to simulate a transaction taking place in the case of C2B Simulate Transaction or to initiate a transaction on behalf of the customer (STK Push).
     *
     * `TransactionStatusQuery` -	Used to query the details of a transaction.
     *
     * `CheckIdentity` -	Similar to STK push, uses M-Pesa PIN as a service.
     *
     * `BusinessPayBill` -	Sending funds from one paybill to another paybill
     *
     * `BusinessBuyGoods` -	sending funds from buy goods to another buy goods.
     *
     * `DisburseFundsToBusiness` -	Transfer of funds from utility to MMF account.
     *
     * `BusinessToBusinessTransfer` -	Transferring funds from one paybills MMF to another paybills MMF account.
     *
     * `BusinessTransferFromMMFToUtility` -	Transferring funds from paybills MMF to another paybills utility account.
     *
     */
    CommandID?: CommandID;
    Remarks?: string;
    Occasion?: string;
}
export interface TransactionStatusResponseInterface {
    OriginatorConversationID: string;
    ConversationID: string;
    /**
     * M-Pesa Result and Response Codes
     *
     * `0` - Success
     *
     * `1` - Insufficient Funds
     *
     * `2` - Less Than Minimum Transaction Value
     *
     * `3` - More Than Maximum Transaction Value
     *
     * `4` - Would Exceed Daily Transfer Limit
     *
     * `5` - Would Exceed Minimum Balance
     *
     * `6` - Unresolved Primary Party
     *
     * `7` - Unresolved Receiver Party
     *
     * `8` - Would Exceed Maxiumum Balance
     *
     * `11` - Debit Account Invalid
     *
     * `12` - Credit Account Invalid
     *
     * `13` - Unresolved Debit Account
     *
     * `14` - Unresolved Credit Account
     *
     * `15` - Duplicate Detected
     *
     * `17` - Internal Failure
     *
     * `20` - Unresolved Initiator
     *
     * `26` - Traffic blocking condition in place
     *
     */
    ResponseCode: string;
    ResponseDescription: string;
}
export interface ReversalInterface {
    Amount: number;
    Initiator: string;
    SecurityCredential: string;
    TransactionID: string;
    ReceiverParty: string;
    /**
     * This is a publicly accessible url where mpesa will send the response to. Must accept POST requests
     */
    ResultURL: string;
    /**
     * This is a publicly accessible url where mpesa will send the response to when the request times out. Must accept POST requests
     */
    QueueTimeOutURL: string;
    /**
     * `TransactionReversal` - Reversal for an erroneous C2B transaction.
     *
     * `SalaryPayment` - Used to send money from an employer to employees e.g. salaries
     *
     * `BusinessPayment` -	Used to send money from business to customer e.g. refunds
     *
     * `PromotionPayment` -	Used to send money when promotions take place e.g. raffle winners
     *
     * `AccountBalance` -	Used to check the balance in a paybill/buy goods account (includes utility, MMF, Merchant, Charges paid account).
     *
     * `CustomerPayBillOnline` -	Used to simulate a transaction taking place in the case of C2B Simulate Transaction or to initiate a transaction on behalf of the customer (STK Push).
     *
     * `TransactionStatusQuery` -	Used to query the details of a transaction.
     *
     * `CheckIdentity` -	Similar to STK push, uses M-Pesa PIN as a service.
     *
     * `BusinessPayBill` -	Sending funds from one paybill to another paybill
     *
     * `BusinessBuyGoods` -	sending funds from buy goods to another buy goods.
     *
     * `DisburseFundsToBusiness` -	Transfer of funds from utility to MMF account.
     *
     * `BusinessToBusinessTransfer` -	Transferring funds from one paybills MMF to another paybills MMF account.
     *
     * `BusinessTransferFromMMFToUtility` -	Transferring funds from paybills MMF to another paybills utility account.
     *
     */
    CommandID: CommandID;
    /**
     * Identifier types - both sender and receiver - identify an M-Pesa transaction’s sending and receiving party as either a shortcode, a till number or a MSISDN (phone number). There are three identifier types that can be used with M-Pesa APIs.
     *
     * `1` - MSISDN
     *
     * `2` - Till Number
     *
     * `4` - Shortcode
     */
    RecieverIdentifierType?: "1" | "2" | "4" | "11";
    Remarks?: string;
    Occasion?: string;
}
export interface ReversalResponseInterface {
    OriginatorConversationID: string;
    ConversationID: string;
    /**
     * M-Pesa Result and Response Codes
     *
     * `0` - Success
     *
     * `1` - Insufficient Funds
     *
     * `2` - Less Than Minimum Transaction Value
     *
     * `3` - More Than Maximum Transaction Value
     *
     * `4` - Would Exceed Daily Transfer Limit
     *
     * `5` - Would Exceed Minimum Balance
     *
     * `6` - Unresolved Primary Party
     *
     * `7` - Unresolved Receiver Party
     *
     * `8` - Would Exceed Maxiumum Balance
     *
     * `11` - Debit Account Invalid
     *
     * `12` - Credit Account Invalid
     *
     * `13` - Unresolved Debit Account
     *
     * `14` - Unresolved Credit Account
     *
     * `15` - Duplicate Detected
     *
     * `17` - Internal Failure
     *
     * `20` - Unresolved Initiator
     *
     * `26` - Traffic blocking condition in place
     *
     */
    ResponseCode: string;
    ResponseDescription: string;
}
export interface StkPushInterface {
    /**
     * The organization shortcode used to receive the transaction.
     */
    BusinessShortCode: number;
    /**
     * The amount to be transacted.
     */
    Amount: number;
    /**
     * The Party sending the funds. Either msisdn or business short code
     */
    PartyA: string;
    /**
     * The Party receiving the funds. Either msisdn or business short code
     */
    PartyB: string;
    /**
     * The MSISDN of the involved party
     */
    PhoneNumber: string;
    /**
     * This is a publicly accessible url where mpesa will send the response to. Must accept POST requests
     */
    CallBackURL: string;
    /**
     * This is what the customer would enter as the account number when making payment to a paybill
     */
    AccountReference: string;
    /**
     * Lipa Na Mpesa Pass Key.
     */
    Password: string;
    TransactionType?: TransactionType;
    TransactionDesc?: string;
    Timestamp: string;
}
export declare type TransactionType = "CustomerPayBillOnline" | "CustomerBuyGoodsOnline";
export interface StkPushResponseInterface {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    /**
     * M-Pesa Result and Response Codes
     *
     * `0` - Success
     *
     * `1` - Insufficient Funds
     *
     * `2` - Less Than Minimum Transaction Value
     *
     * `3` - More Than Maximum Transaction Value
     *
     * `4` - Would Exceed Daily Transfer Limit
     *
     * `5` - Would Exceed Minimum Balance
     *
     * `6` - Unresolved Primary Party
     *
     * `7` - Unresolved Receiver Party
     *
     * `8` - Would Exceed Maxiumum Balance
     *
     * `11` - Debit Account Invalid
     *
     * `12` - Credit Account Invalid
     *
     * `13` - Unresolved Debit Account
     *
     * `14` - Unresolved Credit Account
     *
     * `15` - Duplicate Detected
     *
     * `17` - Internal Failure
     *
     * `20` - Unresolved Initiator
     *
     * `26` - Traffic blocking condition in place
     *
     */
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
}
export interface StkQueryInterface {
    /**
     * The organization shortcode used to receive the transaction.
     */
    BusinessShortCode: number;
    CheckoutRequestID: string;
    Password: string;
    Timestamp: string;
}
export interface StkQueryResponseInterface {
    /**
     * M-Pesa Result and Response Codes
     *
     * `0` - Success
     *
     * `1` - Insufficient Funds
     *
     * `2` - Less Than Minimum Transaction Value
     *
     * `3` - More Than Maximum Transaction Value
     *
     * `4` - Would Exceed Daily Transfer Limit
     *
     * `5` - Would Exceed Minimum Balance
     *
     * `6` - Unresolved Primary Party
     *
     * `7` - Unresolved Receiver Party
     *
     * `8` - Would Exceed Maxiumum Balance
     *
     * `11` - Debit Account Invalid
     *
     * `12` - Credit Account Invalid
     *
     * `13` - Unresolved Debit Account
     *
     * `14` - Unresolved Credit Account
     *
     * `15` - Duplicate Detected
     *
     * `17` - Internal Failure
     *
     * `20` - Unresolved Initiator
     *
     * `26` - Traffic blocking condition in place
     *
     */
    ResponseCode: string;
    ResponseDescription: string;
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResultCode: string;
    ResultDesc: string;
}
export interface STKPushResultInterface {
    Body: {
        stkCallback: {
            MerchantRequestID: string;
            CheckoutRequestID: string;
            ResultCode: number;
            ResultDesc: string;
            /**
             * Amount: number;
             * MpesaReceiptNumber: string;
             * Balance: number;
             * TransactionDate: string;
             * PhoneNumber: string;
             */
            CallbackMetadata: {
                Item: Array<{
                    Name: string;
                    Value: string;
                }>;
            };
        };
    };
}
export interface C2BRegisterInterface {
    ShortCode: number;
    /**
     * This is a publicly accessible url where mpesa will send the confirmation to. Must accept POST requests
     */
    ConfirmationURL: string;
    /**
     * This is a publicly accessible url where mpesa will send the validation to. Must accept POST requests
     */
    ValidationURL: string;
    ResponseType: ResponseType;
}
export declare type ResponseType = "Completed" | "Cancelled";
export interface C2BRegisterResponseInterface {
    OriginatorCoversationID: string;
    ResponseCode: string;
    ResponseDescription: string;
}
export interface C2BSimulateInterface {
    /**
     * `TransactionReversal` - Reversal for an erroneous C2B transaction.
     *
     * `SalaryPayment` - Used to send money from an employer to employees e.g. salaries
     *
     * `BusinessPayment` -	Used to send money from business to customer e.g. refunds
     *
     * `PromotionPayment` -	Used to send money when promotions take place e.g. raffle winners
     *
     * `AccountBalance` -	Used to check the balance in a paybill/buy goods account (includes utility, MMF, Merchant, Charges paid account).
     *
     * `CustomerPayBillOnline` -	Used to simulate a transaction taking place in the case of C2B Simulate Transaction or to initiate a transaction on behalf of the customer (STK Push).
     *
     * `TransactionStatusQuery` -	Used to query the details of a transaction.
     *
     * `CheckIdentity` -	Similar to STK push, uses M-Pesa PIN as a service.
     *
     * `BusinessPayBill` -	Sending funds from one paybill to another paybill
     *
     * `BusinessBuyGoods` -	sending funds from buy goods to another buy goods.
     *
     * `DisburseFundsToBusiness` -	Transfer of funds from utility to MMF account.
     *
     * `BusinessToBusinessTransfer` -	Transferring funds from one paybills MMF to another paybills MMF account.
     *
     * `BusinessTransferFromMMFToUtility` -	Transferring funds from paybills MMF to another paybills utility account.
     *
     */
    CommandID: TransactionType;
    /**
     * The amount to be transacted.
     */
    Amount: number;
    /**
     * Phone number
     */
    Msisdn: number;
    BillRefNumber?: any;
    ShortCode: number;
}
export interface C2BSimulateResponseInterface {
    ConversationID: string;
    OriginatorCoversationID: string;
    ResponseDescription: string;
}
export interface ValidationRequestInterface {
    /**
     * {
     "TransactionType":"Pay Bill",
     "TransID":"RKTQDM7W6S",
     "TransTime":"20191122063845",
     "TransAmount":"10",
     "BusinessShortCode":"600638",
     "BillRefNumber":"254708374149",
     "InvoiceNumber":"",
     "OrgAccountBalance":"49197.00",
     "ThirdPartyTransID":"",
     "MSISDN":"254708374149",
     "FirstName":"John",
     "MiddleName":"",
     "LastName":"Doe"
  }
     */
    TransactionType: string;
    TransID: string;
    TransTime: string;
    TransAmount: string;
    BusinessShortCode: string;
    BillRefNumber: string;
    InvoiceNumber: string;
    OrgAccountBalance: string;
    ThirdPartyTransID: string;
    MSISDN: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
}
export interface ValidationRequestV2Interface {
    /**
     * {
     "TransactionType":"Pay Bill",
     "TransID":"RKTQDM7W6S",
     "TransTime":"20191122063845",
     "TransAmount":"10",
     "BusinessShortCode":"600638",
     "BillRefNumber":"A123",
     "InvoiceNumber":"",
     "OrgAccountBalance":"49197.00",
     "ThirdPartyTransID":"",
     "MSISDN":"2547*****149",
     "FirstName":"John",
  }
     */
    TransactionType: string;
    TransID: string;
    TransTime: string;
    TransAmount: string;
    BusinessShortCode: string;
    BillRefNumber: string;
    InvoiceNumber: string;
    OrgAccountBalance: string;
    ThirdPartyTransID: string;
    MSISDN: string;
    FirstName: string;
}
export interface ValidationResponseInterface {
    /**
     * 0 - Accepted
     *
     * C2B00011 - Invalid MSISDN
     *
     * C2B00012 - Invalid Account Number
     *
     * C2B00013 - Invalid Amount
     *
     * C2B00014 - Invalid KYC Details
     *
     * C2B00015 - Invalid shortcode
     *
     * C2B00016 - Other Error
     */
    ResultCode: string;
    ResultDesc: string;
}
export declare type ConfirmationRequestInterface = ValidationRequestInterface;
export declare type ConfirmationRequestV2Interface = ValidationRequestV2Interface;
