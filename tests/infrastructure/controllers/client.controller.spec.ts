import { CustomerController } from '../../../src/infrastructure/controllers/customer.controller';
import { CustomerService } from '../../../src/application/services/customer.service';
import { Request } from 'express';
import { NotFoundError } from '../../../src/application/errors/not-found.error';
import { CustomerRepository } from '../../../src/infrastructure/persistence/customer.repository.impl';
// @ts-ignore
import { CustomerMother } from '../../domain/entities/customer-mother.entity';
import { IdVo } from '../../../src/domain/value-objects/id.vo';
import { MongoClient } from 'mongodb';
import Database from '../../../src/infrastructure/database/database';

jest.mock('../../../src/application/services/customer.service');
jest.mock('../../../src/infrastructure/database/database');
jest.mock('mongodb', () => {
    const mMongoClient = {
        connect: jest.fn(),
        close: jest.fn(),
        db: jest.fn().mockReturnValue({
            collection: jest.fn().mockReturnValue({
                insertOne: jest.fn(),
                find: jest.fn().mockReturnThis(),
                toArray: jest.fn(),
                findOne: jest.fn(),
                findOneAndUpdate: jest.fn(),
                findOneAndDelete: jest.fn()
            }),
            databaseName: 'test',
            options: {},
            readConcern: {},
            readPreference: {},
            writeConcern: {},
        })
    };
    const mObjectId = jest.fn().mockImplementation(() => ({
        toString: jest.fn().mockReturnValue('mockedObjectId')
    }));
    return { MongoClient: jest.fn(() => mMongoClient), ObjectId: mObjectId };
});

describe('CustomerController', () => {
    let customerController: CustomerController;
    let customerService: jest.Mocked<CustomerService>;
    let dbClient: jest.Mocked<MongoClient>;

    beforeAll(async () => {
        const database = new Database();
        dbClient = await database.connect() as jest.Mocked<MongoClient>;
    });

    beforeEach(() => {
        const repository = new CustomerRepository(dbClient);
        customerService = new CustomerService(repository) as jest.Mocked<CustomerService>;
        customerController = new CustomerController(customerService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new customer', async () => {
        const customer = CustomerMother.create();
        customerService.create.mockResolvedValue(customer);

        const req = { body: customer.toPrimitives() } as Request;
        const result = await customerController.create(req);

        expect(result).toEqual(customer.toPrimitives());
    });

    it('should get a customer by id', async () => {
        const customer = CustomerMother.create();
        customerService.getCustomerById.mockResolvedValue(customer);

        const req = { params: { id: customer?.id?.value } } as unknown as Request;
        const result = await customerController.getCustomer(req);

        expect(customerService.getCustomerById).toHaveBeenCalledWith(customer?.id?.value);
        expect(result).toEqual(customer.toPrimitives());
    });

    it('should get all customer', async () => {
        const req = {} as Request;
        const customers = [
            CustomerMother.create(),
            CustomerMother.create()
        ];

        const sorted = customers.sort((a: any, b: any) => a.createdAt.value - b.createdAt.value);
        customerService.findAll.mockResolvedValue(sorted);

        const result = await customerController.find(req);
        const controllerResponse = {
            "data": sorted.map(customer => customer.toPrimitives()),
            "pagination": {
                "limit": 100,
                "page": 1
            }
        }

        expect(customerService.findAll).toHaveBeenCalled();
        expect(result).toEqual(controllerResponse);
    });

    it('should update a customer', async () => {
        const customer = CustomerMother.create();
        customerService.update.mockResolvedValue(customer);

        const req = {
            params: {id: customer?.id?.value},
            body: {name: customer.name.value, email: customer.email.value, phone: customer?.phone?.value}
        } as unknown as Request;
        const result = await customerController.update(req);

        expect(result).toEqual(customer.toPrimitives());
    });

    it('should delete a customer', async () => {
        const id = new IdVo();
        const req = { params: { id } } as unknown as Request;
        const customer = CustomerMother.create();
        customerService.delete.mockResolvedValue(customer);

        const result = await customerController.delete(req);

        expect(customerService.delete).toHaveBeenCalledWith(id);
        expect(result).toStrictEqual(customer.toPrimitives());
    });

    it('should throw NotFoundError when deleting a non-existent customer', async () => {
        const id = new IdVo();
        const req = { params: { id } } as unknown as Request;
        customerService.delete.mockRejectedValue(new NotFoundError(`Customer with id: ${id.value} not found`));

        await expect(customerController.delete(req)).rejects.toThrow(NotFoundError);
        expect(customerService.delete).toHaveBeenCalledWith(id);
    });
});
