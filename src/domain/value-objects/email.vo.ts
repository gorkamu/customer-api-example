import {ValueObject} from "../../shared/value-objects/base.vo";
import {BadRequestError} from "../errors/bad-request.error";

export class EmailVo extends ValueObject<string> {
    constructor(value?: string) {
        if (!value) {
            throw new BadRequestError('The value cannot be empty');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            throw new BadRequestError('The value is not a valid email');
        }

        super(value);
    }
}
