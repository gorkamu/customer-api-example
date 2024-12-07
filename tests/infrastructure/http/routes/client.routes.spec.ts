import express from 'express';
import {CustomerService} from "../../../../src/application/services/customer.service";
import {CustomerController} from "../../../../src/infrastructure/controllers/customer.controller";
import {CustomerRepository} from "../../../../src/infrastructure/persistence/customer.repository.impl";
import {Customer} from "../../../../src/domain/entities/customer.entity";
import {NotFoundError} from "../../../../src/application/errors/not-found.error";
import customerRoutes from "../../../../src/infrastructure/http/routes/customer.routes";
import request from 'supertest';
// @ts-ignore
import {CustomerMother} from "../../../domain/entities/customer-mother.entity";
import Database from "../../../../src/infrastructure/database/database";
import {MongoClient} from "mongodb";

jest.mock('../../../../src/infrastructure/database/database');
jest.mock('../../../../src/application/services/customer.service');
jest.mock('../../../../src/infrastructure/persistence/customer.repository.impl');
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

const app = express();
app.use(express.json());
app.use('/api', customerRoutes);

// TODO: improve this later because something wrong is happening with the mocks here
describe.skip('Customer Routes', () => {
    let customerService: jest.Mocked<CustomerService>;
    let customerController: jest.Mocked<CustomerController>;
    let dbClient: jest.Mocked<MongoClient>;
    let repository: jest.Mocked<CustomerRepository>;

    beforeAll(async () => {
        const database = new Database();
        dbClient = await database.connect() as jest.Mocked<MongoClient>;
    });

    beforeEach(() => {
        repository = new CustomerRepository(dbClient) as jest.Mocked<CustomerRepository>;
        customerService = new CustomerService(repository) as jest.Mocked<CustomerService>;
        customerController = new CustomerController(customerService)  as jest.Mocked<CustomerController>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should get all customers', async () => {
        const customers = [
            CustomerMother.create(),
            CustomerMother.create(),
        ];
        customerService.findAll.mockResolvedValue(customers);

        const response = await request(app).get('/api/customers');

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(customers.map(customer => customer.toPrimitives()));
        expect(response.body.pagination).toEqual({ limit: 100, page: 1 });
    });

    it('should create a new customer', async () => {
        const customer = CustomerMother.create();
        customerService.create.mockResolvedValue(customer);

        const response = await request(app).post('/api/customers').send();

        expect(response.status).toBe(201);
        expect(response.body).toEqual(customer.toPrimitives());
    });

    it('should get a customer by id', async () => {
        const customer = Customer.create({ id: '1', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890' });
        customerService.getCustomerById.mockResolvedValue(customer);

        const response = await request(app).get('/api/customers/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(customer.toPrimitives());
    });

    it('should return 404 if customer not found by id', async () => {
        customerService.getCustomerById.mockResolvedValue(null);

        const response = await request(app).get('/api/customers/1');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Customer with id: 1 not found');
    });

    it('should update a customer', async () => {
        const customerData = { name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890' };
        const customer = Customer.create({ id: '1', ...customerData });
        customerService.update.mockResolvedValue(customer);

        const response = await request(app).put('/api/customers/1').send(customerData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(customer.toPrimitives());
    });

    it('should delete a customer', async () => {
        const customer = CustomerMother.create();
        customerService.delete.mockResolvedValue(customer);

        const response = await request(app).delete('/api/customers/1');

        expect(response.status).toBe(200);
        expect(response.body).toBe(true);
    });

    it('should return 404 when deleting a non-existent customer', async () => {
        customerService.delete.mockRejectedValue(new NotFoundError('Customer with id: 1 not found'));

        const response = await request(app).delete('/api/customers/1');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Customer with id: 1 not found');
    });
});
