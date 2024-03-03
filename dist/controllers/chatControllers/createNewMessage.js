var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { z } from 'zod';
import { createNewChatMessage } from '../../db/abstractedQueries/Chat/createNewChatMessage.js';
import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: 'json' };
import { extractDataAndCallVerifyToken } from '../../utils/middlewareDataExtractorUtils.js';
const validation = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = z.string({
            required_error: 'Message is required'
        })
            .min(1);
        yield schema.parseAsync(message);
        return {
            success: true
        };
    }
    catch (err) {
        return {
            success: false,
            errorMessage: err === null || err === void 0 ? void 0 : err.message
        };
    }
});
const createNewMessageController = (message, roomId, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isRequestValid = yield validation(message);
        if (!(isRequestValid === null || isRequestValid === void 0 ? void 0 : isRequestValid.success)) {
            return isRequestValid;
        }
        const user = extractDataAndCallVerifyToken(token);
        if (!(user === null || user === void 0 ? void 0 : user._id)) {
            return {
                success: false,
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN
            };
        }
        const newChatMessage = {
            message,
            isEdited: false,
            createdBy: user === null || user === void 0 ? void 0 : user._id,
            roomId,
            likes: [],
            unlikes: []
        };
        const createdNewChatMessage = yield createNewChatMessage(newChatMessage);
        if (typeof createdNewChatMessage === 'string') {
            const err = JSON.parse(createdNewChatMessage);
            console.log(err, createdNewChatMessage, 'errorObj');
            return {
                success: false,
                errorMessage: err === null || err === void 0 ? void 0 : err.errorMessage
            };
        }
        if (createdNewChatMessage === null || createdNewChatMessage === void 0 ? void 0 : createdNewChatMessage._id) {
            return {
                success: true,
                payload: createdNewChatMessage
            };
        }
        else {
            throw new Error();
        }
    }
    catch (err) {
        console.log(err, 'createGroupError');
        return {
            success: false,
            errorMessage: err === null || err === void 0 ? void 0 : err.message
        };
    }
});
export { createNewMessageController };
//# sourceMappingURL=createNewMessage.js.map