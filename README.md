# Webhook Signature Verifier

A simple Next.js application for debugging webhook signatures. This tool verifies HMAC SHA-256 signatures on webhook payloads and displays the results.

## Features

- Verify webhook signatures using HMAC SHA-256
- Display request details and validation results
- Simple web interface for testing
- API endpoint for integration with external tools

## Getting Started

### Prerequisites

- Node.js (version 16 or later recommended)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/webhook-signature-verifier.git
   cd webhook-signature-verifier
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Web Interface

The web interface allows you to:
- Enter a JSON payload
- Send a test webhook to the API endpoint
- View the response and validation results

### API Endpoint

You can send webhooks directly to the API endpoint:

```bash
curl -X POST \
  http://localhost:3000/api/webhook \
  -H 'Content-Type: application/json' \
  -H 'X-Signature: [your-signature-here]' \
  -d '{"event":"test","data":{"id":123}}'
```

### Creating a Valid Signature

To create a valid signature, compute an HMAC with SHA-256 using the shared secret:

```javascript
const crypto = require('crypto');
const payload = JSON.stringify({event: "test", data: {id: 123}});
const hmac = crypto.createHmac('sha256', 'sharedSecretHere');
hmac.update(payload);
const signature = hmac.digest('hex');
console.log(signature);
```

## Configuration

You can modify the configuration in `lib/constants.js`:

- `SHARED_SECRET`: The secret key used for HMAC calculation
- `SIGNATURE_HEADER_NAME`: The header name used for the signature

## Testing

```bash
npm test
# or
yarn test
```

## License

ISC