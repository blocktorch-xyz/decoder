import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import express from 'express';
import expressBasicAuth from 'express-basic-auth';
import tracer from 'dd-trace';
import {logger} from "./config/logger";
import bodyParser from "body-parser";

try{
    tracer.init();
} catch (e) {
    logger.mainLogger.error("🆘 DD error!!!!!!!!", e)
}

export const app = express();

export const router = express.Router();

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

app.use('/api/internal', expressBasicAuth({
    users: {
        [<string>process.env.BASIC_AUTH_INTERNAL_USERNAME]: <string>process.env.BASIC_AUTH_INTERNAL_PASSWORD
    }
}), router);
app.use(router);

/**
 * Routes Definition
 */
require('./api/allRoutes');

export default app;
