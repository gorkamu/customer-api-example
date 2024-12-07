export abstract class ValueObject<T> {
    readonly value: T;

    protected constructor(value: T) {
        this.value = Object.freeze(value);
    }

    toString(): string {
        return (this.value as string).toString();
    }
}
