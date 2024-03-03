import { Server as SocketIOServer } from 'socket.io';
import { establishAllSocketEvents } from './socketEvents/index.js';
let socketIO;
const establishSocketCommunication = (server) => {
    socketIO = new SocketIOServer(server, {
        cors: {
            origin: '*'
        }
    });
    global.socketIO = socketIO;
    establishAllSocketEvents();
};
export { socketIO, establishSocketCommunication };
//# sourceMappingURL=connection.js.map