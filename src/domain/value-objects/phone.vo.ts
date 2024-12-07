import {ValueObject} from "../../shared/value-objects/base.vo";
import {BadRequestError} from "../errors/bad-request.error";

export class PhoneVo extends ValueObject<string> {
    constructor(value?: string) {
        if (value) {
            const phoneRegex = /^(?:\+?\d{1,3})?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
            if (!phoneRegex.test(value)) {
                throw new BadRequestError(`The value "${value}" is not a valid phone number.`);
            }
            super(value);
        }
    }
}
