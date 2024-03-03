/// <reference types="node" />
import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
declare let socketIO: SocketIOServer;
declare const establishSocketCommunication: (server: Server) => void;
export { socketIO, establishSocketCommunication };
