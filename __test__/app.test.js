const app = require("../app")
const request = require("supertest");
const crypto = require("crypto");

describe("POST /webhook", () => {
  it("should respond with 200 for valid signature", async () => {
    const payload = { "test": "some data" };
    const hmac = crypto.createHmac("sha256", "sharedSecretHere");
    hmac.update(JSON.stringify(payload));
    const validSignature = hmac.digest("hex");
    console.log("Valid signature:", validSignature);

    const response = await request(app)
      .post("/webhook")
      .set("X-Signature", validSignature)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.text).toBe("Webhook received successfully");
  });

  it("should respond with 401 for invalid signature", async () => {
    const payload = { "test": "some data" };

    const response = await request(app)
      .post("/webhook")
      .set("X-Signature", "invalidSignature")
      .send(payload);

    expect(response.status).toBe(401);
    expect(response.text).toBe("Invalid signature");
  });

  it("should respond with 401 when signature header is missing", async () => {
    const payload = { "test": "some data" };

    const response = await request(app)
      .post("/webhook")
      .send(payload);

    expect(response.status).toBe(401);
    expect(response.text).toBe("Invalid signature");
  });
});
