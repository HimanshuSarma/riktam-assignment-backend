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
const editChatMessage = (message, messageId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(message, 'message');
        const createdChatMessageInDb = yield global.DBModels.CHAT.findOneAndUpdate({ _id: new ObjectId(messageId), createdBy: new ObjectId(userId) }, {
            message,
            isEdited: true
        }, { new: true }).lean();
        if (!(createdChatMessageInDb === null || createdChatMessageInDb === void 0 ? void 0 : createdChatMessageInDb._id)) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.RESOURCE_COULDNOT_BE_UPDATED
            });
        }
        console.log(createdChatMessageInDb);
        return createdChatMessageInDb;
    }
    catch (err) {
        // console.log(err, 'error')
        return JSON.stringify(err);
    }
});
export { editChatMessage };
//# sourceMappingURL=editMessage.js.map