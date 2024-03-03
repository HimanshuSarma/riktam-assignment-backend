import { Request, Response, NextFunction } from 'express';
declare const getAllUsersController: {
    handler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
export { getAllUsersController };
