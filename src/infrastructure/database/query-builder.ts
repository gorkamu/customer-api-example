export default abstract class QueryBuilder {
    getSortStage() {
        return (keyName: string, sortOrder: number): any[] => {
            throw new Error('Method not implemented.');
        }
    }

    create(filter: object, sort: any, pagination: any): any[] {
        let aggregation: any = [];

        if (sort) {
            const keyName = Object.keys(sort)[0];
            const sortOrder = sort[keyName];
            const op = this.getSortStage()(keyName, sortOrder);
            if (op) {
                aggregation = [...aggregation, ...op];
            }
        }

        if (pagination) {
            const { page, limit } = pagination;
            aggregation = [
                ...aggregation,
                { $skip: (page - 1) * limit },
                { $limit: limit }
            ];
        }

        return aggregation;
    }
}
