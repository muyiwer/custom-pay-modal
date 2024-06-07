# EchezonaPayPop NPM Library
[![npm version](https://img.shields.io/npm/v/echezonapay-pop")](https://www.npmjs.com/package/echezonapay-pop")
[![npm license](https://img.shields.io/npm/l/echezonapay-pop")](https://github.com/muyiwer/echezonaPayPlugin/tree/main/XprssPayPop/LICENSE)

A Javasript library for integrating with the echezonaPay Pop.

## Installation

```sh
npm install echezonapay-pop
```

```javascript
import EchezonaPayPop from "echezonapay-pop";

// Initialize echezona Pay pop up
const echezonaPay = new EchezonaPayPop();

// Example: Initialize Payment popup
  echezonaPay.newTransaction({
                onSuccess: (transaction) => {
                     // Payment complete! transactionId: transaction.transactionId 
                },
                onError: (transaction) => {
                    // Payment failed! transactionId: transaction.transactionId 
                },
                onCancel: () => {
                     // user closed popup
                },
                authorizeUrl: "https://checkout-echezona.vercel.app/******",
                request: {
                    amount: "2000.00",
                    transactionId: Math.floor(Math.random() * 1000000),
                    email: "sample@mail.com",
                    publicKey: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
                    currency: "NGN",
                    mode: "Live",
                    productId: "1001",
                    applyConviniencyCharge: true,
                    productDescription: "MTN",
                    bodyColor: "#0000",
                    buttonColor: "#0000",
                    footerText: "Powered by Test Ltd",
                    footerLink: "http://test.com",
                    footerLogo: "http://test.com/test.png",
                    metadata: [
                        {
                            "name": "sample",
                            "value": "test",
                        },
                    ],
                }
            });
       
  ```

  #### Request for calling Echezonapay popup function.
If you want to implement initialize payment from backend, just pass `authorizeUrl` and leave `request` parameter blank

To initialize the transaction, on `request` parameter you'll need to pass information such as email, first name, last name amount, publicKey, etc. Email and amount are required. You can also pass any other additional information in the metadata object field. Here is the full list of parameters you can pass:
|Param       | Type                 | Default    | Required | Description                      
| :------------ | :------------------- | :--------- | :------- | :-------------------------------------------------
| amount	| `string`			   | undefined      | `true`  | Amount you want to debit customer e.g 1000.00, 10.00...
| transactionId      | `string`             | undefined   | `true`  | Unique case sensitive transaction identification
| email | `string`             | undefined       | `true`  | Email address of customer
| publicKey       | `string`        | undefined | `true`  | Your public key from echezonaPay.
| currency      | `string`  |  `NGN`    | `true`   | Currency charge should be performed in. Allowed only `NGN`.
| productId      | `string`  |  undefined    | `false`   | unique identification number of the product your customer want to pay to.
| applyConviniencyCharge      | `boolean`  |  undefined    | `false`   | specify whether to apply charge for this customer transaction.
| productDescription     | `string`  |  undefined    | `false`   | description number of the product your customer want to pay to.
| mode      | `string`  |  `Debug`    | `true`   | Allowed values are `Debug` or `Live`.
| callBackUrl      | `string`  |  your current url page    | `false`   | CallbackUrl is the url you want your customer to be redirected to when payment is successful. The default url is the page url where customer intialized payment.
| bodyColor     | `string`  |  null    | `false`   | your prefered customized color for the payment page body.
| buttonColor     | `string`  |  null    | `false`   |  your prefered customized color for the payment page buttons.
| footerText     | `string`  |  null    | `false`   |  your prefered customized text for the payment page footer.
| footerLogo     | `string`  |  null    | `false`   |  your prefered customized logo for the payment page footer.
| metadata      | `object`  |  empty `object`    | `false`   | Object containing any extra information you want recorded with the transaction.