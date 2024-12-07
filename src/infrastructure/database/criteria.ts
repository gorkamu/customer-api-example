import {CriteriaType} from "../../shared/types";

export default class Criteria {
    /** @private static PAGINATION_MAX_LIMIT number */
    static readonly PAGINATION_MAX_LIMIT = 100;

    /** @private static PAGINATION_DEFAULT_PAGE number */
    static readonly PAGINATION_DEFAULT_PAGE = 1;


    /**
     * @param queryParams any
     * @returns CriteriaType
     */
    static createFromQueryParams(queryParams: any): CriteriaType {
        let filter = {};
        let sort = {}
        let pagination = {}

        function createSortQuery(queryParams: any) {
            if (!queryParams || !queryParams.sort || !queryParams.order) {
                return { ['createdAt']: 1 };
            }

            const sortTem = queryParams.sort ?? 'createdAt';
            const sortOrder = queryParams.order ?? 'asc';

            const orderMap = new Map([
                ['asc', 1],
                ['desc', -1]
            ])

            let sortQuery: { [key: string]: number } = {};
            sortQuery[sortTem] = orderMap.get(sortOrder) ?? 1;

            return sortQuery;
        }

        function createPaginationQuery(queryParams: any) {
            return {
                page: queryParams.page ?? Criteria.PAGINATION_DEFAULT_PAGE,
                limit: queryParams.limit ?? Criteria.PAGINATION_MAX_LIMIT
            }
        }

        if (queryParams) {
            filter = queryParams.filter ? JSON.parse(queryParams.filter as string) : {};
            sort = createSortQuery(queryParams);
            pagination = createPaginationQuery(queryParams);
        }

        return { filter, sort, pagination } as CriteriaType;
    }
}
