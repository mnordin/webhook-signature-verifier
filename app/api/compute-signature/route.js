import { NextResponse } from 'next/server';
import { generateSignature } from '../../../lib/signature';

export async function POST(request) {
  try {
    // Get the raw request body as text - this is what will be signed
    const rawBody = await request.text();

    // Generate signature based on the raw body
    const signature = generateSignature(rawBody);

    // Return the signature
    return NextResponse.json({
      signature,
      payload: rawBody
    });
  } catch (error) {
    console.error('Error computing signature:', error);
    return NextResponse.json({ error: 'Failed to compute signature' }, { status: 500 });
  }
}
