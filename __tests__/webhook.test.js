import { SHARED_SECRET, SIGNATURE_HEADER_NAME } from "../lib/constants";
import { verifySignature } from "../lib/signature";
import crypto from "crypto";

// Mock the console.log to prevent test output noise
jest.mock("console", () => ({
  ...console,
  log: jest.fn(),
  error: jest.fn(),
}));

// Helper function to generate a valid signature
function generateSignature(payload) {
  const bodyString =
    typeof payload === "string" ? payload : JSON.stringify(payload);
  const hmac = crypto.createHmac("sha256", SHARED_SECRET);
  hmac.update(bodyString);
  return hmac.digest("hex");
}

describe("Webhook Signature Verification", () => {
  it("should verify a valid signature", () => {
    const payload = { test: "some data" };
    const payloadString = JSON.stringify(payload);
    const validSignature = generateSignature(payloadString);

    const result = verifySignature(payloadString, validSignature);
    expect(result).toBe(true);
  });

  it("should reject an invalid signature", () => {
    const payload = { test: "some data" };
    const payloadString = JSON.stringify(payload);
    const invalidSignature = "invalidSignature123";

    const result = verifySignature(payloadString, invalidSignature);
    expect(result).toBe(false);
  });

  it("should reject when signature is missing", () => {
    const payload = { test: "some data" };
    const payloadString = JSON.stringify(payload);

    const result = verifySignature(payloadString, null);
    expect(result).toBe(false);
  });

  it("should verify signature with different payloads", () => {
    // Test case 1: Simple string
    const payload1 = "Hello, world!";
    const signature1 = generateSignature(payload1);
    expect(verifySignature(payload1, signature1)).toBe(true);

    // Test case 2: Empty object
    const payload2 = "{}";
    const signature2 = generateSignature(payload2);
    expect(verifySignature(payload2, signature2)).toBe(true);

    // Test case 3: Complex nested object
    const payload3 = JSON.stringify({
      id: 12345,
      event: "test_event",
      data: {
        user: {
          id: 1,
          name: "Test User",
        },
        items: [1, 2, 3, 4, 5],
      },
    });
    const signature3 = generateSignature(payload3);
    expect(verifySignature(payload3, signature3)).toBe(true);
  });

  it("should reject tampered payloads", () => {
    const originalPayload = { id: 123, action: "create" };
    const originalPayloadString = JSON.stringify(originalPayload);
    const signature = generateSignature(originalPayloadString);

    // Modify the payload
    const tamperedPayload = { id: 123, action: "delete" };
    const tamperedPayloadString = JSON.stringify(tamperedPayload);

    // Verification should fail with the original signature
    expect(verifySignature(tamperedPayloadString, signature)).toBe(false);
  });
});
