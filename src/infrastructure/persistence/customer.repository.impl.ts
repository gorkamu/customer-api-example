import {ICustomerRepository} from "../../domain/repositories/customer.repository";
import {MongoClient, ObjectId} from "mongodb";
import {ICustomer, ICustomerPrimitive} from "../../shared/interfaces";
import {Customer} from "../../domain/entities/customer.entity";
import {CreditEntryVo} from "../../domain/value-objects/credit-entry.vo";
import QueryBuilder from "../database/query-builder";
import CustomerQueryBuilder from "../../domain/util/CustomerQueryBuilder";


export class CustomerRepository implements ICustomerRepository {
    /** @private _DB_NAME string */
    private readonly _DB_NAME: string = process.env.DB_NAME ?? 'tax-down';
    /** @private _COLLECTION_NAME string */
    private readonly _COLLECTION_NAME: string = 'customers';
    /** @private db any */
    private db: any;

    /**
     * @param dbClient MongoClient|undefined
     */
    constructor(private readonly dbClient: MongoClient | undefined) {
        this.db = dbClient?.db(this._DB_NAME).collection(this._COLLECTION_NAME);
    }

    /**
     * @param item any
     * @returns ICustomer
     */
    private _castToCustomer(item: any): ICustomer {
        if (!item || !item._id) {
            throw new Error('Invalid item or item._id');
        }

        const data = Object.assign(item, {
            ...item,
            id: item._id.toString()
        });

        delete data._id;

        return Customer.create(data);
    }

    /**
     * @param customer ICustomerPrimitive
     * @returns Promise<ICustomer>
     */
    async add(customer: ICustomerPrimitive): Promise<ICustomer> {
        delete customer.id;
        const result = await this.db?.insertOne({
            ...customer,
            createdAt: new Date()
        });

        if (!result || !result?.insertedId) {
            throw new Error('Error creating customer');
        }

        const item = await this.db?.findOne({_id: result.insertedId});
        if (!item) {
            throw new Error('Error creating customer');
        }

        return this._castToCustomer(item);
    }

    /**
     * @returns Promise<(ICustomer | ICustomerPrimitive)[]>
     */
    async findAll(filter: object, sort: any, pagination: any): Promise<(ICustomer | ICustomerPrimitive)[]> {
        const aggregation = new CustomerQueryBuilder().create(filter, sort, pagination);
        const customers = await this.db.aggregate(aggregation).toArray();

        return customers?.map(({_id, name, email, phone, totalCreditAmount, creditEntries}: any) => Customer.create({
            name,
            email,
            phone,
            totalCreditAmount,
            creditEntries,
            id: _id?.toString()
        }));
    }

    /**
     * @param id string
     * @returns Promise<Client | null>
     */
    async findById(id?: string): Promise<ICustomer | null> {
        const result = await this.db?.findOne({_id: new ObjectId(id)});
        if (!result) {
            return null;
        }

        return this._castToCustomer(result);
    }

    /**
     * @param data ICustomer
     * @returns Promise<ICustomer>
     */
    async findOneAndUpdate(data: ICustomer): Promise<ICustomer|null> {
        const {id, name, email, phone} = data.toPrimitives();
        const item = await this.db?.findOneAndUpdate({
            _id: new ObjectId(id)
        }, {
            $set: {name, email, phone}
        }, { returnDocument: 'after' });

        if (!item) {
            return null
        }

        return this._castToCustomer(item);
    }

    /**
     * @param id string
     * @returns Promise<ICustomer>
     */
    async deleteOne(id: string): Promise<ICustomer|null> {
        const item = await this.db?.findOneAndDelete({_id: new ObjectId(id)});
        if (!item) {
            return null;
        }

        return this._castToCustomer(item);
    }

    /**
     * @param email string
     * @returns Promise<ICustomer | null>
     */
    async findByEmail(email: string): Promise<ICustomer | null> {
        const item = await this.db?.findOne({email});
        if (!item) {
            return null;
        }

        return this._castToCustomer(item);
    }

    /**
     * @param phone string
     * @returns Promise<ICustomer | null>
     */
    async findByPhone(phone?: string): Promise<ICustomer | null> {
        if (!phone) {
            return null;
        }

        const item = await this.db?.findOne({phone});
        if (!item) {
            return null;
        }

        return this._castToCustomer(item);
    }

    /**
     * @returns Promise<ICustomer>
     * @param id
     * @param amount
     */
    async addCreditEntry(id: string, amount: string): Promise<ICustomer|null> {
        const customer = await this.db?.findOne({ _id: new ObjectId(id) });
        if (!customer) {
            throw new Error(`Customer with ${id.toString()} not found`);
        }

        const currentTotalAmount = parseFloat(customer.totalCreditAmount ?? CreditEntryVo.DEFAULT_AMOUNT);
        const requestedAmount = parseFloat(amount);
        const newTotalAmount = (currentTotalAmount + requestedAmount).toFixed(2).toString();

        const item = await this.db?.findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $push: { creditEntries: { date: new Date(), amount } },
                $set: { totalCreditAmount: newTotalAmount }
            },
            { returnDocument: 'after' }
        );

        if (!item) {
            return null;
        }

        return this._castToCustomer(item);
    }
}
