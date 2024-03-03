import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

import { createNewChatMessage } from '../../db/abstractedQueries/Chat/createNewChatMessage.js';
import { editChatMessage } from '../../db/abstractedQueries/Chat/editMessage.js';

import { ChatModelType } from '../../types/db/mongodb/models/Chat.js';
import { UserModelType } from '../../types/db/mongodb/models/User.js';
import { DocumentOrErrorStringified } from '../../types/db/mongodb/queryTypes.js';

import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: 'json' };
import { mongoErrors } from '../../staticData/mongodbErrors.js';
import { verifyJWTToken } from '../../utils/jwt/verifyToken.js';
import { extractDataAndCallVerifyToken } from '../../utils/middlewareDataExtractorUtils.js';

const validation = async (message: string, messageId: string, token: string) => {
    try {
        // const schema = z.string({
        //     required_error: 'Message is required'
        // })
        // .min(1)

        const schema = z.object({
            message: z.string({
                required_error: 'Message is required!'
            }),
            messageId: z.string({
                required_error: 'Message id is required!'
            }),
            token: z.string({
                required_error: 'Token is required!'
            })
        })

        await schema.parseAsync({
            message,
            messageId,
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

const editMessageController = async (message: string, messageId: string, token: string): Promise<{
    success: boolean,
    errorMessage?: any,
    payload?: any
}> => {
    try {
        const isRequestValid = await validation(message, messageId, token);

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

        const editedMessage: DocumentOrErrorStringified = await editChatMessage(message, messageId, user?._id);

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
        console.log(err, 'editMessageError');
        return {
            success: false,
            errorMessage: err?.message
        }
    }
}

export { editMessageController };