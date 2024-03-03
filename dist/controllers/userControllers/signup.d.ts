import { Request, Response, NextFunction } from 'express';
declare const signupController: {
    validation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    handler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
export { signupController };
