import {MongoClient, ObjectId} from 'mongodb';
import {IdVo} from "../../../src/domain/value-objects/id.vo";
// @ts-ignore
import {CustomerMother} from "../../domain/entities/customer-mother.entity";
import Database from "../../../src/infrastructure/database/database";
import {CustomerRepository} from "../../../src/infrastructure/persistence/customer.repository.impl";
import Criteria from "../../../src/infrastructure/database/criteria";
import {Request} from "express";
import {Customer} from "../../../src/domain/entities/customer.entity";

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

describe('CustomerRepository', () => {
    let dbClient: MongoClient;
    let customerRepository: CustomerRepository;
    let dbMock: any;

    beforeEach(() => {
        dbClient = new MongoClient('mongodb://localhost:27017');
        dbMock = {
            collection: jest.fn().mockReturnThis(),
            aggregate: jest.fn().mockReturnThis(),
            toArray: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
            insertOne: jest.fn()
        };
        dbClient.db = jest.fn().mockReturnValue(dbMock);
        customerRepository = new CustomerRepository(dbClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add a customer', async () => {
        const customer = CustomerMother.create();
        const customerPrimitives = customer.toPrimitives();
        dbMock.insertOne.mockResolvedValue({ insertedId: new ObjectId(customerPrimitives.id) });
        dbMock.findOne.mockResolvedValue({ _id: new ObjectId(customerPrimitives.id), ...customerPrimitives });

        const result = await customerRepository.add(customerPrimitives);
        const resultPrimitive = result?.toPrimitives();
        if (resultPrimitive) {
            expect(resultPrimitive?.name).toEqual(customerPrimitives.name);
            expect(resultPrimitive?.phone).toEqual(customerPrimitives.phone);
            expect(resultPrimitive?.email).toEqual(customerPrimitives.email);
        }
    });

    it('findAll returns a list of customers', async () => {
        const customersData = [
            { _id: new ObjectId(), name: 'John Doe', email: 'john@example.com', phone: '1234567890', totalCreditAmount: '100.00', creditEntries: [] },
            { _id: new ObjectId(), name: 'Jane Doe', email: 'jane@example.com', phone: '0987654321', totalCreditAmount: '200.00', creditEntries: [] }
        ];
        dbMock.toArray.mockResolvedValue(customersData);

        const result = await customerRepository.findAll({}, {}, {});

        expect(result).toHaveLength(2);
        expect(result[0]).toBeInstanceOf(Customer);
        expect(result[1]).toBeInstanceOf(Customer);

        const firstPrimitives = (result[0] as Customer).toPrimitives();
        const secondPrimitives = (result[1] as Customer).toPrimitives();
        expect(firstPrimitives.name).toBe(customersData[0].name);
        expect(secondPrimitives.name).toBe(customersData[1].name);
    });

    it('findAll returns an empty list when no customers are found', async () => {
        dbMock.toArray.mockResolvedValue([]);

        const result = await customerRepository.findAll({}, {}, {});

        expect(result).toHaveLength(0);
    });

    it('findAll handles errors gracefully', async () => {
        dbMock.toArray.mockRejectedValue(new Error('Database error'));

        await expect(customerRepository.findAll({}, {}, {})).rejects.toThrow('Database error');
    });

    it('should find a customer by id', async () => {
        const customer = CustomerMother.create();
        const customerPrimitives = customer.toPrimitives();
        dbMock.findOne.mockResolvedValue({ _id: new ObjectId(customerPrimitives.id), ...customer });

        const result = await customerRepository.findById(customerPrimitives.id);
        const resultPrimitive = result?.toPrimitives();

        if (resultPrimitive) {
            // @ts-ignore
            expect(resultPrimitive?.name?.value).toEqual(customerPrimitives.name);
            // @ts-ignore
            expect(resultPrimitive?.phone?.value).toEqual(customerPrimitives.phone);
            // @ts-ignore
            expect(resultPrimitive?.email?.value).toEqual(customerPrimitives.email);
        }
    });

    it('should update a customer', async () => {
        const customer = CustomerMother.create();
        const customerPrimitives = customer.toPrimitives();

        const primi = customer.toPrimitives();
        const id = primi.id
        const name = primi.name
        let customer2:any = (Customer.create({ ...primi, id, name: name + "-aaaa", createdAt: new Date() }) as any);

        customer2._id = new ObjectId(customer2?.id?.value)
        delete customer2.id

        dbMock.findOneAndUpdate.mockResolvedValue(customer2);

        const result = await customerRepository.findOneAndUpdate(customer);
        const resultPrimitive = result?.toPrimitives();
        // @ts-ignore
        expect(resultPrimitive.name.value).toEqual(customerPrimitives.name + "-aaaa");
        // @ts-ignore
        expect(resultPrimitive.phone.value).toEqual(customerPrimitives.phone);
        // @ts-ignore
        expect(resultPrimitive.email.value).toEqual(customerPrimitives.email);
    });

    it('should delete a customer', async () => {
        const customer = CustomerMother.create();
        const customerPrimitives = customer.toPrimitives();

        const primi = customer.toPrimitives();
        const id = primi.id
        const name = primi.name
        let customer2:any = (Customer.create({ ...primi, id, createdAt: new Date() }) as any);

        customer2._id = new ObjectId(customer2?.id?.value)
        delete customer2.id

        dbMock.findOneAndDelete.mockResolvedValue(customer2);

        const result = await customerRepository.deleteOne(customerPrimitives?.id ?? '');
        const resultPrimitive = result?.toPrimitives();
        // @ts-ignore
        expect(resultPrimitive.name.value).toEqual(customerPrimitives.name);
        // @ts-ignore
        expect(resultPrimitive.phone.value).toEqual(customerPrimitives.phone);
        // @ts-ignore
        expect(resultPrimitive.email.value).toEqual(customerPrimitives.email);
    });
});
