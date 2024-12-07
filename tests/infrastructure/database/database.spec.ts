import { MongoClient } from 'mongodb';
import Database from "../../../src/infrastructure/database/database";


describe('Database', () => {
    let database: Database;
    let mockClient: MongoClient;

    beforeEach(() => {
        process.env.DB_URL = 'mongodb://localhost:27017/test';
        mockClient = new MongoClient(process.env.DB_URL);
        jest.spyOn(MongoClient.prototype, 'connect').mockResolvedValue(mockClient);
        jest.spyOn(MongoClient.prototype, 'close').mockResolvedValue();
        database = new Database();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('connects to the database successfully', async () => {
        const client = await database.connect();
        expect(client).toBe(mockClient);
    });

    it('throws an error when DB_URL is not provided', () => {
        delete process.env.DB_URL;
        expect(() => new Database()).toThrow('Missing Database DSN');
    });
});
