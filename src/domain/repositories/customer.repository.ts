import {ICustomer, ICustomerPrimitive, IRepository} from "../../shared/interfaces";

export interface ICustomerRepository extends IRepository<ICustomer, ICustomerPrimitive> {
    findByEmail(email: string): Promise<ICustomer | null>;
    findByPhone(phone: string): Promise<ICustomer | null>;
}
