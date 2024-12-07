import {StatusCodes} from "http-status-codes";
import {CustomError} from "../../shared/errors/custom.error";

export class BadRequestError extends CustomError {
    constructor(message: string) {
        super(message, StatusCodes.BAD_REQUEST);
    }
}
