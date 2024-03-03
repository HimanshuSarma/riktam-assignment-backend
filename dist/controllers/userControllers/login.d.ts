import { Request, Response, NextFunction } from 'express';
declare const loginController: {
    validation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    handler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
export { loginController };
