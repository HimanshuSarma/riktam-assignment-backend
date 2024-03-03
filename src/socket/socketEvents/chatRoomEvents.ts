import { Socket } from 'socket.io';

import { getAllChatMessagesController } from '../../controllers/chatControllers/getAllChatMessages.js';
import { createNewMessageController } from '../../controllers/chatControllers/createNewMessage.js';
import { addUsersInGroupController } from '../../controllers/groupControllers/addUsersInGroup.js';
import { removeUsersFromGroupController } from '../../controllers/groupControllers/removeUserFromGroup.js';
import { isUserParticipantOfGivenChatRooms } from '../../controllers/groupControllers/isUserParticipantOfGivenChatRooms.js';
import { editMessageController } from '../../controllers/chatControllers/editMessage.js';
import { likeOrUnlikeMessageController } from '../../controllers/chatControllers/likeMessage.js';
import { deleteMessageController } from '../../controllers/chatControllers/deleteMessage.js';
import { createGroupController } from '../../controllers/groupControllers/createGroup.js';

const establishChatRoomEvents = (socket: Socket) => {

    socket.on(`joinChatRooms`, async (allChatRooms: Array<string>, userId: string, token: string) => {
        if (!userId) {
            return;
        }

        const res = await isUserParticipantOfGivenChatRooms(allChatRooms, userId, token);

        console.log(res, allChatRooms, 'joinChatRooms');

        if (res?.success) {
            socket.join(allChatRooms);
            connectedSockets[userId] = socket;
        }
    });

    socket.on(`addChatRoom`, async ({ name, users, token } : { name: string, users: Array<string>, token: string }) => {
        console.log(name, users, 'addChatRoom');
        const queryRes = await createGroupController({ name, users, token });

        global.socketIO.to(socket.id).emit(`addChatRoomAck`, {
            ...queryRes,
            emitter: true
        }, users);

        if (queryRes?.success) {
            console.log(queryRes, 'addChatRoomResponse');
            for (let i = 0; i < users?.length; i++) {
                global?.connectedSockets?.[users?.[i]]?.join?.(queryRes?.payload?._id);
                socket.join(queryRes?.payload?._id);
            }

            global.socketIO.to(users).emit(`addChatRoomBroadcast`, queryRes);
        }
    });

    socket.on(`addUsersInChatRoom`, async (users: Array<string>, groupId: string, token: string) => {
        const queryRes = await addUsersInGroupController(users, groupId, token);

        console.log(users, groupId, queryRes, 'addUsersInChatRoom');

        global.socketIO.to(socket.id).emit(`addUsersInChatRoomAck`, {
            ...queryRes,
            payload: {
                ...queryRes?.payload,
                users
            }
        });

        if (queryRes?.success) {
            console.log(queryRes, 'response');

            for (let i = 0; i < users?.length; i++) {
                global?.connectedSockets?.[users?.[i]]?.join?.(groupId);
            }

            socket.to(groupId).emit(`addUsersInChatRoomBroadcast`, queryRes);
        }
        
    });

    socket.on(`removeUsersFromChatRoom`, async (users: Array<string>, groupId: string, token: string) => {
        console.log(users, 'removeUserFromChatRoom');
        const queryRes = await removeUsersFromGroupController(users, groupId, token);

        // global.socketIO.to(socket.id).emit(`removeUsersFromChatRoomAck`, queryRes?.success, queryRes?.payload, users);
        global.socketIO.to(socket.id).emit(`removeUsersFromChatRoomAck`, {
            ...queryRes,
            payload: {
                ...queryRes?.payload,
                users
            }
        });

        if (queryRes?.success) {
            for (let i = 0; i < users?.length; i++) {
                const socketConnectionsInChatRoom = await global.socketIO.of(`/`).in(groupId).fetchSockets();
                const userSocket = socketConnectionsInChatRoom.find(socket => socket.id.toString() === global.connectedSockets?.[users?.[i]]?.id);
                userSocket?.leave(groupId);
            }
            
            socket.to(groupId).emit(`removeUsersFromChatRoomBroadcast`, queryRes);
        }
        // console.log(res, 'response');
    });

    socket.on(`getAllChatMessages`, async (roomId: string, token: string) => {
        const queryRes = await getAllChatMessagesController(roomId, token);
        // global.socketIO.to(socket.id).emit('getAllChatMessagesAck', queryRes, roomId);
        global.socketIO.to(socket.id).emit('getAllChatMessagesAck', {
            ...queryRes,
            payload: {
                ...queryRes?.payload,
                roomId
            }
        });
    });

    socket.on(`newMessage`, async (message: string, roomId: string, token: string) => {
        const queryRes = await createNewMessageController(message, roomId, token);

        if (queryRes?.success) {
            global.socketIO.in(roomId).emit('newMessageBroadcast', queryRes);
        }
    });

    socket.on(`editMessage`, async (message: string, messageId: string, roomId: string, token: string) => {
        const queryRes = await editMessageController(message, messageId, token);

        if (queryRes?.success) {
            global.socketIO.in(roomId).emit('editMessageBroadcast', queryRes);
        }
    });

    socket.on(`deleteMessage`, async (messageId: string, roomId: string, token: string) => {
        const queryRes = await deleteMessageController(messageId, token);

        if (queryRes?.success) {
            global.socketIO.in(roomId).emit('deleteMessageBroadcast', {
                ...queryRes,
                payload: {
                    messageId,
                    roomId
                }
            });
        }
    });

    socket.on(`likeOrUnlikeMessage`, async (messageId: string, action: 'like' | 'unlike', roomId: string, token: string) => {
        console.log('likeOrUnlikeMessage', messageId, action, roomId);
        const queryRes = await likeOrUnlikeMessageController(messageId, roomId, action, token);

        console.log('likeOrUnlikeMessage', queryRes);

        if (queryRes?.success) {
            global.socketIO.in(roomId).emit('likeOrUnlikeMessageBroadcast', queryRes);
        }
    });
};

export { establishChatRoomEvents };

