import { Request, Response, NextFunction } from 'express';

import { z } from 'zod';

import { createNewGroup } from '../../db/abstractedQueries/Group/createNewGroup.js';

import { extractDataAndCallVerifyToken } from '../../utils/middlewareDataExtractorUtils.js';

import { GroupModelType } from '../../types/db/mongodb/models/Group.js';
import { DocumentOrErrorStringified } from '../../types/db/mongodb/queryTypes.js';
import { UserModelType } from '../../types/db/mongodb/models/User.js';

import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: 'json' };
import { mongoErrors } from '../../staticData/mongodbErrors.js';

const validation = async ({ name, users } : { name: string, users: Array<string> }): Promise<{
    success: boolean,
    errorMessage?: string
}> => {
    try {
        const schema = z.object({
            name: z.string({
                required_error: 'Name is required!'
            }),
            users: z.array(
                z.string({
                    required_error: 'Please check the users array!'
                })
            )
        });

        await schema.parseAsync({
            name,
            users,
        });

        return {
            success: true
        }
    } catch (err) {
        console.log(err, 'validationError');
        return {
            success: false,
            errorMessage: err?.message
        };
    }
};

const createGroupController = async ({ name, users, user } : { name: string, users: Array<string>, user: any }): Promise<{
    success: boolean,
    errorMessage?: string,
    payload?: any
}> => {
    try {

        const isRequestValid = await validation({ name, users });

        if (!isRequestValid?.success) {
            return isRequestValid;
        };

        const newGroup: GroupModelType = {
            name,
            users: users,
            isActive: true,
            admin: user?._id
        };

        const createdNewGroup: DocumentOrErrorStringified = await createNewGroup(newGroup);

        if (typeof createdNewGroup === 'string') {
            const err = JSON.parse(createdNewGroup);
            console.log(err, createdNewGroup, 'errorObj')
            return {
                success: false,
                errorMessage: mongoErrors[(err?.code as number)] || err?.errorMessage
            }
        }

        if (createdNewGroup?._id) {
            return {
                success: true,
                payload: createdNewGroup
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
};

export { createGroupController };