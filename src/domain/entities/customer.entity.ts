import {Entity} from "../../shared/entities/base.entity";
import {StringVo} from "../value-objects/string.vo";
import {EmailVo} from "../value-objects/email.vo";
import {PhoneVo} from "../value-objects/phone.vo";
import {IdVo} from "../value-objects/id.vo";
import {DateVo} from "../value-objects/date.vo";
import {ICustomer, ICustomerPrimitive} from "../../shared/interfaces";
import {CustomerProps} from "../../shared/types";
import {CreditEntryVo} from "../value-objects/credit-entry.vo";

export class Customer extends Entity implements ICustomer {
    /**
     * @param id IdVo | null
     * @param name StringVo
     * @param email EmailVo
     * @param phone PhoneVo
     * @param createdAt DateVo
     * @param totalCreditAmount StringVo
     * @param creditEntries CreditEntryVo[]
     * @param id IdVo | undefined
     */
    constructor(
        public name: StringVo,
        public email: EmailVo,
        public phone?: PhoneVo,
        public createdAt?: DateVo,
        public totalCreditAmount?: StringVo,
        public creditEntries?: CreditEntryVo[],
        public id: IdVo | undefined = undefined,
    ) {
        super();
        if (id) {
            this.id = id;
        }

        this.name = name;
        this.email = email;
        this.phone = phone;
        this.createdAt = Object.freeze(createdAt ?? {value: new Date()});
        this.totalCreditAmount = totalCreditAmount ?? new StringVo(CreditEntryVo.DEFAULT_AMOUNT);
        this.creditEntries = creditEntries || [];
    }

    /**
     * @param id string | undefined
     * @param name string | undefined
     * @param email string | undefined
     * @param phone string | undefined
     * @param createdAt string | undefined
     * @param totalCreditAmount
     * @param creditEntries
     */
    static create({id, name, email, phone, createdAt, totalCreditAmount: _totalCreditAmount, creditEntries: _creditEntries}: CustomerProps): ICustomer {
        const creditEntries = _creditEntries?.map((entry:any) => new CreditEntryVo(entry.date, entry.amount)) || [];
        const totalCreditAmount = new StringVo(_totalCreditAmount ?? CreditEntryVo.DEFAULT_AMOUNT);

        return new Customer(
            new StringVo(name),
            new EmailVo(email),
            new PhoneVo(phone),
            new DateVo(createdAt),
            totalCreditAmount,
            creditEntries,
            id ? new IdVo(id) : undefined,
        );
    }

    /**
     * @returns ICustomerPrimitive
     */
    public toPrimitives(): ICustomerPrimitive {
        return {
            id: this.id?.value,
            name: this.name?.value,
            email: this.email?.value,
            phone: this.phone?.value,
            createdAt: this.createdAt?.value.toString(),
            totalCreditAmount: this.totalCreditAmount?.value,
            creditEntries: this.creditEntries?.map((entry: any) => entry.toPrimitives()) || [],
        };
    }

    /**
     * @param from
     * @param _c
     */
    static createFromJson<T>(from: object, _c = Customer as T): T {
        // @ts-ignore
        return _c.create(from) as T
    }
}
