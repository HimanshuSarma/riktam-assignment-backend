import { Request, Response, NextFunction } from 'express';
import { Document, Error } from 'mongoose';

import { getAllUsers } from '../../db/abstractedQueries/User/getAllUsers.js';
import { mongoErrors } from '../../staticData/mongodbErrors.js';
import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: 'json' };

const getAllUsersController = {
    handler: async (req: Request, res: Response, next: NextFunction) => {
        const fetchedAllUsers: Array<Document<any>> | string = await getAllUsers();

        if (typeof fetchedAllUsers === 'string') {
            const err = JSON.parse(fetchedAllUsers);
            res.status(500).json({
                error: mongoErrors[(err?.code as number)] || networkResponseErrors.GENERAL_ERROR
            });
            return;
        }

        res.status(200).json({
            payload: {
                users: fetchedAllUsers
            }
        });
    }
}

export { getAllUsersController };