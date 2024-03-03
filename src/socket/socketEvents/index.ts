import { Socket } from 'socket.io';
 
import { establishChatRoomEvents } from "./chatRoomEvents.js";

const establishAllSocketEvents = () => {
    global.socketIO.on('connection', (socket: Socket) => {
        console.log('socket');
        socket.on(`joinOwnRoom`, (userId: string) => {
            console.log('joinOwnRoom', userId);
            socket.join(userId);
        });
        establishChatRoomEvents(socket);
    });
};

export { establishAllSocketEvents };