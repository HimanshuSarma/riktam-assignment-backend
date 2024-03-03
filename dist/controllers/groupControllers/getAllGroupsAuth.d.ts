import { NextFunction, Request, Response } from 'express';
declare const getAllGroupsAuthController: {
    handler: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
};
export { getAllGroupsAuthController };
