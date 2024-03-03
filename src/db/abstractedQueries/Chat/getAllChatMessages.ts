import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

import networkResponseErrors from '../../../staticData/networkResponseErrors.json' assert { type: 'json' };

const getAllChatMessages = async (roomId: string, userId: string) => {
    try {

        console.log('getAllChatMessages', roomId, userId);

        const fetchedGroup: Document<any> = await global.DBModels.GROUP.findOne(
            { 
                $and: [
                    {
                        _id: new ObjectId(roomId),
                        $or: [
                            {
                                admin: new ObjectId(userId)
                            },
                            {
                                users: {
                                    $in: [new ObjectId(userId)]
                                }
                            }
                        ]
                    }
                ]
            }
        ).lean();

        const fetchedAllChatMessagesInDb: Array<Document<any>> = await global.DBModels.CHAT.aggregate(
            [
                {
                    $match: {
                        roomId: (fetchedGroup?._id), 
                    }
                },
                {
                    $sort: {
                        createdAt: 1
                    }
                }
            ]
        );

        if (!fetchedAllChatMessagesInDb) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.RESOURCE_DOESNOT_EXIST
            });
        }

        return fetchedAllChatMessagesInDb;
    } catch (err) {
        return JSON.stringify(err);
    }
};

export { getAllChatMessages };