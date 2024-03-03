import { ActionType } from '../../types/db/abstractedQueries/Chat/likeOrUnlikeChatMessage.js';
declare const likeOrUnlikeMessageController: (messageId: string, roomId: string, action: ActionType, token: string) => Promise<{
    success: boolean;
    errorMessage?: any;
    payload?: any;
}>;
export { likeOrUnlikeMessageController };
