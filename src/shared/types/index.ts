import {Response} from "express";

export type ApiResponse = Promise<Response | void | any>

export type CustomerProps = {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    createdAt?: Date;
    totalCreditAmount?: string;
    creditEntries?: any[];
}

export type PaginationType = {
    page?: number;
    limit?: number;
}

export type CriteriaType = {
    filter?: any;
    sort?: {
        [key: string]: number;
    },
    pagination?: {
        page: number;
        limit: number;
    }
}
