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
import { actionOnAllSocketConnectionsOfAUser } from '../../utils/socketUtils/actionOnAllSocketConnectionsOfAUser.js';
import { verifyJWTTokenAndSendAck } from '../../utils/socketUtils/verifyJWTTokenAndSendAck.js';
import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: 'json' };
const establishChatRoomEvents = (socket) => {
    socket.on(`joinChatRooms`, (allChatRooms, userId, token) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId) {
            return;
        }
        const user = verifyJWTTokenAndSendAck(token, (socketConnection) => {
            var _a, _b;
            (_b = (_a = global.socketIO) === null || _a === void 0 ? void 0 : _a.to(socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id)) === null || _b === void 0 ? void 0 : _b.emit(`joinChatRoomsAck`, {
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN,
                success: false,
                emitter: ((socket === null || socket === void 0 ? void 0 : socket.id) === (socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id))
            });
        });
        if (!(user === null || user === void 0 ? void 0 : user._id)) {
            return;
        }
        const res = yield isUserParticipantOfGivenChatRooms(allChatRooms, userId);
        console.log(global === null || global === void 0 ? void 0 : global.connectedSockets, 'joinChatRooms');
        if (res === null || res === void 0 ? void 0 : res.success) {
            socket.join(allChatRooms);
        }
    }));
    socket.on(`addChatRoom`, ({ name, users, token }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        console.log(name, users, 'addChatRoom');
        const user = verifyJWTTokenAndSendAck(token, (socketConnection) => {
            var _a, _b;
            (_b = (_a = global.socketIO) === null || _a === void 0 ? void 0 : _a.to(socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id)) === null || _b === void 0 ? void 0 : _b.emit(`addChatRoomAck`, {
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN,
                success: false,
                emitter: ((socket === null || socket === void 0 ? void 0 : socket.id) === (socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id))
            });
        });
        if (!(user === null || user === void 0 ? void 0 : user._id)) {
            return;
        }
        const queryRes = yield createGroupController({ name, users, user });
        actionOnAllSocketConnectionsOfAUser(user === null || user === void 0 ? void 0 : user._id, (socket) => {
            global.socketIO.to(socket === null || socket === void 0 ? void 0 : socket.id).emit(`addChatRoomAck`, Object.assign(Object.assign({}, queryRes), { emitter: true }), users);
        });
        if (queryRes === null || queryRes === void 0 ? void 0 : queryRes.success) {
            socket.join((_a = queryRes === null || queryRes === void 0 ? void 0 : queryRes.payload) === null || _a === void 0 ? void 0 : _a._id);
            console.log(global === null || global === void 0 ? void 0 : global.connectedSockets, users, 'addChatRoomResponse');
            for (let i = 0; i < (users === null || users === void 0 ? void 0 : users.length); i++) {
                actionOnAllSocketConnectionsOfAUser(users === null || users === void 0 ? void 0 : users[i], (socketConnection) => {
                    var _a;
                    socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.join((_a = queryRes === null || queryRes === void 0 ? void 0 : queryRes.payload) === null || _a === void 0 ? void 0 : _a._id);
                });
            }
            global.socketIO.to(users).emit(`addChatRoomBroadcast`, queryRes);
        }
    }));
    socket.on(`addUsersInChatRoom`, (users, groupId, token) => __awaiter(void 0, void 0, void 0, function* () {
        const user = verifyJWTTokenAndSendAck(token, (socketConnection) => {
            var _a, _b;
            (_b = (_a = global.socketIO) === null || _a === void 0 ? void 0 : _a.to(socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id)) === null || _b === void 0 ? void 0 : _b.emit(`addUsersInChatRoomAck`, {
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN,
                success: false,
                emitter: ((socket === null || socket === void 0 ? void 0 : socket.id) === (socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id))
            });
        });
        if (!(user === null || user === void 0 ? void 0 : user._id)) {
            return;
        }
        const queryRes = yield addUsersInGroupController(users, groupId, user === null || user === void 0 ? void 0 : user._id);
        console.log(users, groupId, queryRes, 'addUsersInChatRoom');
        actionOnAllSocketConnectionsOfAUser(user === null || user === void 0 ? void 0 : user._id, (socketConnection) => {
            global.socketIO.to(socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id).emit(`addUsersInChatRoomAck`, Object.assign(Object.assign({}, queryRes), { payload: Object.assign(Object.assign({}, queryRes === null || queryRes === void 0 ? void 0 : queryRes.payload), { users }) }));
        });
        if (queryRes === null || queryRes === void 0 ? void 0 : queryRes.success) {
            console.log(queryRes, 'response');
            for (let i = 0; i < (users === null || users === void 0 ? void 0 : users.length); i++) {
                // Object.entries(global?.connectedSockets?.[users?.[i]] || {})?.forEach?.((socketConnection) => {
                //     socketConnection?.[1]?.join(groupId);
                // });
                actionOnAllSocketConnectionsOfAUser(users === null || users === void 0 ? void 0 : users[i], (socketConnection) => {
                    socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.join(groupId);
                });
            }
            socket.to(groupId).emit(`addUsersInChatRoomBroadcast`, queryRes);
        }
    }));
    socket.on(`removeUsersFromChatRoom`, (users, groupId, token) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(users, 'removeUserFromChatRoom');
        const user = verifyJWTTokenAndSendAck(token, (socketConnection) => {
            var _a, _b;
            (_b = (_a = global.socketIO) === null || _a === void 0 ? void 0 : _a.to(socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id)) === null || _b === void 0 ? void 0 : _b.emit(`removeUsersFromChatRoomAck`, {
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN,
                success: false,
                emitter: ((socket === null || socket === void 0 ? void 0 : socket.id) === (socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id))
            });
        });
        if (!(user === null || user === void 0 ? void 0 : user._id)) {
            return;
        }
        const queryRes = yield removeUsersFromGroupController(users, groupId, user === null || user === void 0 ? void 0 : user._id);
        // global.socketIO.to(socket.id).emit(`removeUsersFromChatRoomAck`, queryRes?.success, queryRes?.payload, users);
        actionOnAllSocketConnectionsOfAUser(user === null || user === void 0 ? void 0 : user._id, (socketConnection) => {
            global.socketIO.to(socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id).emit(`removeUsersFromChatRoomAck`, Object.assign(Object.assign({}, queryRes), { payload: Object.assign(Object.assign({}, queryRes === null || queryRes === void 0 ? void 0 : queryRes.payload), { users }) }));
        });
        if (queryRes === null || queryRes === void 0 ? void 0 : queryRes.success) {
            for (let i = 0; i < (users === null || users === void 0 ? void 0 : users.length); i++) {
                actionOnAllSocketConnectionsOfAUser(users === null || users === void 0 ? void 0 : users[i], (socketConnection) => {
                    socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.leave(groupId);
                });
            }
            socket.to(groupId).emit(`removeUsersFromChatRoomBroadcast`, queryRes);
        }
        // console.log(res, 'response');
    }));
    socket.on(`getAllChatMessages`, (roomId, token) => __awaiter(void 0, void 0, void 0, function* () {
        const user = verifyJWTTokenAndSendAck(token, (socketConnection) => {
            var _a, _b;
            (_b = (_a = global.socketIO) === null || _a === void 0 ? void 0 : _a.to(socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id)) === null || _b === void 0 ? void 0 : _b.emit(`getAllChatMessagesAck`, {
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN,
                success: false,
                emitter: ((socket === null || socket === void 0 ? void 0 : socket.id) === (socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id))
            });
        });
        if (!(user === null || user === void 0 ? void 0 : user._id)) {
            return;
        }
        const queryRes = yield getAllChatMessagesController(roomId, user === null || user === void 0 ? void 0 : user._id);
        // global.socketIO.to(socket.id).emit('getAllChatMessagesAck', queryRes, roomId);
        // global.socketIO.to(socket.id).emit('getAllChatMessagesAck', {
        //     ...queryRes,
        //     payload: {
        //         ...queryRes?.payload,
        //         roomId
        //     }
        // });
        actionOnAllSocketConnectionsOfAUser(user === null || user === void 0 ? void 0 : user._id, (socketConnection) => {
            global.socketIO.to(socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id).emit('getAllChatMessagesAck', Object.assign(Object.assign({}, queryRes), { payload: Object.assign(Object.assign({}, queryRes === null || queryRes === void 0 ? void 0 : queryRes.payload), { roomId }) }));
        });
    }));
    socket.on(`newMessage`, (message, roomId, token) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const user = verifyJWTTokenAndSendAck(token, (socketConnection) => {
            var _a, _b;
            (_b = (_a = global.socketIO) === null || _a === void 0 ? void 0 : _a.to(socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id)) === null || _b === void 0 ? void 0 : _b.emit(`newMessageAck`, {
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN,
                success: false,
                emitter: ((socket === null || socket === void 0 ? void 0 : socket.id) === (socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id))
            });
        });
        if (!(user === null || user === void 0 ? void 0 : user._id)) {
            return;
        }
        const queryRes = yield createNewMessageController(message, roomId, user);
        (_b = global.socketIO.to(socket === null || socket === void 0 ? void 0 : socket.id)) === null || _b === void 0 ? void 0 : _b.emit(`newMessageAck`, Object.assign(Object.assign({}, queryRes), { emitter: true }));
        if (queryRes === null || queryRes === void 0 ? void 0 : queryRes.success) {
            socket.to(roomId).emit('newMessageBroadcast', queryRes);
        }
    }));
    socket.on(`editMessage`, (message, messageId, roomId, token) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const user = verifyJWTTokenAndSendAck(token, (socketConnection) => {
            var _a, _b;
            (_b = (_a = global.socketIO) === null || _a === void 0 ? void 0 : _a.to(socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id)) === null || _b === void 0 ? void 0 : _b.emit(`editMessageAck`, {
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN,
                success: false,
                emitter: ((socket === null || socket === void 0 ? void 0 : socket.id) === (socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id))
            });
        });
        if (!(user === null || user === void 0 ? void 0 : user._id)) {
            return;
        }
        const queryRes = yield editMessageController(message, messageId, roomId, user);
        (_c = global.socketIO.to(socket === null || socket === void 0 ? void 0 : socket.id)) === null || _c === void 0 ? void 0 : _c.emit(`editMessageAck`, Object.assign(Object.assign({}, queryRes), { emitter: true }));
        if (queryRes === null || queryRes === void 0 ? void 0 : queryRes.success) {
            socket.to(roomId).emit('editMessageBroadcast', queryRes);
        }
    }));
    socket.on(`deleteMessage`, (messageId, roomId, token) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        const user = verifyJWTTokenAndSendAck(token, (socketConnection) => {
            var _a, _b;
            (_b = (_a = global.socketIO) === null || _a === void 0 ? void 0 : _a.to(socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id)) === null || _b === void 0 ? void 0 : _b.emit(`deleteMessageAck`, {
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN,
                success: false,
                emitter: ((socket === null || socket === void 0 ? void 0 : socket.id) === (socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id))
            });
        });
        if (!(user === null || user === void 0 ? void 0 : user._id)) {
            return;
        }
        const queryRes = yield deleteMessageController(messageId, roomId, user);
        (_d = global.socketIO.to(socket === null || socket === void 0 ? void 0 : socket.id)) === null || _d === void 0 ? void 0 : _d.emit(`deleteMessageAck`, Object.assign(Object.assign({}, queryRes), { payload: {
                messageId,
                roomId
            }, emitter: true }));
        if (queryRes === null || queryRes === void 0 ? void 0 : queryRes.success) {
            socket.to(roomId).emit('deleteMessageBroadcast', Object.assign(Object.assign({}, queryRes), { payload: {
                    messageId,
                    roomId
                } }));
        }
    }));
    socket.on(`likeOrUnlikeMessage`, (messageId, action, roomId, token) => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        console.log('likeOrUnlikeMessage', messageId, action, roomId);
        const user = verifyJWTTokenAndSendAck(token, (socketConnection) => {
            var _a, _b;
            (_b = (_a = global.socketIO) === null || _a === void 0 ? void 0 : _a.to(socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id)) === null || _b === void 0 ? void 0 : _b.emit(`likeOrUnlikeMessageAck`, {
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN,
                success: false,
                emitter: ((socket === null || socket === void 0 ? void 0 : socket.id) === (socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection.id))
            });
        });
        if (!(user === null || user === void 0 ? void 0 : user._id)) {
            return;
        }
        const queryRes = yield likeOrUnlikeMessageController(messageId, roomId, action, user);
        console.log('likeOrUnlikeMessage', queryRes);
        (_e = global.socketIO.to(socket === null || socket === void 0 ? void 0 : socket.id)) === null || _e === void 0 ? void 0 : _e.emit(`likeOrUnlikeMessageAck`, Object.assign(Object.assign({}, queryRes), { emitter: true }));
        if (queryRes === null || queryRes === void 0 ? void 0 : queryRes.success) {
            socket.to(roomId).emit('likeOrUnlikeMessageBroadcast', queryRes);
        }
    }));
};
export { establishChatRoomEvents };
//# sourceMappingURL=chatRoomEvents.js.map