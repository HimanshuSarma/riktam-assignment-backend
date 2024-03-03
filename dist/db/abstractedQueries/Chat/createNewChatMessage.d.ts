import { ChatModelType } from '../../../types/db/mongodb/models/Chat.js';
import { PromiseDocumentOrErrorStringified } from '../../../types/db/mongodb/queryTypes.js';
declare const createNewChatMessage: (chatMessage: ChatModelType) => PromiseDocumentOrErrorStringified;
export { createNewChatMessage };
