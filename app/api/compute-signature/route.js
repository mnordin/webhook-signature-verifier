import { NextResponse } from 'next/server';
import { generateSignature } from '../../../lib/signature';

export async function POST(request) {
  try {
    // Get the request body
    const rawBody = await request.text();
    let payload;

    try {
      // Try to parse as JSON if possible
      payload = JSON.parse(rawBody);
    } catch (error) {
      // If not valid JSON, use the raw text
      payload = rawBody;
    }

    // Generate signature
    const signature = generateSignature(payload);

    // Return the signature
    return NextResponse.json({
      signature,
      payload: typeof payload === 'string' ? payload : JSON.stringify(payload)
    });
  } catch (error) {
    console.error('Error computing signature:', error);
    return NextResponse.json({ error: 'Failed to compute signature' }, { status: 500 });
  }
}
