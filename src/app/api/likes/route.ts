import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { kv } from '@vercel/kv';

const LIKES_KEY = 'likes:total';
const IP_TTL_SECONDS = 60 * 60 * 24; // 24 hours

function getIpKey(req: NextRequest): string | null {
  const raw =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip');

  if (!raw) return null;

  const hash = createHash('sha256').update(raw).digest('hex').slice(0, 16);
  return `likes:ip:${hash}`;
}

export async function GET() {
  try {
    const count = (await kv.get<number>(LIKES_KEY)) ?? 0;
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

export async function POST(req: NextRequest) {
  const ipKey = getIpKey(req);

  // Reject requests where no client IP can be determined so the rate-limit
  // guarantee holds even in environments that don't set proxy headers.
  if (!ipKey) {
    return NextResponse.json({ error: 'Unable to identify client' }, { status: 400 });
  }

  try {
    // Atomic SET NX: returns 'OK' if key was created, null if already existed
    const wasSet = await kv.set(ipKey, 1, { ex: IP_TTL_SECONDS, nx: true });
    if (wasSet === null) {
      const count = (await kv.get<number>(LIKES_KEY)) ?? 0;
      return NextResponse.json({ count, alreadyLiked: true }, { status: 409 });
    }

    const count = await kv.incr(LIKES_KEY);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}
