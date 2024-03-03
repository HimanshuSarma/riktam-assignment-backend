import { PromiseDocumentOrErrorStringified } from '../../../types/db/mongodb/queryTypes.js';
import { ActionType } from '../../../types/db/abstractedQueries/Chat/likeOrUnlikeChatMessage.js';
declare const likeOrUnlikeChatMessage: (messageId: string, roomId: string, userId: string, action: ActionType) => PromiseDocumentOrErrorStringified;
export { likeOrUnlikeChatMessage };
