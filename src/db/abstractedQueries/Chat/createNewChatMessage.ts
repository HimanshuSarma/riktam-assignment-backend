import { Document } from 'mongoose';

import { ChatModelType } from '../../../types/db/mongodb/models/Chat.js';
import { PromiseDocumentOrErrorStringified } from '../../../types/db/mongodb/queryTypes.js';

import networkResponseErrors from '../../../staticData/networkResponseErrors.json' assert { type: 'json' };

const createNewChatMessage = async (chatMessage: ChatModelType): PromiseDocumentOrErrorStringified => {
    try {
        console.log(chatMessage, 'chatMessage');
        const createdChatMessageInDb: Document<any> = await global.DBModels.CHAT.create(chatMessage);

        if (!createdChatMessageInDb?._id) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.RESOURCE_COULDNOT_BE_CREATED
            });
        }

        console.log(createdChatMessageInDb);
        return createdChatMessageInDb;
    } catch (err: any) {
        // console.log(err, 'error')
        return JSON.stringify(err);
    }
};

export { createNewChatMessage };