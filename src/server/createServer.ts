import express, { Express } from 'express';
import { Server, createServer } from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

import { router } from '../routes/index.js';

const createServerHandler = () => {
    const app: Express = express();
    const server: Server = createServer(app);

    const corsOptions: cors.CorsOptions = {
        origin: "*",
        //   credentials: true,
    };
    
    app.use(cors(corsOptions));
    app.use(bodyParser.json({
        limit: '100mb'
    }));

    app.use('/', router);  

    return server;
}

export { createServerHandler };