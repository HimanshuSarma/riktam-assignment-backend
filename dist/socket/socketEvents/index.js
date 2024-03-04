import { establishChatRoomEvents } from "./chatRoomEvents.js";
const establishAllSocketEvents = () => {
    global.socketIO.on('connection', (socket) => {
        console.log('socket');
        socket.on(`joinOwnRoom`, (userId) => {
            var _a;
            socket.join(userId);
            global.connectedSockets = Object.assign(Object.assign({}, global.connectedSockets), { [userId]: Object.assign(Object.assign({}, (_a = global === null || global === void 0 ? void 0 : global.connectedSockets) === null || _a === void 0 ? void 0 : _a[userId]), { [socket.id]: socket }) });
            console.log('joinOwnRoom', global === null || global === void 0 ? void 0 : global.connectedSockets);
        });
        establishChatRoomEvents(socket);
    });
};
export { establishAllSocketEvents };
//# sourceMappingURL=index.js.map