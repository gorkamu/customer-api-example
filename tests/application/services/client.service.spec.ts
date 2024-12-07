import {CustomerService} from "../../../src/application/services/customer.service";
// @ts-ignore
import {CustomerMother} from "../../domain/entities/customer-mother.entity";
import {CustomError} from "../../../src/shared/errors/custom.error";
import {CustomerRepository} from "../../../src/infrastructure/persistence/customer.repository.impl";
import {MongoClient} from "mongodb";
import {StatusCodes} from "http-status-codes";
import Criteria from "../../../src/infrastructure/database/criteria";

jest.mock('../../../src/infrastructure/persistence/customer.repository.impl');

describe('CustomerService', () => {
    let dbClient: MongoClient;
    let customerService: CustomerService;
    let customerRepository: jest.Mocked<CustomerRepository>;

    beforeEach(() => {
        dbClient = new MongoClient(process.env.DB_URL || 'mongodb://localhost:27017') as jest.Mocked<MongoClient>;
        customerRepository = new CustomerRepository(dbClient) as jest.Mocked<CustomerRepository>;
        customerService = new CustomerService(customerRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new customer', async () => {
        const customer = CustomerMother.create();
        customerRepository.findByEmail.mockResolvedValue(null);
        customerRepository.findByPhone.mockResolvedValue(null);
        customerRepository.add.mockResolvedValue(customer);

        const customerPrimitive = customer.toPrimitives();
        const result = await customerService.create({
            name: customerPrimitive.name,
            email: customerPrimitive.email,
            phone: customerPrimitive.phone
        });

        expect(customerRepository.findByEmail).toHaveBeenCalledWith(customer.email.value);
        expect(customerRepository.findByPhone).toHaveBeenCalledWith(customer.phone?.value);
        expect(result.name.value).toEqual(customerPrimitive.name);
        expect(result.email.value).toEqual(customerPrimitive.email);
        expect(result?.phone?.value).toEqual(customerPrimitive.phone);
    });

    it('should throw CustomError if customer already exists', async () => {
        const customer = CustomerMother.create();
        customerRepository.findByEmail.mockResolvedValue(customer);
        customerRepository.findByPhone.mockResolvedValue(null);

        const customerPrimitive = customer.toPrimitives();
        await expect(customerService.create({
            name: customerPrimitive.name,
            email: customerPrimitive.email,
            phone: customerPrimitive.phone
        })).rejects.toThrow(new CustomError('Customer already exists', StatusCodes.CONFLICT));
    });

    it('should get a customer by id', async () => {
        const customer = CustomerMother.create();
        customerRepository.findById.mockResolvedValue(customer);

        const result = await customerService.getCustomerById('1');

        expect(customerRepository.findById).toHaveBeenCalledWith('1');
        expect(result).toEqual(customer);
    });

    it('should return null if customer not found by id', async () => {
        customerRepository.findById.mockResolvedValue(null);

        const result = await customerService.getCustomerById('1');

        expect(customerRepository.findById).toHaveBeenCalledWith('1');
        expect(result).toBeNull();
    });

    it('should find all customers', async () => {
        const customers = [
            CustomerMother.create(),
            CustomerMother.create()
        ];
        customerRepository.findAll.mockResolvedValue(customers);

        const query = {};
        const criteria = Criteria.createFromQueryParams(query);
        const result = await customerService.findAll(criteria);

        expect(customerRepository.findAll).toHaveBeenCalledWith(criteria.filter, criteria.sort, criteria.pagination);
        expect(result).toEqual(customers);
    });

    it('should update a customer', async () => {
        const customer = CustomerMother.create();
        customerRepository.findOneAndUpdate.mockResolvedValue(customer);
        const customerPrimitive = customer.toPrimitives();

        const result = await customerService.update({
            id: customerPrimitive.id,
            name: customerPrimitive.name,
            email: customerPrimitive.email,
            phone: customerPrimitive.phone
        });

        expect(customerRepository.findOneAndUpdate).toHaveBeenCalledWith(customer);
        expect(result).toEqual(customer);
    });

    it('should delete a customer', async () => {
        const customer = CustomerMother.create();
        customerRepository.findById.mockResolvedValue(customer);
        customerRepository.deleteOne.mockResolvedValue(customer);

        const result = await customerService.delete('1');

        expect(customerRepository.findById).toHaveBeenCalledWith('1');
        expect(customerRepository.deleteOne).toHaveBeenCalledWith('1');
        expect(result).toEqual(customer);
    });

    it('should return null when deleting a non-existent customer', async () => {
        customerRepository.findById.mockResolvedValue(null);

        const result = await customerService.delete('1');

        expect(customerRepository.findById).toHaveBeenCalledWith('1');
        expect(result).toBeNull();
    });

    it('should add credit entry to a customer', async () => {
        const customer = CustomerMother.create();
        customerRepository.findById.mockResolvedValue(customer);
        customerRepository.addCreditEntry.mockResolvedValue(customer);

        const result = await customerService.addCreditEntry('1', '100');

        expect(customerRepository.findById).toHaveBeenCalledWith('1');
        expect(customerRepository.addCreditEntry).toHaveBeenCalledWith('1', '100');
        expect(result).toEqual(customer);
    });

    it('should return null when adding credit entry to a non-existent customer', async () => {
        customerRepository.findById.mockResolvedValue(null);

        const result = await customerService.addCreditEntry('1', '100');

        expect(customerRepository.findById).toHaveBeenCalledWith('1');
        expect(result).toBeNull();
    });
});
