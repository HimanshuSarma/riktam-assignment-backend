import { z } from 'zod';
import { FlattenMaps, Document } from 'mongoose';

import { UserModelType } from '../../types/db/mongodb/models/User.js';
import { DocumentArrayOrErrorStringified, DocumentOrErrorStringified } from '../../types/db/mongodb/queryTypes.js'

import { addUsersInGroup } from '../../db/abstractedQueries/Group/addUsersInGroup.js';
import { getAllChatMessages } from '../../db/abstractedQueries/Chat/getAllChatMessages.js';

import { extractDataAndCallVerifyToken } from '../../utils/middlewareDataExtractorUtils.js';

import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: 'json' };
import { mongoErrors } from '../../staticData/mongodbErrors.js';

const validation = async (users: Array<string>, groupId: string) => {
    try {
        const schema = z.object({
            users: z.array(
                z.string({
                    required_error: `users array is not correct!`
                })
            ),
            groupId: z.string({
                required_error: 'Group id is required!'
            })
        })

        await schema.parseAsync({
            users,
            groupId
        });
        return {
            success: true
        };
    } catch (err) {
        return {
            success: true,
            errorMessage: err?.message
        };
    }
};


const addUsersInGroupController = async (users: Array<string>, groupId: string, token: string): Promise<{
    success: boolean,
    errorMessage?: any,
    payload?: {
        updatedChatRoom: Document<any>,
        chatMessages: Array<Document<any>> | string
    }
}> => {
    try {
        const isRequestValid = await validation(users, groupId);

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

        const updatedChatRoom: DocumentOrErrorStringified = await addUsersInGroup(users, groupId, user?._id);
        const chatMessages: DocumentArrayOrErrorStringified = await getAllChatMessages(groupId, user?._id);

        if (typeof updatedChatRoom === 'string') {
            const err = JSON.parse(updatedChatRoom);
            console.log(err, updatedChatRoom, 'errorObj')
            return {
                success: false,
                errorMessage: mongoErrors[(err?.code as number)] || err?.errorMessage
            }
        }

        if (updatedChatRoom) {
            return {
                success: true,
                payload: {
                    updatedChatRoom,
                    chatMessages
                }
            }
        } else {
            throw new Error();
        }
    } catch (err) {
        console.log(err, 'addUsersInGroupError');
        return {
            success: false,
            errorMessage: err?.message
        }
    }
};

export { addUsersInGroupController };

