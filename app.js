const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

// Shared secret to construct the HMAC signature
const SHARED_SECRET = "sharedSecretHere";

app.use(bodyParser.json({ type: "application/json", verify: verifyRequestBody }));

function verifyRequestBody(req, res, buf, encoding) {
  req.rawBody = buf;
}

function validateSignature(req, res, next) {
  const signature = req.header("X-Signature");
  const hmac = crypto.createHmac("sha256", SHARED_SECRET);
  hmac.update(req.rawBody);
  const expectedSignature = hmac.digest("hex");

  // Validate the signature and move forward to the next middleware if valid
  if (signature !== expectedSignature) {
    return res.status(401).send("Invalid signature");
  }
  next();
}

// POST webhook endpoint
app.post("/webhook", validateSignature, (req, res) => {
  const payload = req.body;
  console.log("Received payload:", payload);
  res.status(200).send("Webhook received successfully");
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;