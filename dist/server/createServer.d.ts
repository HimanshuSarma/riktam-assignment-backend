/// <reference types="node" />
import { Server } from 'http';
declare const createServerHandler: () => Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
export { createServerHandler };
