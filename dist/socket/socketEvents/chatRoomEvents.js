var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getAllChatMessagesController } from '../../controllers/chatControllers/getAllChatMessages.js';
import { createNewMessageController } from '../../controllers/chatControllers/createNewMessage.js';
import { addUsersInGroupController } from '../../controllers/groupControllers/addUsersInGroup.js';
import { removeUsersFromGroupController } from '../../controllers/groupControllers/removeUserFromGroup.js';
import { isUserParticipantOfGivenChatRooms } from '../../controllers/groupControllers/isUserParticipantOfGivenChatRooms.js';
import { editMessageController } from '../../controllers/chatControllers/editMessage.js';
import { likeOrUnlikeMessageController } from '../../controllers/chatControllers/likeMessage.js';
import { deleteMessageController } from '../../controllers/chatControllers/deleteMessage.js';
import { createGroupController } from '../../controllers/groupControllers/createGroup.js';
const establishChatRoomEvents = (socket) => {
    socket.on(`joinChatRooms`, (allChatRooms, userId, token) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId) {
            return;
        }
        const res = yield isUserParticipantOfGivenChatRooms(allChatRooms, userId, token);
        console.log(res, allChatRooms, 'joinChatRooms');
        if (res === null || res === void 0 ? void 0 : res.success) {
            socket.join(allChatRooms);
            connectedSockets[userId] = socket;
        }
    }));
    socket.on(`addChatRoom`, ({ name, users, token }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        console.log(name, users, 'addChatRoom');
        const queryRes = yield createGroupController({ name, users, token });
        global.socketIO.to(socket.id).emit(`addChatRoomAck`, Object.assign(Object.assign({}, queryRes), { emitter: true }), users);
        if (queryRes === null || queryRes === void 0 ? void 0 : queryRes.success) {
            console.log(queryRes, 'addChatRoomResponse');
            for (let i = 0; i < (users === null || users === void 0 ? void 0 : users.length); i++) {
                (_c = (_b = (_a = global === null || global === void 0 ? void 0 : global.connectedSockets) === null || _a === void 0 ? void 0 : _a[users === null || users === void 0 ? void 0 : users[i]]) === null || _b === void 0 ? void 0 : _b.join) === null || _c === void 0 ? void 0 : _c.call(_b, (_d = queryRes === null || queryRes === void 0 ? void 0 : queryRes.payload) === null || _d === void 0 ? void 0 : _d._id);
                socket.join((_e = queryRes === null || queryRes === void 0 ? void 0 : queryRes.payload) === null || _e === void 0 ? void 0 : _e._id);
            }
            global.socketIO.to(users).emit(`addChatRoomBroadcast`, queryRes);
        }
    }));
    socket.on(`addUsersInChatRoom`, (users, groupId, token) => __awaiter(void 0, void 0, void 0, function* () {
        var _f, _g, _h;
        const queryRes = yield addUsersInGroupController(users, groupId, token);
        console.log(users, groupId, queryRes, 'addUsersInChatRoom');
        global.socketIO.to(socket.id).emit(`addUsersInChatRoomAck`, Object.assign(Object.assign({}, queryRes), { payload: Object.assign(Object.assign({}, queryRes === null || queryRes === void 0 ? void 0 : queryRes.payload), { users }) }));
        if (queryRes === null || queryRes === void 0 ? void 0 : queryRes.success) {
            console.log(queryRes, 'response');
            for (let i = 0; i < (users === null || users === void 0 ? void 0 : users.length); i++) {
                (_h = (_g = (_f = global === null || global === void 0 ? void 0 : global.connectedSockets) === null || _f === void 0 ? void 0 : _f[users === null || users === void 0 ? void 0 : users[i]]) === null || _g === void 0 ? void 0 : _g.join) === null || _h === void 0 ? void 0 : _h.call(_g, groupId);
            }
            socket.to(groupId).emit(`addUsersInChatRoomBroadcast`, queryRes);
        }
    }));
    socket.on(`removeUsersFromChatRoom`, (users, groupId, token) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(users, 'removeUserFromChatRoom');
        const queryRes = yield removeUsersFromGroupController(users, groupId, token);
        // global.socketIO.to(socket.id).emit(`removeUsersFromChatRoomAck`, queryRes?.success, queryRes?.payload, users);
        global.socketIO.to(socket.id).emit(`removeUsersFromChatRoomAck`, Object.assign(Object.assign({}, queryRes), { payload: Object.assign(Object.assign({}, queryRes === null || queryRes === void 0 ? void 0 : queryRes.payload), { users }) }));
        if (queryRes === null || queryRes === void 0 ? void 0 : queryRes.success) {
            for (let i = 0; i < (users === null || users === void 0 ? void 0 : users.length); i++) {
                const socketConnectionsInChatRoom = yield global.socketIO.of(`/`).in(groupId).fetchSockets();
                const userSocket = socketConnectionsInChatRoom.find(socket => { var _a, _b; return socket.id.toString() === ((_b = (_a = global.connectedSockets) === null || _a === void 0 ? void 0 : _a[users === null || users === void 0 ? void 0 : users[i]]) === null || _b === void 0 ? void 0 : _b.id); });
                userSocket === null || userSocket === void 0 ? void 0 : userSocket.leave(groupId);
            }
            socket.to(groupId).emit(`removeUsersFromChatRoomBroadcast`, queryRes);
        }
        // console.log(res, 'response');
    }));
    socket.on(`getAllChatMessages`, (roomId, token) => __awaiter(void 0, void 0, void 0, function* () {
        const queryRes = yield getAllChatMessagesController(roomId, token);
        // global.socketIO.to(socket.id).emit('getAllChatMessagesAck', queryRes, roomId);
        global.socketIO.to(socket.id).emit('getAllChatMessagesAck', Object.assign(Object.assign({}, queryRes), { payload: Object.assign(Object.assign({}, queryRes === null || queryRes === void 0 ? void 0 : queryRes.payload), { roomId }) }));
    }));
    socket.on(`newMessage`, (message, roomId, token) => __awaiter(void 0, void 0, void 0, function* () {
        const queryRes = yield createNewMessageController(message, roomId, token);
        if (queryRes === null || queryRes === void 0 ? void 0 : queryRes.success) {
            global.socketIO.in(roomId).emit('newMessageBroadcast', queryRes);
        }
    }));
    socket.on(`editMessage`, (message, messageId, roomId, token) => __awaiter(void 0, void 0, void 0, function* () {
        const queryRes = yield editMessageController(message, messageId, token);
        if (queryRes === null || queryRes === void 0 ? void 0 : queryRes.success) {
            global.socketIO.in(roomId).emit('editMessageBroadcast', queryRes);
        }
    }));
    socket.on(`deleteMessage`, (messageId, roomId, token) => __awaiter(void 0, void 0, void 0, function* () {
        const queryRes = yield deleteMessageController(messageId, token);
        if (queryRes === null || queryRes === void 0 ? void 0 : queryRes.success) {
            global.socketIO.in(roomId).emit('deleteMessageBroadcast', Object.assign(Object.assign({}, queryRes), { payload: {
                    messageId,
                    roomId
                } }));
        }
    }));
    socket.on(`likeOrUnlikeMessage`, (messageId, action, roomId, token) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('likeOrUnlikeMessage', messageId, action, roomId);
        const queryRes = yield likeOrUnlikeMessageController(messageId, roomId, action, token);
        console.log('likeOrUnlikeMessage', queryRes);
        if (queryRes === null || queryRes === void 0 ? void 0 : queryRes.success) {
            global.socketIO.in(roomId).emit('likeOrUnlikeMessageBroadcast', queryRes);
        }
    }));
};
export { establishChatRoomEvents };
//# sourceMappingURL=chatRoomEvents.js.map