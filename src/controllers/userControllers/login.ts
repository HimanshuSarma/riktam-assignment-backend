import { Document, Error } from 'mongoose';

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import { z } from 'zod';

import { getUserByName } from '../../db/abstractedQueries/User/getUserByName.js';

import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: "json" };
import { mongoErrors } from '../../staticData/mongodbErrors.js';
import { UserSchemaType } from 'db/mongodb/models/User.js';

const loginController = {
    validation: async (req: Request, res: Response, next: NextFunction) => {
        console.log(req.body, 'request');
        try {
            const schema = z.object({
                body: z.object({
                    name: z.string({
                        required_error: 'Name is required!'
                    }),
                    password: z.string({
                        required_error: 'Password is required!'
                    })
                })
            });

            await schema.parseAsync({
                body: req.body
            });

            return next();
        } catch (err) {
            res.status(500).json({
                errorMessage: networkResponseErrors.INVALID_REQUEST
            });
        }
    },
    handler: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const fetchedNewUser: any | string = await getUserByName({
                name: req.body?.name
            });

            console.log(fetchedNewUser, 'fetchedNewUser');
            if (typeof fetchedNewUser === 'string') {
                const err = JSON.parse(fetchedNewUser);
                console.log(err, fetchedNewUser, 'errorObj')
                res.status(500).json({
                    errorMessage: mongoErrors[(err?.code as number)] || err?.errorMessage as string
                });
                return;
            }

            if (fetchedNewUser?._id) {
                const isPasswordMatched = await bcrypt.compare(req.body?.password, fetchedNewUser?.password);

                if (isPasswordMatched) {
                    const { password, ...rest } = fetchedNewUser;
                    res.status(200).json({
                        payload: {
                            user: rest,
                            token: JWT.sign(
                                rest,
                                process.env.jwt_signature,
                                {
                                    algorithm: 'HS256'
                                }
                            )
                        }
                    });
                } else {
                    res.status(500).json({
                        errorMessage: networkResponseErrors.INCORRECT_PASSWORD
                    });
                }
                
            } else {
                res.status(500).json({
                    errorMessage: networkResponseErrors.USER_DOESNOT_EXIST
                });
            }
        } catch (err) {
            console.log(err, 'loginError');
            res.status(500).json({
                errorMessage: networkResponseErrors.GENERAL_ERROR
            });
        }
    }
};

export { loginController };