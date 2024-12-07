import Criteria from "../../../src/infrastructure/database/criteria";

describe('Criteria', () => {
    it('creates criteria with valid query params', () => {
        const queryParams = {
            filter: '{"name":"John"}',
            sort: 'name',
            order: 'asc',
            page: 2,
            limit: 10
        };
        const criteria = Criteria.createFromQueryParams(queryParams);

        expect(criteria.filter).toEqual({ name: 'John' });
        expect(criteria.sort).toEqual({ name: 1 });
        expect(criteria.pagination).toEqual({ page: 2, limit: 10 });
    });

    it('creates criteria with default sort and pagination when query params are empty', () => {
        const queryParams = {};
        const criteria = Criteria.createFromQueryParams(queryParams);

        expect(criteria.filter).toEqual({});
        expect(criteria.sort).toEqual({ createdAt: 1 });
        expect(criteria.pagination).toEqual({ page: 1, limit: 100 });
    });

    it('creates criteria with default sort and pagination when query params are undefined', () => {
        const criteria = Criteria.createFromQueryParams(undefined);

        expect(criteria.filter).toBeDefined();
        expect(criteria.sort).toBeDefined();
        expect(criteria.pagination).toBeDefined();
    });

    it('throws an error when filter is not a valid JSON string', () => {
        const queryParams = {
            filter: 'invalid-json'
        };

        expect(() => Criteria.createFromQueryParams(queryParams)).toThrow(SyntaxError);
    });

    it('creates criteria with default sort order when order is invalid', () => {
        const queryParams = {
            sort: 'name',
            order: 'invalid-order'
        };
        const criteria = Criteria.createFromQueryParams(queryParams);

        expect(criteria.sort).toEqual({ name: 1 });
    });
});
