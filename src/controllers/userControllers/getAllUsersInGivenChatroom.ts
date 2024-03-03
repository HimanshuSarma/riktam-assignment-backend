import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { getAllUsersInGivenChatRoom } from '../../db/abstractedQueries/User/getAllUsersInGivenChatroom.js';

import { mongoErrors } from '../../staticData/mongodbErrors.js';
import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: 'json' };

const getAllUsersInGivenChatRoomController = {
    validation: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const schema = z.object({
                roomId: z.string({
                    required_error: 'Room id is required!'
                })
            });

            await schema.parseAsync({
                roomId: req?.query?.roomId
            });

            next();
        } catch (err) {
            return res?.status(500).json({
                errorMessage: networkResponseErrors.INVALID_REQUEST
            });
        }
    },
    handler: async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('allUsersInGivenChatRoom')
            const roomId: string = req?.query?.roomId as string;

            const allUsersInGivenChatRoom = await getAllUsersInGivenChatRoom(roomId);

            if (typeof allUsersInGivenChatRoom === 'string') {
                const err = JSON.parse(allUsersInGivenChatRoom);
                return res.status(500).json({
                    error: mongoErrors[(err?.code as number)] || err?.errorMessage
                });
            }

            res.status(200).json({
                payload: allUsersInGivenChatRoom
            })
        } catch (err) {
            return res?.status(500).json({
                errorMessage: networkResponseErrors.GENERAL_ERROR
            });
        }
    }
};

export { getAllUsersInGivenChatRoomController };