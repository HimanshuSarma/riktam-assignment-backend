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
const deleteChatMessage = (messageId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedMessageInDb = yield global.DBModels.CHAT.deleteOne({ _id: new ObjectId(messageId), createdBy: new ObjectId(userId) }).lean();
        console.log(deletedMessageInDb, 'deleteQuery');
        if ((deletedMessageInDb === null || deletedMessageInDb === void 0 ? void 0 : deletedMessageInDb.deletedCount) !== 1) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.RESOURCE_COULDNOT_BE_DELETED
            });
        }
        console.log(deletedMessageInDb);
        return deletedMessageInDb;
    }
    catch (err) {
        // console.log(err, 'error')
        return JSON.stringify(err);
    }
});
export { deleteChatMessage };
//# sourceMappingURL=deleteMessage.js.map