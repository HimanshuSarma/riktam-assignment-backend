import { NextFunction, Request, Response } from 'express';

import { verifyJWTToken } from './jwt/verifyToken.js';

import networkResponseErrors from '../staticData/networkResponseErrors.json' assert { type: 'json' };

const extractDataAndCallVerifyToken = (reqObjOrTokenString: Request | string, res?: Response, next?: NextFunction): any => {
    let userPayload: any;
    if (typeof reqObjOrTokenString === 'string') {
        userPayload = verifyJWTToken(reqObjOrTokenString);
        return userPayload;
    } else {
        userPayload = verifyJWTToken(reqObjOrTokenString?.headers?.authorization?.split(' ')?.[1] as string);
        if (!userPayload) {
            return res?.status(200).json({
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN
            })
        }

        reqObjOrTokenString.user = userPayload;
        next();
    }
};

export { extractDataAndCallVerifyToken };
