var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ObjectId } from 'mongodb';
import networkResponseErrors from '../../../staticData/networkResponseErrors.json' assert { type: 'json' };
const getAllChatMessages = (roomId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('getAllChatMessages', roomId, userId);
        const fetchedGroup = yield global.DBModels.GROUP.findOne({
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
        }).lean();
        const fetchedAllChatMessagesInDb = yield global.DBModels.CHAT.aggregate([
            {
                $match: {
                    roomId: (fetchedGroup === null || fetchedGroup === void 0 ? void 0 : fetchedGroup._id),
                }
            },
            {
                $sort: {
                    createdAt: 1
                }
            }
        ]);
        if (!fetchedAllChatMessagesInDb) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.RESOURCE_DOESNOT_EXIST
            });
        }
        return fetchedAllChatMessagesInDb;
    }
    catch (err) {
        return JSON.stringify(err);
    }
});
export { getAllChatMessages };
//# sourceMappingURL=getAllChatMessages.js.map