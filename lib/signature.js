import crypto from 'crypto';
import { SHARED_SECRET } from './constants';

/**
 * Verifies a webhook signature using HMAC SHA-256
 * @param {string|Buffer} payload - The raw payload to verify
 * @param {string} signature - The signature to compare against
 * @returns {boolean} - True if signature is valid, false otherwise
 */
export function verifySignature(payload, signature) {
  if (!payload || !signature) {
    return false;
  }

  const hmac = crypto.createHmac('sha256', SHARED_SECRET);
  hmac.update(typeof payload === 'string' ? payload : payload.toString());
  const expectedSignature = hmac.digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

/**
 * Generate a signature for a payload
 * @param {string|Object} payload - The payload to sign (string or object that will be JSON stringified)
 * @returns {string} - The generated signature
 */
export function generateSignature(payload) {
  const payloadStr = typeof payload === 'string'
    ? payload
    : JSON.stringify(payload);

  const hmac = crypto.createHmac('sha256', SHARED_SECRET);
  hmac.update(payloadStr);
  return hmac.digest('hex');
}

/**
 * Logs detailed debugging information about a webhook request
 * @param {Object} details - Details about the webhook
 * @param {Object|string} details.payload - The payload received
 * @param {string} details.signature - The signature received
 * @param {boolean} details.isValid - Whether the signature is valid
 * @param {Object} [details.headers] - Optional request headers
 */
export function logWebhookDetails({ payload, signature, isValid, headers }) {
  console.log('--- Webhook Details ---');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Signature received:', signature);
  console.log('Signature valid:', isValid);

  if (headers) {
    console.log('Headers:', JSON.stringify(headers, null, 2));
  }

  console.log('Payload:', typeof payload === 'string'
    ? payload
    : JSON.stringify(payload, null, 2)
  );
  console.log('------------------------');
}
