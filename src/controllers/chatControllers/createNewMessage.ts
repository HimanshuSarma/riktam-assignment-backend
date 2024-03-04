import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

import { createNewChatMessage } from '../../db/abstractedQueries/Chat/createNewChatMessage.js';
import { isUserParticipantOfGivenChatRooms } from '../groupControllers/isUserParticipantOfGivenChatRooms.js';

import { ChatModelType } from '../../types/db/mongodb/models/Chat.js';
import { UserModelType } from '../../types/db/mongodb/models/User.js';
import { DocumentOrErrorStringified } from '../../types/db/mongodb/queryTypes.js';

import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: 'json' };
import { mongoErrors } from '../../staticData/mongodbErrors.js';

import { verifyJWTToken } from '../../utils/jwt/verifyToken.js';
import { extractDataAndCallVerifyToken } from '../../utils/middlewareDataExtractorUtils.js';

const validation = async (message: string) => {
    try {
        const schema = z.string({
            required_error: 'Message is required'
        })
        .min(1)

        await schema.parseAsync(message);
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

const createNewMessageController = async (message: string, roomId: string, user: UserModelType): Promise<{
    success: boolean,
    errorMessage?: any,
    payload?: any
}> => {
    try {
        const isRequestValid = await validation(message);

        if (!isRequestValid?.success) {
            return isRequestValid;
        }

        const newChatMessage: ChatModelType = {
            message,
            isEdited: false,
            createdBy: user?._id,
            roomId,
            likes: [],
            unlikes: []
        };

        const isUserParticipantOfChatRoom = await isUserParticipantOfGivenChatRooms([roomId], user?._id);

        if (!isUserParticipantOfChatRoom?.success) {
            return isUserParticipantOfChatRoom;
        }

        const createdNewChatMessage: DocumentOrErrorStringified = await createNewChatMessage(newChatMessage);

        if (typeof createdNewChatMessage === 'string') {
            const err = JSON.parse(createdNewChatMessage);
            console.log(err, createdNewChatMessage, 'errorObj')
            return {
                success: false,
                errorMessage: err?.errorMessage
            }
        }

        if (createdNewChatMessage?._id) {
            return {
                success: true,
                payload: createdNewChatMessage
            }
        } else {
            throw new Error();
        }
    } catch (err) {
        console.log(err, 'createGroupError');
        return {
            success: false,
            errorMessage: err?.message
        }
    }
}

export { createNewMessageController };