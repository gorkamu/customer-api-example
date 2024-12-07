import {IdVo} from "../../domain/value-objects/id.vo";
import {StringVo} from "../../domain/value-objects/string.vo";
import {EmailVo} from "../../domain/value-objects/email.vo";
import {PhoneVo} from "../../domain/value-objects/phone.vo";
import {DateVo} from "../../domain/value-objects/date.vo";

export interface ICustomerPrimitive {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    createdAt?: string;
    totalCreditAmount?: string;
    creditEntries?: { date: string, amount: string }[];
}

export interface ICustomer {
    id?: IdVo | undefined;
    name: StringVo;
    email: EmailVo;
    phone?: PhoneVo;
    createdAt?: DateVo;
    toPrimitives(): ICustomerPrimitive;
}

export interface IRepository<T, G> {
    findAll(filter?: any, sort?: any, paginate?: any): Promise<(T | G)[]>;
    findById(id: string): Promise<T | G | null>;
    add(item: G): Promise<T | G>;
    findOneAndUpdate(item: T): Promise<T|null>;
    deleteOne(id: string): Promise<T|null>;
}
