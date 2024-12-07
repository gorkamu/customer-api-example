import { MongoClient } from 'mongodb';

export default class Database {
    /** @var uri string|null */
    private readonly uri: string|null;
    /** @var client MongoClient|null */
    private readonly client: MongoClient|null = null;

    constructor() {
        if (!process.env.DB_URL) {
            throw new Error('Missing Database DSN');
        }

        this.uri = process.env.DB_URL;
        this.client = new MongoClient(this.uri);
    }

    /**
     * @return Promise<MongoClient|undefined>
     */
    public async connect(): Promise<MongoClient|undefined> {
        try {
            if (this.client) {
                return this.client.connect()
            }
        } catch (err) {
            console.info(`Closing mongodb connection.`)
            throw err;
        }
    }

    /**
     * @return Promise<void>
     */
    public async disconnect(): Promise<void> {
        process.on('exit', async () => { await this.handleDisconnect() });
        process.on('SIGINT', async () => { await this.handleDisconnect() });
        process.on('SIGTERM', async () => { await this.handleDisconnect() });
    }

    /**
     * @return Promise<void>
     */
    private async handleDisconnect(): Promise<void> {
        if (this.client) {
            console.info(`Closing mongodb connection.`)
            this.client.close().then(() => {
                console.info(`Mongodb connection closed`)
                console.info(`Proceed to exit process...`)
                process.exit(0)
            });
        }
    }
}
