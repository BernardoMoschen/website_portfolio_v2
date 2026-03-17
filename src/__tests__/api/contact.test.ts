/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

// Must be hoisted before the route import
jest.mock('resend', () => ({
    Resend: jest.fn().mockImplementation(() => ({
        emails: {
            send: jest.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
        },
    })),
}));

jest.mock('@/config/site', () => ({
    __esModule: true,
    default: { domain: 'example.com', email: 'owner@example.com' },
}));

// Import after mocks are in place
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { POST } = require('@/app/api/contact/route');

const validBody = {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Hello',
    message: 'This is a test message.',
};

function makeRequest(body: object, ip = '1.2.3.4') {
    return new NextRequest('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
        body: JSON.stringify(body),
    });
}

beforeEach(() => {
    jest.resetModules();
});

describe('POST /api/contact', () => {
    test('returns 200 for a valid submission', async () => {
        const res = await POST(makeRequest(validBody, '10.0.0.1'));
        const json = await res.json();
        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
    });

    test('returns 400 when required fields are missing', async () => {
        const res = await POST(makeRequest({ name: 'Jane', email: 'jane@example.com' }, '10.0.0.2'));
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.error).toMatch(/required/i);
    });

    test('returns 400 for an invalid email format', async () => {
        const res = await POST(makeRequest({ ...validBody, email: 'not-an-email' }, '10.0.0.3'));
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.error).toMatch(/email/i);
    });

    test('returns 400 when a field exceeds max length', async () => {
        const res = await POST(makeRequest({ ...validBody, name: 'x'.repeat(101) }, '10.0.0.4'));
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.error).toMatch(/length/i);
    });

    test('silently succeeds (honeypot) when website field is present', async () => {
        const res = await POST(makeRequest({ ...validBody, website: 'http://bot.com' }, '10.0.0.5'));
        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.success).toBe(true);
    });

    test('returns 429 after exceeding the rate limit', async () => {
        const ip = '10.0.0.99';
        // exhaust the 3-request window
        await POST(makeRequest(validBody, ip));
        await POST(makeRequest(validBody, ip));
        await POST(makeRequest(validBody, ip));
        const res = await POST(makeRequest(validBody, ip));
        expect(res.status).toBe(429);
    });
});
