var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { z, } from 'zod';
import { getAllChatMessages } from '../../db/abstractedQueries/Chat/getAllChatMessages.js';
import { extractDataAndCallVerifyToken } from "../../utils/middlewareDataExtractorUtils.js";
import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: 'json' };
import { mongoErrors } from "../../staticData/mongodbErrors.js";
const validation = function (roomId, token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const schema = z.object({
                roomId: z.string({
                    required_error: `Room id is required!`
                }),
                token: z.string({
                    required_error: `Token is required!`
                })
            });
            yield schema.parseAsync({
                roomId,
                token
            });
            return {
                success: true,
            };
        }
        catch (err) {
            console.log(err, 'zodError');
            return {
                success: false,
                errorMessage: err === null || err === void 0 ? void 0 : err.message
            };
        }
    });
};
const getAllChatMessagesController = function (roomId, token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isRequestValid = yield validation(roomId, token);
            console.log(isRequestValid, 'validity');
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
            const fetchedAllChatMessages = yield getAllChatMessages(roomId, user === null || user === void 0 ? void 0 : user._id);
            if (typeof fetchedAllChatMessages === 'string') {
                const err = JSON.parse(fetchedAllChatMessages);
                return {
                    success: false,
                    errorMessage: mongoErrors[err === null || err === void 0 ? void 0 : err.code] || (err === null || err === void 0 ? void 0 : err.errorMessage)
                };
                ;
            }
            return {
                success: true,
                payload: {
                    chatMessages: fetchedAllChatMessages
                }
            };
        }
        catch (err) {
            return {
                success: false,
                errorMessage: err === null || err === void 0 ? void 0 : err.message
            };
        }
    });
};
export { getAllChatMessagesController };
//# sourceMappingURL=getAllChatMessages.js.map