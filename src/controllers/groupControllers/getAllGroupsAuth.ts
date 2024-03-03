import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { getAllGroupsAuth } from '../../db/abstractedQueries/Group/getAllGroupsAuth.js';

import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: "json" };
import { mongoErrors } from '../../staticData/mongodbErrors.js';


const getAllGroupsAuthController = {
    handler: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userPayload = req?.user;
            const fetchedAllGroups = await getAllGroupsAuth(userPayload?._id);

            if (typeof fetchedAllGroups === 'string') {
                const err = JSON.parse(fetchedAllGroups);
                res.status(500).json({
                    errorMessage: mongoErrors[(err?.code as number)] || err?.errorMessage
                });
                return;
            }

            res.status(200).json({
                payload: {
                    groups: fetchedAllGroups
                }
            });
        } catch (err) {
            return res.status(500).json({
                errorMessage: networkResponseErrors.GENERAL_ERROR
            });
        }
    }
};

export { getAllGroupsAuthController }