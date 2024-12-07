import {ValueObject} from "../../shared/value-objects/base.vo";

export class DateVo extends ValueObject<Date> {
    constructor(value?: Date) {
        if (value) {
            super(value);
        } else {
            super(new Date());
        }
    }
}
