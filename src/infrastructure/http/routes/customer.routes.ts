import {Router, Request, Response} from 'express';
import {CustomerController} from '../../controllers/customer.controller';
import {CustomerService} from '../../../application/services/customer.service';
import {CustomerRepository} from '../../persistence/customer.repository.impl';
import {ApiResponse} from "../../../shared/types";
import {StatusCodes} from "http-status-codes";
import {CustomError} from "../../../shared/errors/custom.error";
import Database from "../../database/database";
import {MongoClient} from "mongodb";

const router = Router();
const database = new Database();
let dbClient: MongoClient | undefined;
(async () => {
    dbClient = await database.connect();


    // TODO: Manual DI - refactor to use a DI container
    const customerController = new CustomerController(
        new CustomerService(
            new CustomerRepository(dbClient)
        )
    );

    router.get('/customers', async (req: Request, res: Response): ApiResponse => {
        try {
            const { data, pagination} = await customerController.find(req);
            res.status(StatusCodes.OK).json({ data, pagination});
        } catch (err) {
            console.error(`Error getting customers`, err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Error getting customers'});
        }
    });

    router.post('/customers', async (req: Request, res: Response): ApiResponse => {
        try {
            const response = await customerController.create(req);
            res.status(StatusCodes.CREATED).json(response);
        } catch (err: any) {
            console.error(`Error creating customer with args: ${JSON.stringify(req.body)}`, err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
        }
    });

    router.get('/customers/:id', async (req: Request, res: Response): ApiResponse => {
        try {
            const response = await customerController.getCustomer(req);
            res.status(StatusCodes.OK).json(response);
        } catch (err: any) {
            console.error(`Error getting customer args: ${JSON.stringify(req.params)}`, err);
            console.error('Error updating customer:', err);
            res.status(
                err instanceof CustomError
                    ? err.status
                    : StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
        }
    });

    router.put('/customers/:id', async (req: Request, res: Response): ApiResponse => {
        try {
            const response = await customerController.update(req);
            res.status(StatusCodes.OK).json(response);
        } catch (err: any) {
            console.error('Error updating customer:', err);
            res.status(
                err instanceof CustomError
                ? err.status
                : StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
        }
    });

    router.delete('/customers/:id', async (req: Request, res: Response): ApiResponse => {
        try {
            const response = await customerController.delete(req);
            res.status(StatusCodes.OK).json(response);
        } catch (err: any) {
            console.error('Error removing customer:', err);
            res.status(
                err instanceof CustomError
                    ? err.status
                    : StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
        }
    });

    router.post('/customers/:id/add-credit', async (req: Request, res: Response): ApiResponse => {
        try {
            const response = await customerController.addCredit(req);
            res.status(StatusCodes.OK).json(response);
        } catch (err: any) {
            console.error('Error updating customer:', err);
            res.status(
                err instanceof CustomError
                    ? err.status
                    : StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
        }
    });
})();


export default router;
