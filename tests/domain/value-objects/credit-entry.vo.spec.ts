import {CreditEntryVo} from "../../../src/domain/value-objects/credit-entry.vo";

describe('CreditEntryVo', () => {
    it('creates a CreditEntryVo with valid date and amount', () => {
        const date = new Date();
        const amount = '100.00';
        const creditEntry = new CreditEntryVo(date, amount);

        expect(creditEntry.value.date).toBe(date);
        expect(creditEntry.value.amount).toBe(amount);
    });

    it('formats amount correctly with comma', () => {
        const formattedAmount = CreditEntryVo.formatAmount('1234,5678');
        expect(formattedAmount).toBe('1234,56');
    });

    it('formats amount correctly without comma', () => {
        const formattedAmount = CreditEntryVo.formatAmount('1234');
        expect(formattedAmount).toBe('1234');
    });

    it('converts to primitives correctly', () => {
        const date = new Date();
        const amount = '100.00';
        const creditEntry = new CreditEntryVo(date, amount);
        const primitives = creditEntry.toPrimitives();

        expect(primitives.date).toBe(date.toISOString());
        expect(primitives.amount).toBe(amount);
    });

    it('uses default amount when amount is not provided', () => {
        const date = new Date();
        const creditEntry = new CreditEntryVo(date, CreditEntryVo.DEFAULT_AMOUNT);

        expect(creditEntry.value.amount).toBe(CreditEntryVo.DEFAULT_AMOUNT);
    });
});
