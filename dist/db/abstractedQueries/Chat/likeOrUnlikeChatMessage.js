var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import networkResponseErrors from '../../../staticData/networkResponseErrors.json' assert { type: 'json' };
import { ObjectId } from 'mongodb';
const likeOrUnlikeChatMessage = (messageId, roomId, userId, action) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(messageId, 'messageId');
        const updateObj = {};
        if (action === 'like') {
            updateObj[`$addToSet`] = {
                likes: new ObjectId(userId)
            };
        }
        else if (action === 'unlike') {
            updateObj[`$addToSet`] = {
                unlikes: new ObjectId(userId)
            };
        }
        else if (action === 'removelike') {
            updateObj[`$pull`] = {
                likes: new ObjectId(userId)
            };
        }
        else if (action === 'removeunlike') {
            updateObj[`$pull`] = {
                unlikes: new ObjectId(userId)
            };
        }
        const fetchedChatRoom = yield global.DBModels.GROUP.findOne({
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
        }).lean();
        console.log(fetchedChatRoom, messageId, action, `fetchedChatRoom`);
        const updatedChatMessageInDb = yield global.DBModels.CHAT.findOneAndUpdate({ _id: new ObjectId(messageId), roomId: fetchedChatRoom === null || fetchedChatRoom === void 0 ? void 0 : fetchedChatRoom._id }, updateObj, { new: true }).lean();
        if (!(updatedChatMessageInDb === null || updatedChatMessageInDb === void 0 ? void 0 : updatedChatMessageInDb._id)) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.RESOURCE_COULDNOT_BE_UPDATED
            });
        }
        console.log(updatedChatMessageInDb);
        return updatedChatMessageInDb;
    }
    catch (err) {
        // console.log(err, 'error')
        return JSON.stringify(err);
    }
});
export { likeOrUnlikeChatMessage };
//# sourceMappingURL=likeOrUnlikeChatMessage.js.map