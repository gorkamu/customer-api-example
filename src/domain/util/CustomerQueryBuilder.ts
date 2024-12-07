import QueryBuilder from "../../infrastructure/database/query-builder";

export default class CustomerQueryBuilder extends QueryBuilder {
    constructor() {
        super();
    }

    /**
     * @param keyName string
     * @param sortOrder number
     * @returns any[]
     */
    private createSortStage(keyName: string, sortOrder: number) {
        const tempName = `${keyName}__temp`;
        if (keyName === 'totalCreditAmount') {
            return [
                { $addFields: { [tempName]: { $toDouble: `$${keyName}` } } },
                { $sort: { [tempName]: sortOrder } }
            ];
        } else if (keyName === 'id') {
            return [
                { $sort: { [`_${keyName}`]: sortOrder } }
            ];
        } else {
            return [
                { $sort: { [keyName]: sortOrder } }
            ];
        }
    }

    /**
     * @returns (keyName: string, sortOrder: number) => any[]
     */
    override getSortStage() {
        return (keyName: string, sortOrder: number): any[] => {
            const operation = this.createSortStage(keyName, sortOrder);
            return operation ? operation : [];
        };
    }
}
