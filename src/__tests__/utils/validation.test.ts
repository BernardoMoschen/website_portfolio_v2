import { EMAIL_REGEX } from '@/utils/validation';
import { FIELD_MAX_LENGTHS, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW } from '@/config/api';

describe('EMAIL_REGEX', () => {
    const valid = [
        'user@example.com',
        'user.name+tag@domain.co.uk',
        'user123@sub.domain.org',
        'a@b.io',
    ];

    const invalid = [
        '',
        'notanemail',
        '@missinglocal.com',
        'missingat.com',
        'missing@domain',
        'spaces in@email.com',
        'double@@at.com',
    ];

    test.each(valid)('accepts valid email: %s', (email) => {
        expect(EMAIL_REGEX.test(email)).toBe(true);
    });

    test.each(invalid)('rejects invalid email: %s', (email) => {
        expect(EMAIL_REGEX.test(email)).toBe(false);
    });
});

describe('FIELD_MAX_LENGTHS', () => {
    test('name limit is 100', () => expect(FIELD_MAX_LENGTHS.name).toBe(100));
    test('email limit is 254', () => expect(FIELD_MAX_LENGTHS.email).toBe(254));
    test('subject limit is 200', () => expect(FIELD_MAX_LENGTHS.subject).toBe(200));
    test('message limit is 5000', () => expect(FIELD_MAX_LENGTHS.message).toBe(5000));
});

describe('RATE_LIMIT constants', () => {
    test('window is 60 seconds', () => expect(RATE_LIMIT_WINDOW).toBe(60_000));
    test('max requests is 3', () => expect(RATE_LIMIT_MAX).toBe(3));
});
