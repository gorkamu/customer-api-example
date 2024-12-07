import { ValueObject } from "../../shared/value-objects/base.vo";
import { ObjectId } from "mongodb";
import {BadRequestError} from "../errors/bad-request.error";

export class IdVo extends ValueObject<string> {
    constructor(value?: string) {
        if (!value) {
            value = new ObjectId().toString();
        }

        if (value.length > 24) {
            throw new BadRequestError('Invalid id length');
        }

        super(value);
    }
}
