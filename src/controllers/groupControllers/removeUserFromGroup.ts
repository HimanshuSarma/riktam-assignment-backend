import { z } from 'zod';

import { UserModelType } from '../../types/db/mongodb/models/User.js';
import { DocumentOrErrorStringified } from '../../types/db/mongodb/queryTypes.js'

import { removeUsersFromGroup } from '../../db/abstractedQueries/Group/removeUserFromGroup.js';

import { extractDataAndCallVerifyToken } from '../../utils/middlewareDataExtractorUtils.js';

import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: 'json' };
import { mongoErrors } from '.././../staticData/mongodbErrors.js';

const validation = async (users: Array<string>, groupId: string) => {
    try {
        const schema = z.object({
            users: z.array(
                z.string({
                    required_error: `User id is required!`
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


const removeUsersFromGroupController = async (users: Array<string>, groupId: string, userId: string): Promise<{
    success: boolean,
    errorMessage?: any,
    payload?: any
}> => {
    try {
        console.log('removeUsers', users);
        const isRequestValid = await validation(users, groupId);
        console.log('removeUsers', users);

        if (!isRequestValid?.success) {
            return isRequestValid;
        }

        const removedUserFromGroup: DocumentOrErrorStringified = await removeUsersFromGroup(users, groupId, userId);

        if (typeof removedUserFromGroup === 'string') {
            const err = JSON.parse(removedUserFromGroup);
            console.log(err, removedUserFromGroup, 'errorObj')
            return {
                success: false,
                errorMessage: mongoErrors[(err?.code as number)] || err?.errorMessage
            }
        }

        if (removedUserFromGroup) {
            return {
                success: true,
                payload: {
                    updatedChatRoom: removedUserFromGroup
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

export { removeUsersFromGroupController };

