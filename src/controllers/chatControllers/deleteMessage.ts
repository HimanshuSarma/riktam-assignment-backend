import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

import { createNewChatMessage } from '../../db/abstractedQueries/Chat/createNewChatMessage.js';
import { editChatMessage } from '../../db/abstractedQueries/Chat/editMessage.js';
import { deleteChatMessage } from '../../db/abstractedQueries/Chat/deleteMessage.js';
import { isUserParticipantOfGivenChatRooms } from '../groupControllers/isUserParticipantOfGivenChatRooms.js';

import { ChatModelType } from '../../types/db/mongodb/models/Chat.js';
import { UserModelType } from '../../types/db/mongodb/models/User.js';
import { DocumentOrErrorStringified, DeleteDocumentOrErrorStringified } from '../../types/db/mongodb/queryTypes.js';

import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: 'json' };
import { mongoErrors } from '../../staticData/mongodbErrors.js';
import { verifyJWTToken } from '../../utils/jwt/verifyToken.js';
import { extractDataAndCallVerifyToken } from '../../utils/middlewareDataExtractorUtils.js';

const validation = async (messageId: string) => {
    try {
        // const schema = z.string({
        //     required_error: 'Message is required'
        // })
        // .min(1)

        const schema = z.object({
            messageId: z.string({
                required_error: 'Message id is required!'
            })
        })

        await schema.parseAsync({
            messageId,
        });

        return {
            success: true
        }
    } catch (err) {
        return {
            success: false,
            errorMessage: err?.message
        };
    }
}

const deleteMessageController = async (messageId: string, roomId: string, user: UserModelType): Promise<{
    success: boolean,
    errorMessage?: any,
    payload?: any
}> => {
    try {
        const isRequestValid = await validation(messageId);

        if (!isRequestValid?.success) {
            return isRequestValid;
        }

        const isUserParticipantOfChatRoom = await isUserParticipantOfGivenChatRooms([roomId], user?._id);

        if (!isUserParticipantOfChatRoom?.success) {
            return isUserParticipantOfChatRoom;
        }

        const deletedMessage: DeleteDocumentOrErrorStringified = await deleteChatMessage(messageId, user?._id);

        if (typeof deletedMessage === 'string') {
            const err = JSON.parse(deletedMessage);
            console.log(err, deletedMessage, 'errorObj')
            return {
                success: false,
                errorMessage: err?.errorMessage
            }
        }

        if (deletedMessage?.deletedCount === 1) {
            return {
                success: true,
            }
        } else {
            throw new Error();
        }
    } catch (err) {
        console.log(err, 'editMessageError');
        return {
            success: false,
            errorMessage: err?.message
        }
    }
}

export { deleteMessageController };