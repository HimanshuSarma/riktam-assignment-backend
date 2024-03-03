import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { establishAllSocketEvents } from './socketEvents/index.js';

let socketIO: SocketIOServer;


const establishSocketCommunication = (server: Server) => {
    socketIO = new SocketIOServer(server, {
        cors: {
            origin: '*'
        }
    });

    global.socketIO = socketIO;
    establishAllSocketEvents();
}

export { socketIO, establishSocketCommunication };