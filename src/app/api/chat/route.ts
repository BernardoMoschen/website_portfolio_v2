import { NextRequest } from 'next/server';
import { streamChat } from '../../../lib/llm';
import type { ChatMessage } from '../../../lib/llm';
import { rateLimit } from '../../../lib/rateLimit';

export const runtime = 'edge';

interface ChatBody {
    messages?: Array<{ role?: string; content?: string }>;
    locale?: string;
    mode?: string;
}

const MAX_MESSAGE_LEN = 1500;
const MAX_HISTORY = 10;
const RATE_LIMIT = 10;
const RATE_WINDOW_SECONDS = 60 * 60;

function getIp(req: NextRequest): string {
    const xff = req.headers.get('x-forwarded-for')?.split(',')[0].trim();
    const xri = req.headers.get('x-real-ip');
    return xff || xri || 'unknown';
}

const encoder = new TextEncoder();

function sseLine(event: string | null, data: unknown): Uint8Array {
    const body = typeof data === 'string' ? data : JSON.stringify(data);
    const head = event ? `event: ${event}\n` : '';
    return encoder.encode(`${head}data: ${body}\n\n`);
}

export async function POST(req: NextRequest) {
    let raw: ChatBody;
    try {
        raw = (await req.json()) as ChatBody;
    } catch {
        return new Response(JSON.stringify({ error: 'invalid_json' }), {
            status: 400,
            headers: { 'content-type': 'application/json' },
        });
    }

    if (!Array.isArray(raw.messages) || raw.messages.length === 0) {
        return new Response(JSON.stringify({ error: 'messages_required' }), {
            status: 400,
            headers: { 'content-type': 'application/json' },
        });
    }

    const messages: ChatMessage[] = raw.messages.slice(-MAX_HISTORY).map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m.content ?? '').slice(0, MAX_MESSAGE_LEN),
    }));

    const locale: 'en' | 'pt-br' = raw.locale === 'pt-br' ? 'pt-br' : 'en';
    const mode: 'text' | 'voice' = raw.mode === 'voice' ? 'voice' : 'text';

    const ip = getIp(req);
    const limit = await rateLimit({
        ip,
        bucket: 'chat',
        limit: RATE_LIMIT,
        windowSeconds: RATE_WINDOW_SECONDS,
    });

    if (!limit.ok) {
        return new Response(JSON.stringify({ error: 'rate_limited' }), {
            status: 429,
            headers: { 'content-type': 'application/json' },
        });
    }

    const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
            try {
                for await (const chunk of streamChat({ messages, locale, mode })) {
                    if (chunk.type === 'delta') {
                        controller.enqueue(sseLine(null, { delta: chunk.text }));
                    } else if (chunk.type === 'tool') {
                        controller.enqueue(
                            sseLine('tool', { name: chunk.name, args: chunk.args }),
                        );
                    }
                }
                controller.enqueue(sseLine(null, '[DONE]'));
            } catch {
                controller.enqueue(sseLine('error', { message: 'stream_error' }));
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            'content-type': 'text/event-stream; charset=utf-8',
            'cache-control': 'no-cache, no-transform',
            connection: 'keep-alive',
            'x-accel-buffering': 'no',
        },
    });
}
