import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

import { createNewChatMessage } from '../../db/abstractedQueries/Chat/createNewChatMessage.js';
import { likeOrUnlikeChatMessage } from '../../db/abstractedQueries/Chat/likeOrUnlikeChatMessage.js';

import { ChatModelType } from '../../types/db/mongodb/models/Chat.js';
import { UserModelType } from '../../types/db/mongodb/models/User.js';
import { DocumentOrErrorStringified } from '../../types/db/mongodb/queryTypes.js';
import { ActionType } from '../../types/db/abstractedQueries/Chat/likeOrUnlikeChatMessage.js';

import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: 'json' };
import { mongoErrors } from '../../staticData/mongodbErrors.js';

import { verifyJWTToken } from '../../utils/jwt/verifyToken.js';
import { extractDataAndCallVerifyToken } from '../../utils/middlewareDataExtractorUtils.js';

const validation = async (messageId: string, roomId: string, action: ActionType, token: string) => {
    try {
        // const schema = z.string({
        //     required_error: 'Message is required'
        // })
        // .min(1)

        const schema = z.object({
            messageId: z.string({
                required_error: 'User id is required!'
            }),
            roomId: z.string({
                required_error: 'Room id is required!'
            }),
            action: z.enum(['like', 'unlike', 'removelike', 'removeunlike']),
            token: z.string({
                required_error: 'Token is required!'
            })
        })

        await schema.parseAsync({
            messageId,
            roomId,
            action,
            token
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

const likeOrUnlikeMessageController = async (messageId: string, roomId: string, action: ActionType, token: string): Promise<{
    success: boolean,
    errorMessage?: any,
    payload?: any
}> => {
    try {
        const isRequestValid = await validation(messageId, roomId, action, token);

        if (!isRequestValid?.success) {
            return isRequestValid;
        }

        const user: UserModelType = extractDataAndCallVerifyToken(token);

        if (!user?._id) {
            return {
                success: false,
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN
            }
        }

        const editedMessage: DocumentOrErrorStringified = await likeOrUnlikeChatMessage(messageId, roomId, user?._id, action);

        if (typeof editedMessage === 'string') {
            const err = JSON.parse(editedMessage);
            console.log(err, editedMessage, 'errorObj')
            return {
                success: false,
                errorMessage: err?.errorMessage
            }
        }

        if (editedMessage?._id) {
            return {
                success: true,
                payload: editedMessage
            }
        } else {
            throw new Error();
        }
    } catch (err) {
        console.log(err, 'likeOrUnlikeMessageError');
        return {
            success: false,
            errorMessage: err?.message
        }
    }
}

export { likeOrUnlikeMessageController };