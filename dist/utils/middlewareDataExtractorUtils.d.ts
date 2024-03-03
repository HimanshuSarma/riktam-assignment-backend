import { NextFunction, Request, Response } from 'express';
declare const extractDataAndCallVerifyToken: (reqObjOrTokenString: Request | string, res?: Response, next?: NextFunction) => any;
export { extractDataAndCallVerifyToken };
