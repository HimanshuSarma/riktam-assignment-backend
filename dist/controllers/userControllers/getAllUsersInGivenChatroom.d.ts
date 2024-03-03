import { Request, Response, NextFunction } from 'express';
declare const getAllUsersInGivenChatRoomController: {
    validation: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
    handler: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
};
export { getAllUsersInGivenChatRoomController };
