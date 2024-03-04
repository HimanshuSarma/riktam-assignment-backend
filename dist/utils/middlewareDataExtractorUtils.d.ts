import { NextFunction, Request, Response } from 'express';
import { UserModelType } from 'db/mongodb/models/User.js';
declare const extractDataAndCallVerifyToken: (reqObjOrTokenString: Request | string, res?: Response, next?: NextFunction) => UserModelType | null;
export { extractDataAndCallVerifyToken };
