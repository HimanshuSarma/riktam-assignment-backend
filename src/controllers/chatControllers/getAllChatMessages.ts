import { Request, Response, NextFunction } from "express";
import { z, } from 'zod';

import { getAllChatMessages } from '../../db/abstractedQueries/Chat/getAllChatMessages.js';

import { UserModelType } from "../../types/db/mongodb/models/User.js";

import { extractDataAndCallVerifyToken } from "../../utils/middlewareDataExtractorUtils.js";

import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: 'json' };
import { mongoErrors } from "../../staticData/mongodbErrors.js";

const validation = async function (roomId: string, token: string) {
    try {
        const schema = z.object({
            roomId: z.string({
                required_error: `Room id is required!`
            }),
            token: z.string({
                required_error: `Token is required!`
            })
        })

        await schema.parseAsync({
            roomId,
            token
        });
        
        return {
            success: true,
        }
    } catch (err) {
        console.log(err, 'zodError')
        return {
            success: false,
            errorMessage: err?.message
        };
    }
};

const getAllChatMessagesController = async function (roomId: string, token: string): Promise<{
    success: boolean,
    errorMessage?: any,
    payload?: any
}> {
    try {
        const isRequestValid = await validation(roomId, token);
        console.log(isRequestValid, 'validity');
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

        const fetchedAllChatMessages = await getAllChatMessages(roomId, user?._id);

        if (typeof fetchedAllChatMessages === 'string') {
            const err = JSON.parse(fetchedAllChatMessages);
            return {
                success: false,
                errorMessage: mongoErrors[(err?.code as number)] || err?.errorMessage
            };;
        }

        return {
            success: true,
            payload: {
                chatMessages: fetchedAllChatMessages
            }
        };
    } catch (err) {
        return {
            success: false,
            errorMessage: err?.message
        };
    }
}

export { getAllChatMessagesController };