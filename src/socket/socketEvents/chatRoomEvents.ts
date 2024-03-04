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
import { UserModelType } from '../../types/db/mongodb/models/User.js';

import { extractDataAndCallVerifyToken } from '../../utils/middlewareDataExtractorUtils.js';
import { actionOnAllSocketConnectionsOfAUser } from '../../utils/socketUtils/actionOnAllSocketConnectionsOfAUser.js';
import { verifyJWTTokenAndSendAck } from '../../utils/socketUtils/verifyJWTTokenAndSendAck.js';

import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: 'json' };

const establishChatRoomEvents = (socket: Socket) => {

    socket.on(`joinChatRooms`, async (allChatRooms: Array<string>, userId: string, token: string) => {
        if (!userId) {
            return;
        }

        const user = verifyJWTTokenAndSendAck(token, (socketConnection: Socket) => {
            global.socketIO?.to(socketConnection?.id)?.emit(`joinChatRoomsAck`, {
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN,
                success: false,
                emitter: (socket?.id === socketConnection?.id)
            })
        });

        if (!user?._id) {
            return;
        }

        const res = await isUserParticipantOfGivenChatRooms(allChatRooms, userId);

        console.log(global?.connectedSockets, 'joinChatRooms');

        if (res?.success) {
            socket.join(allChatRooms);
        }
    });

    socket.on(`addChatRoom`, async ({ name, users, token } : { name: string, users: Array<string>, token: string }) => {
        console.log(name, users, 'addChatRoom');

        const user = verifyJWTTokenAndSendAck(token, (socketConnection: Socket) => {
            global.socketIO?.to(socketConnection?.id)?.emit(`addChatRoomAck`, {
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN,
                success: false,
                emitter: (socket?.id === socketConnection?.id)
            })
        });

        if (!user?._id) {
            return;
        }

        const queryRes = await createGroupController({ name, users, user });

        actionOnAllSocketConnectionsOfAUser(user?._id, (socket: Socket) => {
            global.socketIO.to(socket?.id).emit(`addChatRoomAck`, {
                ...queryRes,
                emitter: true
            }, users);
        });

        if (queryRes?.success) {
            socket.join(queryRes?.payload?._id);
            console.log(global?.connectedSockets, users, 'addChatRoomResponse');
            for (let i = 0; i < users?.length; i++) {
                actionOnAllSocketConnectionsOfAUser(users?.[i], (socketConnection: Socket) => {
                    socketConnection?.join(queryRes?.payload?._id);
                });
            }

            global.socketIO.to(users).emit(`addChatRoomBroadcast`, queryRes);
        }
    });

    socket.on(`addUsersInChatRoom`, async (users: Array<string>, groupId: string, token: string) => {

        const user = verifyJWTTokenAndSendAck(token, (socketConnection: Socket) => {
            global.socketIO?.to(socketConnection?.id)?.emit(`addUsersInChatRoomAck`, {
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN,
                success: false,
                emitter: (socket?.id === socketConnection?.id)
            })
        });

        if (!user?._id) {
            return;
        }

        const queryRes = await addUsersInGroupController(users, groupId, user?._id);

        console.log(users, groupId, queryRes, 'addUsersInChatRoom');

        actionOnAllSocketConnectionsOfAUser(user?._id, (socketConnection: Socket) => {
            global.socketIO.to(socketConnection?.id).emit(`addUsersInChatRoomAck`, {
                ...queryRes,
                payload: {
                    ...queryRes?.payload,
                    users
                }
            });
        });

        if (queryRes?.success) {
            console.log(queryRes, 'response');

            for (let i = 0; i < users?.length; i++) {
                // Object.entries(global?.connectedSockets?.[users?.[i]] || {})?.forEach?.((socketConnection) => {
                //     socketConnection?.[1]?.join(groupId);
                // });

                actionOnAllSocketConnectionsOfAUser(users?.[i], (socketConnection: Socket) => {
                    socketConnection?.join(groupId);
                });
            }

            socket.to(groupId).emit(`addUsersInChatRoomBroadcast`, queryRes);
        }
        
    });

    socket.on(`removeUsersFromChatRoom`, async (users: Array<string>, groupId: string, token: string) => {
        console.log(users, 'removeUserFromChatRoom');

        const user = verifyJWTTokenAndSendAck(token, (socketConnection: Socket) => {
            global.socketIO?.to(socketConnection?.id)?.emit(`removeUsersFromChatRoomAck`, {
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN,
                success: false,
                emitter: (socket?.id === socketConnection?.id)
            })
        });

        if (!user?._id) {
            return;
        }

        const queryRes = await removeUsersFromGroupController(users, groupId, user?._id);

        // global.socketIO.to(socket.id).emit(`removeUsersFromChatRoomAck`, queryRes?.success, queryRes?.payload, users);
        actionOnAllSocketConnectionsOfAUser(user?._id, (socketConnection: Socket) => {
            global.socketIO.to(socketConnection?.id).emit(`removeUsersFromChatRoomAck`, {
                ...queryRes,
                payload: {
                    ...queryRes?.payload,
                    users
                }
            });
        });

        if (queryRes?.success) {
            for (let i = 0; i < users?.length; i++) {
                actionOnAllSocketConnectionsOfAUser(users?.[i], (socketConnection: Socket) => {
                    socketConnection?.leave(groupId);
                });
            }
            
            socket.to(groupId).emit(`removeUsersFromChatRoomBroadcast`, queryRes);
        }
        // console.log(res, 'response');
    });

    socket.on(`getAllChatMessages`, async (roomId: string, token: string) => {

        const user = verifyJWTTokenAndSendAck(token, (socketConnection: Socket) => {
            global.socketIO?.to(socketConnection?.id)?.emit(`getAllChatMessagesAck`, {
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN,
                success: false,
                emitter: (socket?.id === socketConnection?.id)
            })
        });

        if (!user?._id) {
            return;
        }

        const queryRes = await getAllChatMessagesController(roomId, user?._id);
        // global.socketIO.to(socket.id).emit('getAllChatMessagesAck', queryRes, roomId);
        // global.socketIO.to(socket.id).emit('getAllChatMessagesAck', {
        //     ...queryRes,
        //     payload: {
        //         ...queryRes?.payload,
        //         roomId
        //     }
        // });

        actionOnAllSocketConnectionsOfAUser(user?._id, (socketConnection: Socket) => {
            global.socketIO.to(socketConnection?.id).emit('getAllChatMessagesAck', {
                ...queryRes,
                payload: {
                    ...queryRes?.payload,
                    roomId
                }
            });
        });
    });

    socket.on(`newMessage`, async (message: string, roomId: string, token: string) => {
        const user = verifyJWTTokenAndSendAck(token, (socketConnection: Socket) => {
            global.socketIO?.to(socketConnection?.id)?.emit(`newMessageAck`, {
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN,
                success: false,
                emitter: (socket?.id === socketConnection?.id)
            })
        });

        if (!user?._id) {
            return;
        }

        const queryRes = await createNewMessageController(message, roomId, user);

        global.socketIO.to(socket?.id)?.emit(`newMessageAck`, {
            ...queryRes,
            emitter: true
        });

        if (queryRes?.success) {
            socket.to(roomId).emit('newMessageBroadcast', queryRes);
        }
    });

    socket.on(`editMessage`, async (message: string, messageId: string, roomId: string, token: string) => {
        const user = verifyJWTTokenAndSendAck(token, (socketConnection: Socket) => {
            global.socketIO?.to(socketConnection?.id)?.emit(`editMessageAck`, {
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN,
                success: false,
                emitter: (socket?.id === socketConnection?.id)
            })
        });

        if (!user?._id) {
            return;
        }

        const queryRes = await editMessageController(message, messageId, roomId, user);

        global.socketIO.to(socket?.id)?.emit(`editMessageAck`, {
            ...queryRes,
            emitter: true
        });

        if (queryRes?.success) {    
            socket.to(roomId).emit('editMessageBroadcast', queryRes);
        }
    });

    socket.on(`deleteMessage`, async (messageId: string, roomId: string, token: string) => {

        const user = verifyJWTTokenAndSendAck(token, (socketConnection: Socket) => {
            global.socketIO?.to(socketConnection?.id)?.emit(`deleteMessageAck`, {
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN,
                success: false,
                emitter: (socket?.id === socketConnection?.id)
            })
        });

        if (!user?._id) {
            return;
        }

        const queryRes = await deleteMessageController(messageId, roomId, user);

        global.socketIO.to(socket?.id)?.emit(`deleteMessageAck`, {
            ...queryRes,
            payload: {
                messageId,
                roomId
            },
            emitter: true
        });

        if (queryRes?.success) {
            socket.to(roomId).emit('deleteMessageBroadcast', {
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
        const user = verifyJWTTokenAndSendAck(token, (socketConnection: Socket) => {
            global.socketIO?.to(socketConnection?.id)?.emit(`likeOrUnlikeMessageAck`, {
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN,
                success: false,
                emitter: (socket?.id === socketConnection?.id)
            })
        });

        if (!user?._id) {
            return;
        }

        const queryRes = await likeOrUnlikeMessageController(messageId, roomId, action, user);

        console.log('likeOrUnlikeMessage', queryRes);
        
        global.socketIO.to(socket?.id)?.emit(`likeOrUnlikeMessageAck`, {
            ...queryRes,
            emitter: true
        });

        if (queryRes?.success) {
            socket.to(roomId).emit('likeOrUnlikeMessageBroadcast', queryRes);
        }
    });
};

export { establishChatRoomEvents };

