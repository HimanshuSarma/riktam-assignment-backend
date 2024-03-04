import { UserModelType } from '../../types/db/mongodb/models/User.js';
declare const deleteMessageController: (messageId: string, roomId: string, user: UserModelType) => Promise<{
    success: boolean;
    errorMessage?: any;
    payload?: any;
}>;
export { deleteMessageController };
