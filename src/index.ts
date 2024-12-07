import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import {StatusCodes} from "http-status-codes";
import {queryParser} from "express-query-parser";
import routes from './infrastructure/http/routes';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use(
    queryParser({
        parseNull: true,
        parseUndefined: true,
        parseBoolean: true,
        parseNumber: true
    })
)

app.use('/api', routes.customer);
app.get('/ping', (req, res) => {
    res.status(StatusCodes.OK).json({ data: 'pong' });
});

app.listen(PORT, () => {
    console.log(`App and running on http://localhost:${PORT}`);
});
