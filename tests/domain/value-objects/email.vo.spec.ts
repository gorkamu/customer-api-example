import { EmailVo } from '../../../src/domain/value-objects/email.vo';
import { BadRequestError } from '../../../src/domain/errors/bad-request.error';

describe('EmailVo', () => {
    it('should create a valid EmailVo', () => {
        const email = 'test@example.com';
        const emailVo = new EmailVo(email);

        expect(emailVo.value).toBe(email);
    });

    it('should throw BadRequestError if email is empty', () => {
        expect(() => new EmailVo('')).toThrow(BadRequestError);
    });

    it('should throw BadRequestError if email is invalid', () => {
        const invalidEmail = 'invalid-email';
        expect(() => new EmailVo(invalidEmail)).toThrow(BadRequestError);
    });

    it('should throw BadRequestError if email is null or undefined', () => {
        expect(() => new EmailVo(undefined)).toThrow(BadRequestError);
        expect(() => new EmailVo(null as any)).toThrow(BadRequestError);
    });
});
