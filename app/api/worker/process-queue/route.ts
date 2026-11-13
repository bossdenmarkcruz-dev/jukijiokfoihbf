import { NextRequest, NextResponse } from 'next/server';
import { processBoostOrder } from '@/lib/external/boostWorker';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const expectedKey = process.env.WORKER_API_KEY;

  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    message: 'Worker is not active yet. Queue processing is stubbed for future bot integration.',
    processed: 0
  });
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const expectedKey = process.env.WORKER_API_KEY;

  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const orderId = body.orderId as string | undefined;

  if (!orderId) {
    return NextResponse.json({ message: 'Missing orderId' }, { status: 400 });
  }

  await processBoostOrder(orderId);

  return NextResponse.json({ message: 'Queue task processed' });
}
