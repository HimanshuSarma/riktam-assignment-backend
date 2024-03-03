import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

import { PromiseDocumentArrayOrErrorStringified } from '../../../types/db/mongodb/queryTypes.js';

import networkResponseErrors from '../../../staticData/networkResponseErrors.json' assert { type: 'json' };

const getAllUsersInGivenChatRoom = async (roomId: string): PromiseDocumentArrayOrErrorStringified => {
    try {

        console.log('allUsersInGivenChatRoomInDb');

        const allUsersInGivenChatRoomInDb: Array<Document<any>> = await global.DBModels.GROUP.findOne(
            { _id: new ObjectId(roomId) }
        ).lean().populate(['users', 'admin']).select({ 'users': 1, 'admin': 1 });

        console.log('allUsersInGivenChatRoomInDbErrorOrData', allUsersInGivenChatRoomInDb);

        if (!allUsersInGivenChatRoomInDb) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.RESOURCE_DOESNOT_EXIST
            });
        }

        return allUsersInGivenChatRoomInDb;
    } catch (err: any) {
        console.log(err, 'error')
        return JSON.stringify(err);
    }
};

export { getAllUsersInGivenChatRoom };