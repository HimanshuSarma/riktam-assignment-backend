import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { router } from '../routes/index.js';
const createServerHandler = () => {
    const app = express();
    const server = createServer(app);
    const corsOptions = {
        origin: "*",
        //   credentials: true,
    };
    app.use(cors(corsOptions));
    app.use(bodyParser.json({
        limit: '100mb'
    }));
    app.use('/', router);
    return server;
};
export { createServerHandler };
//# sourceMappingURL=createServer.js.map