import { Document } from 'mongoose';

import { ChatModelType } from '../../../types/db/mongodb/models/Chat.js';
import { PromiseDocumentOrErrorStringified } from '../../../types/db/mongodb/queryTypes.js';

import networkResponseErrors from '../../../staticData/networkResponseErrors.json' assert { type: 'json' };
import { ObjectId } from 'mongodb';

const editChatMessage = async (message: string, messageId: string, userId: string): PromiseDocumentOrErrorStringified => {
    try {
        console.log(message, 'message');
        const createdChatMessageInDb: Document<any> = await global.DBModels.CHAT.findOneAndUpdate(
            { _id: new ObjectId(messageId), createdBy: new ObjectId(userId) },
            {
                message,
                isEdited: true
            },
            { new: true }
        ).lean();

        if (!createdChatMessageInDb?._id) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.RESOURCE_COULDNOT_BE_UPDATED
            });
        }

        console.log(createdChatMessageInDb);
        return createdChatMessageInDb;
    } catch (err: any) {
        // console.log(err, 'error')
        return JSON.stringify(err);
    }
};

export { editChatMessage };