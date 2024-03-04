import { UserModelType } from '../../types/db/mongodb/models/User.js';
declare const createNewMessageController: (message: string, roomId: string, user: UserModelType) => Promise<{
    success: boolean;
    errorMessage?: any;
    payload?: any;
}>;
export { createNewMessageController };
