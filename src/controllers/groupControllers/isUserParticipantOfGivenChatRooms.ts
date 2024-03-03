import { ObjectId } from 'mongodb';

import { z } from 'zod';

import { fetchChatRoomsGivenArrayOfChatRooms } from '../../db/abstractedQueries/Group/fetchChatRoomsGivenArrayOfChatRooms.js';

import { UserModelType } from '../../types/db/mongodb/models/User.js';
import { DocumentArrayOrErrorStringified } from 'db/mongodb/queryTypes.js';

import { extractDataAndCallVerifyToken } from '../../utils/middlewareDataExtractorUtils.js';

import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: 'json' };

const validation = async (chatRooms: Array<string>, userId: string, token: string): Promise<{
    success: boolean,
    errorMessage?: any,
    payload?: any
}> => {
    try {
        const schema = z.object({
            userId: z.string({
                required_error: `User id is required!`
            }),
            chatRooms: z.array(
                z.string({
                    required_error: `Chatrooms should be an array of ids`
                })
            ),
            token: z.string({
                required_error: `Token is required!`
            })
        });

        await schema.parseAsync({
            userId,
            chatRooms,
            token
        });

        return {
            success: true
        }
    } catch (err) {
        return {
            success: false,
            errorMessage: err?.message
        }
    }
};

const isUserParticipantOfGivenChatRooms = async (chatRooms: Array<string>, userId: string, token: string): Promise<{
    success: boolean,
    errorMessage?: any,
    payload?: any
}> => {
    try {
        const isRequestValid = await validation(chatRooms, userId, token);

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

        let isUserParticipantOfGivenChatRooms: boolean = true;

        const fetchedChatRooms = await fetchChatRoomsGivenArrayOfChatRooms(chatRooms);

        if (typeof fetchedChatRooms === 'string') {
            const err = JSON.parse(fetchedChatRooms);
            console.log(err, fetchedChatRooms, 'errorObj')
            return {
                success: false,
                errorMessage: err?.errorMessage
            }
        };

        for (let i = 0; i < fetchedChatRooms?.length; i++) {
            let isUserContainedInUsersArr: boolean = false;
            for (let j = 0; j < fetchedChatRooms?.[i]?.users?.length; j++) {
                if (fetchedChatRooms?.[i]?.users[j]?.toString() === userId) {
                    isUserContainedInUsersArr = true;
                    break;
                }
            };

            if (fetchedChatRooms?.[i]?.admin?.toString() !== userId && !isUserContainedInUsersArr) {
                isUserParticipantOfGivenChatRooms = false;
                break;
            }
        }

        if (!isUserParticipantOfGivenChatRooms) {
            return {
                success: false,
                errorMessage: `You have to be a participant of all given chat rooms!`
            }
        } else {
            return {
                success: true
            }
        }
    } catch (err) {
        return {
            success: false,
            errorMessage: err?.message
        }
    }
};

export { isUserParticipantOfGivenChatRooms };