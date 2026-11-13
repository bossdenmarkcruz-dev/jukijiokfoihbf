import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // TODO: Integrate with a real GCash payment gateway webhook provider.
  // 1. Validate signature from the provider.
  // 2. Parse payment details and reference numbers.
  // 3. Match a pending payment_verification or create a transaction.
  // 4. Call add_credits automatically for verified payments.

  return NextResponse.json(
    { message: 'GCash webhook integration is not active yet.' },
    { status: 501 }
  );
}
