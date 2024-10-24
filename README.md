## Webhook signature verifier

A very small, standalone express application, to take inspiration from when constructing your own HMAC signatures for verification when receiving webhooks.

This app constructs a HMAC SHA 256 using a shared secret between your system and the upstream service you're subscribing to, and expects a the signature to be set in the header.

Please be aware that some special characters are encoded automatically when parsing the body, which will generate inaccurate signatures. It's important to construct the signature using the raw body when comparing your generated signature against the one the request is signed with.

You can use something like [ngrok](https://ngrok.com/docs/getting-started/) to be able to receive traffic from the Internet, just remember to turn the tunnel off when you're done debugging.

## Start the application

```
npm i
node app.js
```

## Run tests

```
npm run test
```
