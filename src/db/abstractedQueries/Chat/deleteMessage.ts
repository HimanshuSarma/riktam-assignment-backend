import { Document } from 'mongoose';
import { DeleteResult } from 'mongodb';

import { ChatModelType } from '../../../types/db/mongodb/models/Chat.js';
import { PromiseDocumentOrErrorStringified } from '../../../types/db/mongodb/queryTypes.js';
import { PromiseDeleteDocumentOrErrorStringified } from '../../../types/db/mongodb/queryTypes.js';

import networkResponseErrors from '../../../staticData/networkResponseErrors.json' assert { type: 'json' };
import { ObjectId } from 'mongodb';

const deleteChatMessage = async (messageId: string, userId: string): PromiseDeleteDocumentOrErrorStringified => {
    try {
        const deletedMessageInDb: DeleteResult = await global.DBModels.CHAT.deleteOne(
            { _id: new ObjectId(messageId), createdBy: new ObjectId(userId) }
        ).lean();

        console.log(deletedMessageInDb, 'deleteQuery');

        if (deletedMessageInDb?.deletedCount !== 1) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.RESOURCE_COULDNOT_BE_DELETED
            });
        }

        console.log(deletedMessageInDb);
        return deletedMessageInDb;
    } catch (err: any) {
        // console.log(err, 'error')
        return JSON.stringify(err);
    }
};

export { deleteChatMessage };