import { Socket } from 'socket.io';
 
import { establishChatRoomEvents } from "./chatRoomEvents.js";

const establishAllSocketEvents = () => {
    global.socketIO.on('connection', (socket: Socket) => {
        console.log('socket');
        socket.on(`joinOwnRoom`, (userId: string) => {
            socket.join(userId);
            global.connectedSockets = {
                ...global.connectedSockets,
                [userId]: {
                    ...global?.connectedSockets?.[userId],
                    [socket.id]: socket
                }
            };
            console.log('joinOwnRoom', global?.connectedSockets);
        });
        establishChatRoomEvents(socket);
    });
};

export { establishAllSocketEvents };