import { PhoneVo } from '../../../src/domain/value-objects/phone.vo';
import { BadRequestError } from '../../../src/domain/errors/bad-request.error';

describe('PhoneVo', () => {
    it('should create a valid PhoneVo', () => {
        const phone = '+123-456-7890';
        const phoneVo = new PhoneVo(phone);

        expect(phoneVo.value).toBe(phone);
    });

    it('should throw BadRequestError if phone is invalid', () => {
        const invalidPhone = 'invalid-phone';
        expect(() => new PhoneVo(invalidPhone)).toThrow(BadRequestError);
    });
});
