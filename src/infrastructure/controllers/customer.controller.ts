import { Request } from 'express';
import {CustomerService} from "../../application/services/customer.service";
import {NotFoundError} from "../../application/errors/not-found.error";
import {ICustomerPrimitive} from "../../shared/interfaces";
import Criteria from "../database/criteria";
import {PaginationType} from "../../shared/types";


export class CustomerController {
    /**
     * @param service CustomerService
     */
    constructor(
        private service: CustomerService
    ) {}

    /**
     * @param req Request
     * @returns Promise<string>
     */
    async create(req: Request): Promise<ICustomerPrimitive> {
        const { name, email, phone } = req.body;
        const item = await this.service.create({ name, email, phone });

        return item.toPrimitives();
    }

    /**
     * @param req Request
     * @returns Promise<Customer>
     */
    async getCustomer(req: Request): Promise<ICustomerPrimitive> {
        const { id } = req.params;
        const customer = await this.service.getCustomerById(id);
        if (!customer) {
            throw new NotFoundError(`Customer with id: ${ id.toString() } not found`);
        }

        return customer.toPrimitives();
    }

    /**
     * @param req Request
     * @returns Promise<Customer[]>
     */
    async find(req: Request): Promise<{ data: ICustomerPrimitive[], pagination: PaginationType }> {
        const criteria = Criteria.createFromQueryParams(req.query);
        const _data = await this.service.findAll(criteria);
        const data = _data?.map((customer) => customer.toPrimitives()) || [];
        const pagination = {
            limit: criteria?.pagination?.limit ?? Criteria.PAGINATION_MAX_LIMIT,
            page: criteria?.pagination?.page ?? Criteria.PAGINATION_DEFAULT_PAGE,
        } as PaginationType;

        return { data, pagination }
    }

    /**
     * @param req Request
     * @returns Promise<Customer>
     */
    async update(req: Request): Promise<ICustomerPrimitive> {
        const { id } = req.params;
        const { name, email, phone } = req.body;

        const customer = await this.service.update({ id, name, email, phone });
        if (!customer) {
            throw new NotFoundError(`Customer with id: ${ id.toString() } not found`);
        }

        return customer.toPrimitives();
    }

    /**
     * @param req Request
     * @returns Promise<boolean>
     */
    async delete(req: Request): Promise<ICustomerPrimitive> {
        const { id } = req.params;
        const result = await this.service.delete(id);
        if (!result) {
            throw new NotFoundError(`Customer with id: ${ id.toString() } not found`);
        }

        return result.toPrimitives();
    }

    /**
     * @param req Request
     * @returns Promise<ICustomerPrimitive>
     */
    async addCredit(req: Request): Promise<ICustomerPrimitive> {
        const { id } = req.params;
        const { amount } = req.body;

        const customer = await this.service.addCreditEntry(id, amount);
        if (!customer) {
            throw new NotFoundError(`Customer with id: ${ id.toString() } not found`);
        }

        return customer.toPrimitives();
    }
}
