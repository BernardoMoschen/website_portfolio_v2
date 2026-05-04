export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export type Chunk =
    | { type: 'delta'; text: string }
    | { type: 'tool'; name: string; args: Record<string, unknown> };
