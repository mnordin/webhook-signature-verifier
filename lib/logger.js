/**
 * Logger utilities for webhook debugging
 */

// ANSI color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

// Important headers to include in logs
const IMPORTANT_HEADERS = [
  "content-type",
  "content-length",
  "user-agent",
  "origin",
  "referer",
  "x-signature",
];

/**
 * Logs detailed debugging information about a webhook request
 * @param {Object} details - Details about the webhook
 * @param {Object|string} details.payload - The payload received
 * @param {string} details.signature - The signature received
 * @param {boolean} details.isValid - Whether the signature is valid
 * @param {Object} [details.headers] - Optional request headers
 */
export function logWebhookDetails({ payload, signature, isValid, headers }) {
  const filteredHeaders = {};
  if (headers) {
    IMPORTANT_HEADERS.forEach((key) => {
      if (headers[key]) {
        filteredHeaders[key] = headers[key];
      }
    });
  }

  // Format the payload (inline if small, pretty-print if large)
  const payloadStr =
    typeof payload === "string" ? payload : JSON.stringify(payload);
  const isLargePayload = payloadStr.length > 200;
  const formattedPayload = isLargePayload
    ? `${payloadStr.substring(0, 197)}...`
    : payloadStr;

  // Build the log output
  console.log(
    `\n${colors.cyan}${"=".repeat(60)}${colors.reset}`,
  );
  console.log(
    `${colors.bright}${colors.blue}📨 Webhook Details${colors.reset}`,
  );
  console.log(
    `${colors.cyan}${"=".repeat(60)}${colors.reset}`,
  );

  console.log(
    `${colors.dim}Timestamp:${colors.reset} ${new Date().toISOString()}`,
  );
  console.log(
    `${colors.dim}Signature:${colors.reset} ${signature ? signature.substring(0, 16) + "..." : colors.red + "(missing)" + colors.reset}`,
  );
  console.log(
    `${colors.dim}Valid:${colors.reset} ${isValid ? colors.green + "✓ Yes" + colors.reset : colors.red + "✗ No" + colors.reset}`,
  );

  if (Object.keys(filteredHeaders).length > 0) {
    console.log(`\n${colors.bright}Headers:${colors.reset}`);
    Object.entries(filteredHeaders).forEach(([key, value]) => {
      console.log(`  ${colors.yellow}${key}:${colors.reset} ${value}`);
    });
  }

  console.log(`\n${colors.bright}Payload:${colors.reset}`);
  if (isLargePayload) {
    console.log(`  ${colors.dim}(truncated, length: ${payloadStr.length})${colors.reset}`);
    console.log(`  ${formattedPayload}`);
  } else {
    console.log(
      JSON.stringify(payload, null, 2)
        .split("\n")
        .map((line) => `  ${line}`)
        .join("\n"),
    );
  }

  console.log(
    `${colors.cyan}${"=".repeat(60)}${colors.reset}\n`,
  );
}
