import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: "json" };

const verifyJWTToken = (token: string) => {
    try {
        console.log(token);
        if (!token) {
            return null;
        } else {
            const userPayload = jwt.verify(token, process.env.jwt_signature);
            if (!userPayload) {
                return null;
            } else {
                return userPayload;
            }
        }
    } catch (err) {
        return null;
    }
};

export { verifyJWTToken };