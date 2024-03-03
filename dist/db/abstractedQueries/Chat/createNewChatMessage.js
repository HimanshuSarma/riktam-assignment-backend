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
const createNewChatMessage = (chatMessage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(chatMessage, 'chatMessage');
        const createdChatMessageInDb = yield global.DBModels.CHAT.create(chatMessage);
        if (!(createdChatMessageInDb === null || createdChatMessageInDb === void 0 ? void 0 : createdChatMessageInDb._id)) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.RESOURCE_COULDNOT_BE_CREATED
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
export { createNewChatMessage };
//# sourceMappingURL=createNewChatMessage.js.map