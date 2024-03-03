import { Document, Error } from 'mongoose';

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';

import { newUserSignup } from '../../db/abstractedQueries/User/signup.js';

import { DocumentOrErrorStringified } from '../../types/db/mongodb/queryTypes.js';
import { UserSchemaType, UserModelType } from '../../types/db/mongodb/models/User.js';

import errorMessages from '../../staticData/networkResponseErrors.json' assert { type: "json" };
import { mongoErrors } from '../../staticData/mongodbErrors.js';

const signupController = {
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
                errorMessage: errorMessages.INVALID_REQUEST
            });
        }
    },
    handler: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newUser: UserModelType = {
                name: req.body.name,
                password: await bcrypt.hash(req.body.password, 10)
            }
            const createNewUser: DocumentOrErrorStringified = await newUserSignup(newUser);
            if (typeof createNewUser === 'string') {
                const err = JSON.parse(createNewUser);
                console.log(err, 'errorObj')
                res.status(500).json({
                    errorMessage: mongoErrors[(err?.code as number)] || err?.errorMessage
                });
                return;
            }

            if (createNewUser._id) {
                res.status(200).json({
                    payload: {
                        user: createNewUser
                    }
                })
            }
        } catch (err) {
            res.status(500).json({
                errorMessage: errorMessages.GENERAL_ERROR
            });
        }
    }
};

export { signupController };