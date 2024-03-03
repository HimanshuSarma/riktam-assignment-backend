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
import { fetchChatRoomsGivenArrayOfChatRooms } from '../../db/abstractedQueries/Group/fetchChatRoomsGivenArrayOfChatRooms.js';
import { extractDataAndCallVerifyToken } from '../../utils/middlewareDataExtractorUtils.js';
import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: 'json' };
const validation = (chatRooms, userId, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = z.object({
            userId: z.string({
                required_error: `User id is required!`
            }),
            chatRooms: z.array(z.string({
                required_error: `Chatrooms should be an array of ids`
            })),
            token: z.string({
                required_error: `Token is required!`
            })
        });
        yield schema.parseAsync({
            userId,
            chatRooms,
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
const isUserParticipantOfGivenChatRooms = (chatRooms, userId, token) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const isRequestValid = yield validation(chatRooms, userId, token);
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
        let isUserParticipantOfGivenChatRooms = true;
        const fetchedChatRooms = yield fetchChatRoomsGivenArrayOfChatRooms(chatRooms);
        if (typeof fetchedChatRooms === 'string') {
            const err = JSON.parse(fetchedChatRooms);
            console.log(err, fetchedChatRooms, 'errorObj');
            return {
                success: false,
                errorMessage: err === null || err === void 0 ? void 0 : err.errorMessage
            };
        }
        ;
        for (let i = 0; i < (fetchedChatRooms === null || fetchedChatRooms === void 0 ? void 0 : fetchedChatRooms.length); i++) {
            let isUserContainedInUsersArr = false;
            for (let j = 0; j < ((_b = (_a = fetchedChatRooms === null || fetchedChatRooms === void 0 ? void 0 : fetchedChatRooms[i]) === null || _a === void 0 ? void 0 : _a.users) === null || _b === void 0 ? void 0 : _b.length); j++) {
                if (((_d = (_c = fetchedChatRooms === null || fetchedChatRooms === void 0 ? void 0 : fetchedChatRooms[i]) === null || _c === void 0 ? void 0 : _c.users[j]) === null || _d === void 0 ? void 0 : _d.toString()) === userId) {
                    isUserContainedInUsersArr = true;
                    break;
                }
            }
            ;
            if (((_f = (_e = fetchedChatRooms === null || fetchedChatRooms === void 0 ? void 0 : fetchedChatRooms[i]) === null || _e === void 0 ? void 0 : _e.admin) === null || _f === void 0 ? void 0 : _f.toString()) !== userId && !isUserContainedInUsersArr) {
                isUserParticipantOfGivenChatRooms = false;
                break;
            }
        }
        if (!isUserParticipantOfGivenChatRooms) {
            return {
                success: false,
                errorMessage: `You have to be a participant of all given chat rooms!`
            };
        }
        else {
            return {
                success: true
            };
        }
    }
    catch (err) {
        return {
            success: false,
            errorMessage: err === null || err === void 0 ? void 0 : err.message
        };
    }
});
export { isUserParticipantOfGivenChatRooms };
//# sourceMappingURL=isUserParticipantOfGivenChatRooms.js.map