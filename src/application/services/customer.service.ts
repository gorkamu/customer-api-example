import {CustomerRepository} from "../../infrastructure/persistence/customer.repository.impl";
import {Customer} from "../../domain/entities/customer.entity";
import {IdVo} from "../../domain/value-objects/id.vo";
import {CustomError} from "../../shared/errors/custom.error";
import {StatusCodes} from "http-status-codes";
import {CriteriaType, CustomerProps} from "../../shared/types";
import {ICustomer} from "../../shared/interfaces";

export class CustomerService {
    /**
     * @param repository CustomerRepository
     */
    constructor(private repository: CustomerRepository) {}

    /**
     * @param id
     * @param name string
     * @param email string
     * @param phone string\undefined
     * @returns Promise<Customer>
     */
    async create({ name, email, phone }: CustomerProps): Promise<ICustomer> {
        const customer = Customer.create({ name, email, phone });

        // TODO: improve this validation to avoid multiple queries
        // TODO: ->findOneBy({ email, phone })
        const [emailExists, phoneExists] = await Promise.all([
            this.repository.findByEmail(customer.email.value),
            this.repository.findByPhone(customer?.phone?.value)
        ]);

        if (emailExists || phoneExists) {
            throw new CustomError('Customer already exists', StatusCodes.CONFLICT);
        }

        return await this.repository.add(customer.toPrimitives());
    }

    /**
     * @returns Promise<ICustomer | null>
     * @param _id
     */
    async getCustomerById(_id: string): Promise<ICustomer | null> {
        if (!_id) {
            return null;
        }

        const id = new IdVo(_id).toString();

        return await this.repository.findById(id);
    }

    /**
     * @returns Promise<|Customer[]>
     */
    async findAll(criteria: CriteriaType): Promise<ICustomer[]> {
        const { filter, sort, pagination } = criteria;
        return await this.repository.findAll(filter, sort, pagination) as ICustomer[];
    }

    /**
     * @param id string
     * @param name string
     * @param email string
     * @param phone string\undefined
     * @returns Promise<ICustomer>
     */
    async update({ id, name, email, phone }: CustomerProps): Promise<ICustomer|null> {
        const customer = Customer.create({id, name, email, phone });
        return await this.repository.findOneAndUpdate(customer);
    }

    /**
     * @param _id string
     * @returns Promise<any>
     */
    async delete(_id: string): Promise<ICustomer|null> {
        const id = new IdVo(_id).toString();
        const customerExists = await this.repository.findById(id);

        return customerExists ? await this.repository.deleteOne(id) : null;
    }

    /**
     * @param _id string
     * @param amount string
     * @returns Promise<ICustomer|null>
     */
    async addCreditEntry(_id: string, amount: string): Promise<ICustomer|null> {
        const id = new IdVo(_id).toString();
        const customer = await this.repository.findById(id);
        if (!customer) {
            return null;
        }

        return await this.repository.addCreditEntry(id, amount);
    }
}
