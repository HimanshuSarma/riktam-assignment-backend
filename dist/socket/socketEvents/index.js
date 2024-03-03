import { establishChatRoomEvents } from "./chatRoomEvents.js";
const establishAllSocketEvents = () => {
    global.socketIO.on('connection', (socket) => {
        console.log('socket');
        socket.on(`joinOwnRoom`, (userId) => {
            console.log('joinOwnRoom', userId);
            socket.join(userId);
        });
        establishChatRoomEvents(socket);
    });
};
export { establishAllSocketEvents };
//# sourceMappingURL=index.js.map