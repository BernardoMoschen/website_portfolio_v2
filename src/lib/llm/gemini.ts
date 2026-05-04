import type { ChatMessage, Chunk } from './types';
import { GoogleGenAI, Type, type FunctionDeclaration } from '@google/genai';

interface StreamArgs {
    messages: ChatMessage[];
    system: string;
}

const FUNCTION_DECLARATIONS: FunctionDeclaration[] = [
    {
        name: 'highlightProject',
        description: 'Highlight a project in the gallery and scroll it into view.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                slug: {
                    type: Type.STRING,
                    enum: ['portfolio', 'telecom-backoffice', 'edtech-platform', 'mining-data-platform'],
                    description: 'The slug of the project to highlight.',
                },
            },
            required: ['slug'],
        },
    },
    {
        name: 'scrollToSection',
        description: 'Scroll to a top-level section of the page.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                id: {
                    type: Type.STRING,
                    enum: ['about', 'projects', 'technical', 'certifications', 'contact'],
                    description: 'The section identifier.',
                },
            },
            required: ['id'],
        },
    },
];

export async function* streamGemini({ messages, system }: StreamArgs): AsyncGenerator<Chunk> {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        yield { type: 'delta', text: 'Concierge unavailable: GOOGLE_AI_API_KEY not set.' };
        return;
    }

    const ai = new GoogleGenAI({ apiKey });

    const contents = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
    }));

    const stream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash-lite',
        contents,
        config: {
            systemInstruction: system,
            tools: [{ functionDeclarations: FUNCTION_DECLARATIONS }],
        },
    });

    for await (const chunk of stream) {
        const text = chunk.text;
        if (text) yield { type: 'delta', text };

        const calls = chunk.functionCalls;
        if (calls && calls.length) {
            for (const call of calls) {
                if (!call.name) continue;
                yield {
                    type: 'tool',
                    name: call.name,
                    args: (call.args ?? {}) as Record<string, unknown>,
                };
            }
        }
    }
}
