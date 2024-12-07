import {IdVo} from "../../../src/domain/value-objects/id.vo";
import {BadRequestError} from "../../../src/domain/errors/bad-request.error";

describe('IdVo', () => {
    it('creates an IdVo with a valid id', () => {
        const id = '507f1f77bcf86cd799439011';
        const idVo = new IdVo(id);

        expect(idVo.value).toBe(id);
    });

    it('creates an IdVo with a generated id when no id is provided', () => {
        const idVo = new IdVo();

        expect(idVo.value).toHaveLength(24);
    });

    it('throws an error when id length is greater than 24', () => {
        const invalidId = '507f1f77bcf86cd7994390111234';

        expect(() => new IdVo(invalidId)).toThrow(BadRequestError);
    });

    it('creates an IdVo with a valid id of length 24', () => {
        const validId = '507f1f77bcf86cd799439011';
        const idVo = new IdVo(validId);

        expect(idVo.value).toBe(validId);
    });
});
