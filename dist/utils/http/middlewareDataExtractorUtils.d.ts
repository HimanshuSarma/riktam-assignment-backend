import { NextFunction, Request, Response } from 'express';
declare const extractDataAndCallVerifyToken: (reqObjOrTokenString: Request | string, res?: Response, next?: NextFunction) => string | import("jsonwebtoken").JwtPayload;
export { extractDataAndCallVerifyToken };
