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
import { likeOrUnlikeChatMessage } from '../../db/abstractedQueries/Chat/likeOrUnlikeChatMessage.js';
import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: 'json' };
import { extractDataAndCallVerifyToken } from '../../utils/middlewareDataExtractorUtils.js';
const validation = (messageId, roomId, action, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const schema = z.string({
        //     required_error: 'Message is required'
        // })
        // .min(1)
        const schema = z.object({
            messageId: z.string({
                required_error: 'User id is required!'
            }),
            roomId: z.string({
                required_error: 'Room id is required!'
            }),
            action: z.enum(['like', 'unlike', 'removelike', 'removeunlike']),
            token: z.string({
                required_error: 'Token is required!'
            })
        });
        yield schema.parseAsync({
            messageId,
            roomId,
            action,
            token
        });
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
const likeOrUnlikeMessageController = (messageId, roomId, action, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isRequestValid = yield validation(messageId, roomId, action, token);
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
        const editedMessage = yield likeOrUnlikeChatMessage(messageId, roomId, user === null || user === void 0 ? void 0 : user._id, action);
        if (typeof editedMessage === 'string') {
            const err = JSON.parse(editedMessage);
            console.log(err, editedMessage, 'errorObj');
            return {
                success: false,
                errorMessage: err === null || err === void 0 ? void 0 : err.errorMessage
            };
        }
        if (editedMessage === null || editedMessage === void 0 ? void 0 : editedMessage._id) {
            return {
                success: true,
                payload: editedMessage
            };
        }
        else {
            throw new Error();
        }
    }
    catch (err) {
        console.log(err, 'likeOrUnlikeMessageError');
        return {
            success: false,
            errorMessage: err === null || err === void 0 ? void 0 : err.message
        };
    }
});
export { likeOrUnlikeMessageController };
//# sourceMappingURL=likeMessage.js.map