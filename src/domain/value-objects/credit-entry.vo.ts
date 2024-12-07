import {ValueObject} from "../../shared/value-objects/base.vo";

export class CreditEntryVo extends ValueObject<{
    date: Date,
    amount: string,
}>{
    /** @var string */
    static readonly DEFAULT_AMOUNT = '0.00';

    constructor(
        date: Date,
        amount: string,
    ) {
        super({ date, amount })
    }

    /**
     * @param input string
     * @returns string
     */
    static formatAmount(input: string): string {
        const commaPosition = input.indexOf(',');
        if (commaPosition === -1) {
            return input;
        }

        const intPart = input.slice(0, commaPosition);
        const floatPart = input.slice(commaPosition + 1);
        const truncatedPart = floatPart.slice(0, 2);

        return `${intPart},${truncatedPart}`;
    }

    /**
     * @returns { date: string, amount: string }
     */
    public toPrimitives(): { date: string, amount: string } {
        return {
            date: this.value.date.toISOString(),
            amount: this.value.amount,
        }
    }
}
