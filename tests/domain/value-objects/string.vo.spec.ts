import { StringVo } from '../../../src/domain/value-objects/string.vo';

describe('StringVo', () => {
    it('should create a valid StringVo', () => {
        const value = 'valid string';
        const stringVo = new StringVo(value);

        expect(stringVo.value).toBe(value);
    });
});
