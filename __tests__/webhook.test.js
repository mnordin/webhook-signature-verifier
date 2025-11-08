import { SHARED_SECRET, SIGNATURE_HEADER_NAME } from '../lib/constants';
import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { POST } from '../app/api/webhook/route';

// Mock the console.log to prevent test output noise
global.console = {
  ...console,
  log: jest.fn(),
};

// Helper function to create a Next.js request with headers and body
function createRequest(body, headers = {}) {
  return new NextRequest('http://localhost:3000/api/webhook', {
    method: 'POST',
    headers: headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

// Helper function to generate a valid signature
function generateSignature(payload) {
  const bodyString = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const hmac = crypto.createHmac('sha256', SHARED_SECRET);
  hmac.update(bodyString);
  return hmac.digest('hex');
}

describe('POST /api/webhook', () => {
  it('should respond with 200 for valid signature', async () => {
    const payload = { "test": "some data" };
    const payloadString = JSON.stringify(payload);
    const validSignature = generateSignature(payloadString);

    const request = createRequest(payloadString, {
      [SIGNATURE_HEADER_NAME]: validSignature
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    const responseText = await response.text();
    expect(responseText).toBe("Webhook received successfully");
  });

  it('should respond with 401 for invalid signature', async () => {
    const payload = { "test": "some data" };
    const payloadString = JSON.stringify(payload);

    const request = createRequest(payloadString, {
      [SIGNATURE_HEADER_NAME]: "invalidSignature"
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    const responseText = await response.text();
    expect(responseText).toBe("Invalid signature");
  });

  it('should respond with 401 when signature header is missing', async () => {
    const payload = { "test": "some data" };
    const payloadString = JSON.stringify(payload);

    const request = createRequest(payloadString);

    const response = await POST(request);

    expect(response.status).toBe(401);
    const responseText = await response.text();
    expect(responseText).toBe("Invalid signature");
  });
});
