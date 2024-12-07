import {ValueObject} from "../../shared/value-objects/base.vo";

export class StringVo extends ValueObject<string|undefined> {
    constructor(value?: string) {
        super(value);
    }
}
