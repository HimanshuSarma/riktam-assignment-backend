import { NextFunction, Request, Response } from 'express';

import { verifyJWTToken } from './jwt/verifyToken.js';

import networkResponseErrors from '../staticData/networkResponseErrors.json' assert { type: 'json' };
import { UserModelType } from 'db/mongodb/models/User.js';

const extractDataAndCallVerifyToken = (reqObjOrTokenString: Request | string, res?: Response, next?: NextFunction): UserModelType | null => {
    let userPayload: any;
    if (typeof reqObjOrTokenString === 'string') {
        userPayload = verifyJWTToken(reqObjOrTokenString);
        return userPayload;
    } else {
        userPayload = verifyJWTToken(reqObjOrTokenString?.headers?.authorization?.split(' ')?.[1] as string);
        if (!userPayload) {
            res?.status(200).json({
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN
            });

            return null;
        }

        reqObjOrTokenString.user = userPayload;
        next();
        return null;
    }
};

export { extractDataAndCallVerifyToken };
