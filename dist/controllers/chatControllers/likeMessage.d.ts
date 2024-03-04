import { UserModelType } from '../../types/db/mongodb/models/User.js';
import { ActionType } from '../../types/db/abstractedQueries/Chat/likeOrUnlikeChatMessage.js';
declare const likeOrUnlikeMessageController: (messageId: string, roomId: string, action: ActionType, user: UserModelType) => Promise<{
    success: boolean;
    errorMessage?: any;
    payload?: any;
}>;
export { likeOrUnlikeMessageController };
