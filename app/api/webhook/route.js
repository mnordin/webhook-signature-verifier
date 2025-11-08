import { NextResponse } from "next/server";
import { verifySignature, logWebhookDetails } from "../../../lib/signature";
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

  // Return appropriate response based on signature validation
  if (!isValid) {
    return new NextResponse("Invalid signature", {
      status: 401,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  // Return success response
  return new NextResponse("Webhook received successfully", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
