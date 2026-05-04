import { buildSystemPrompt } from './systemPrompt';
import { streamMock } from './mock';
import { streamGemini } from './gemini';
import type { ChatMessage, Chunk } from './types';

export type { ChatMessage, Chunk } from './types';

interface StreamChatArgs {
    messages: ChatMessage[];
    locale: 'en' | 'pt-br';
    mode?: 'text' | 'voice';
}

export async function* streamChat({
    messages,
    locale,
    mode = 'text',
}: StreamChatArgs): AsyncGenerator<Chunk> {
    if (process.env.GOOGLE_AI_API_KEY) {
        const system = buildSystemPrompt({ locale, mode });
        yield* streamGemini({ messages, system });
        return;
    }
    yield* streamMock({ messages, locale });
}
