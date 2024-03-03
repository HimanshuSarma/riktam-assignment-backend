import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

import { PromiseDocumentArrayOrErrorStringified } from '../../../types/db/mongodb/queryTypes.js';
import { GroupModelType } from '../../../types/db/mongodb/models/Group.js';

import networkResponseErrors from '../../../staticData/networkResponseErrors.json' assert { type: 'json' };

const fetchChatRoomsGivenArrayOfChatRooms = async (chatRooms: Array<string>) => {
    try {
        const fetchedChatRooms = await global.DBModels.GROUP.find(
            { 
                _id: {
                    $in: chatRooms?.map((chatRoom: string) => {
                        return new ObjectId(chatRoom);
                    })
                }
            }
        ).lean();

        console.log(fetchedChatRooms, 'fetchedChatRooms')
        
        if (!fetchedChatRooms) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.RESOURCE_DOESNOT_EXIST
            });
        }

        return fetchedChatRooms;
    } catch (err: any) {
        // console.log(err, 'error')
        return JSON.stringify(err);
    }
};

export { fetchChatRoomsGivenArrayOfChatRooms };