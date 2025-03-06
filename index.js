require('dotenv').config();

const express = require("express");
const { Checkout } = require('checkout-sdk-node');
const app = express();


// Add middleware to parse JSON requests
app.use(express.json());

// Initialize Checkout.com client
const cko = new Checkout(process.env.CHECKOUT_SECRET_KEY, {
    environment: 'sandbox'
});


// Payment processing endpoint
app.post("/api/process-payment", async (req, res) => {
    try {
        const { token, amount, currency, reference, customerInfo } = req.body;

        const payment = await cko.payments.request({
            source: {
                type: "token",
                token: token
            },
            amount: amount,
            currency: currency,
            reference: reference,
            processing_channel_id: process.env.CHECKOUT_PROCESSING_CHANNEL_ID,
            customer: {
                email: customerInfo.email,
                name: customerInfo.name
            },
            billing: {
                address: {
                    address_line1: customerInfo.address_line1,
                    address_line2: customerInfo.address_line2,
                    city: customerInfo.city,
                    state: customerInfo.state,
                    zip: customerInfo.zip,
                    country: customerInfo.country
                },
                phone: {
                    country_code: customerInfo.country_code,
                    number: customerInfo.phone
                }
            }
        });

        res.json({
            success: true,
            payment: payment
        });

    } catch (err) {
        console.error('Payment error:', err);
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

app.get("/", (req, res) => {
    res.send("Oh Yeah!");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
