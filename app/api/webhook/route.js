import { NextResponse } from "next/server";
import { verifySignature, generateSignature } from "../../../lib/signature";
import { logWebhookDetails } from "../../../lib/logger";
import { SIGNATURE_HEADER_NAME } from "../../../lib/constants";

export async function POST(request) {
  // Get the raw request body as buffer
  const rawBody = await request.text();

  // Get the signature from headers
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);

  // Verify the signature
  const isValid = signature && verifySignature(rawBody, signature);

  // Parse the JSON body for logging purposes
  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch (error) {
    payload = { error: "Invalid JSON payload", rawBody };
  }

  // Log the webhook details for debugging
  logWebhookDetails({
    payload,
    signature: signature || "(missing)",
    isValid,
    headers: Object.fromEntries(request.headers.entries()),
  });

  // Generate the expected signature for comparison
  const expectedSignature = generateSignature(rawBody);

  // Return detailed JSON response based on signature validation
  if (!isValid) {
    return NextResponse.json(
      {
        isValid: false,
        signature: signature || null,
        expectedSignature,
        message: signature ? "Invalid signature" : "Missing signature header",
      },
      { status: 401 }
    );
  }

  // Return success response with details
  return NextResponse.json(
    {
      isValid: true,
      signature,
      expectedSignature,
      message: "Webhook received successfully",
    },
    { status: 200 }
  );
}
