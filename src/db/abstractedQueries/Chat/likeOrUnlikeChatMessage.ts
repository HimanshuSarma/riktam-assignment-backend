import { Document } from 'mongoose';

import { ChatModelType } from '../../../types/db/mongodb/models/Chat.js';
import { PromiseDocumentOrErrorStringified } from '../../../types/db/mongodb/queryTypes.js';
import { UpdateObjType, ActionType } from '../../../types/db/abstractedQueries/Chat/likeOrUnlikeChatMessage.js';

import networkResponseErrors from '../../../staticData/networkResponseErrors.json' assert { type: 'json' };
import { ObjectId } from 'mongodb';



const likeOrUnlikeChatMessage = async (messageId: string, roomId: string, userId: string, action: ActionType): PromiseDocumentOrErrorStringified => {
    try {
        console.log(messageId, 'messageId');
        const updateObj: UpdateObjType = {};

        if (action === 'like') {
            updateObj[`$addToSet`] = {
                likes: new ObjectId(userId)
            }
        } else if (action === 'unlike') {
            updateObj[`$addToSet`] = {
                unlikes: new ObjectId(userId)
            }
        } else if (action === 'removelike') {
            updateObj[`$pull`] = {
                likes: new ObjectId(userId)
            }
        } else if (action === 'removeunlike') {
            updateObj[`$pull`] = {
                unlikes: new ObjectId(userId)
            }
        }

        const fetchedChatRoom: Document<any> = await global.DBModels.GROUP.findOne(
            {
                _id: new ObjectId(roomId),
                $or: [
                    {
                        admin: new ObjectId(userId)
                    },
                    {
                        users: {
                            $in: new ObjectId(userId)
                        }
                    }
                ]
            }
        ).lean();

        console.log(fetchedChatRoom, messageId, action, `fetchedChatRoom`);

        const updatedChatMessageInDb: Document<any> = await global.DBModels.CHAT.findOneAndUpdate(
            { _id: new ObjectId(messageId), roomId: fetchedChatRoom?._id },
            updateObj,
            { new: true }
        ).lean();

        if (!updatedChatMessageInDb?._id) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.RESOURCE_COULDNOT_BE_UPDATED
            });
        }

        console.log(updatedChatMessageInDb);
        return updatedChatMessageInDb;
    } catch (err: any) {
        // console.log(err, 'error')
        return JSON.stringify(err);
    }
};

export { likeOrUnlikeChatMessage };