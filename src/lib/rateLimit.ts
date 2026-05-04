import { kv } from '@vercel/kv';

const memoryStore = new Map<string, number[]>();

const usingKv = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

interface CheckArgs {
    ip: string;
    bucket: string;
    limit: number;
    windowSeconds: number;
}

interface CheckResult {
    ok: boolean;
    remaining: number;
}

const memoryCheck = ({ ip, bucket, limit, windowSeconds }: CheckArgs): CheckResult => {
    const now = Date.now();
    const cutoff = now - windowSeconds * 1000;
    const key = `${bucket}:${ip}`;
    const prev = memoryStore.get(key) ?? [];
    const recent = prev.filter((t) => t > cutoff);
    if (recent.length >= limit) {
        memoryStore.set(key, recent);
        return { ok: false, remaining: 0 };
    }
    recent.push(now);
    memoryStore.set(key, recent);
    return { ok: true, remaining: Math.max(0, limit - recent.length) };
};

export async function rateLimit(args: CheckArgs): Promise<CheckResult> {
    const { ip, bucket, limit, windowSeconds } = args;

    if (!usingKv) return memoryCheck(args);

    const now = Date.now();
    const cutoff = now - windowSeconds * 1000;
    const key = `ratelimit:${bucket}:${ip}`;

    try {
        const prev = (await kv.get<number[]>(key)) ?? [];
        const recent = prev.filter((t) => t > cutoff);
        if (recent.length >= limit) return { ok: false, remaining: 0 };
        recent.push(now);
        await kv.set(key, recent, { ex: windowSeconds });
        return { ok: true, remaining: Math.max(0, limit - recent.length) };
    } catch {
        return memoryCheck(args);
    }
}
