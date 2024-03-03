import dotenv from "dotenv";
import express, { Request, Response, Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer, Server } from 'http';
import axios from "axios";
import expressFormidable from 'express-formidable';

import path from "path";
import { fileURLToPath } from "url";

import { createServerHandler } from "./server/createServer.js";
import { router } from "./routes/index.js";
import { connectDB } from "./db/connection.js";
import { establishSocketCommunication } from "./socket/connection.js";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

dotenv.config();

// const app: Express = express();
// const server: Server = createServer(app);

// const corsOptions: cors.CorsOptions = {
//   origin: "*",
// //   credentials: true,
// };

// app.use(cors(corsOptions));
// app.use(bodyParser.json({
//   limit: '100mb'
// }));

// app.use('/', router);

const server = createServerHandler();

server.listen(process.env.PORT || 5002, () => {
  console.log("Listening on port " + process.env.PORT || 5002);
  connectDB();
  establishSocketCommunication(server);
  global.connectedSockets = {};
});
