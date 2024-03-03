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
import { removeUsersFromGroup } from '../../db/abstractedQueries/Group/removeUserFromGroup.js';
import { extractDataAndCallVerifyToken } from '../../utils/middlewareDataExtractorUtils.js';
import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: 'json' };
import { mongoErrors } from '.././../staticData/mongodbErrors.js';
const validation = (users, groupId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = z.object({
            users: z.array(z.string({
                required_error: `User id is required!`
            })),
            groupId: z.string({
                required_error: 'Group id is required!'
            })
        });
        yield schema.parseAsync({
            users,
            groupId
        });
        return {
            success: true
        };
    }
    catch (err) {
        return {
            success: true,
            errorMessage: err === null || err === void 0 ? void 0 : err.message
        };
    }
});
const removeUsersFromGroupController = (users, groupId, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('removeUsers', users);
        const isRequestValid = yield validation(users, groupId);
        console.log('removeUsers', users);
        if (!(isRequestValid === null || isRequestValid === void 0 ? void 0 : isRequestValid.success)) {
            return isRequestValid;
        }
        const userData = extractDataAndCallVerifyToken(token);
        if (!(userData === null || userData === void 0 ? void 0 : userData._id)) {
            return {
                success: false,
                errorMessage: networkResponseErrors.INCORRECT_AUTH_TOKEN
            };
        }
        const removedUserFromGroup = yield removeUsersFromGroup(users, groupId, userData === null || userData === void 0 ? void 0 : userData._id);
        if (typeof removedUserFromGroup === 'string') {
            const err = JSON.parse(removedUserFromGroup);
            console.log(err, removedUserFromGroup, 'errorObj');
            return {
                success: false,
                errorMessage: mongoErrors[err === null || err === void 0 ? void 0 : err.code] || (err === null || err === void 0 ? void 0 : err.errorMessage)
            };
        }
        if (removedUserFromGroup) {
            return {
                success: true,
                payload: {
                    updatedChatRoom: removedUserFromGroup
                }
            };
        }
        else {
            throw new Error();
        }
    }
    catch (err) {
        console.log(err, 'addUsersInGroupError');
        return {
            success: false,
            errorMessage: err === null || err === void 0 ? void 0 : err.message
        };
    }
});
export { removeUsersFromGroupController };
//# sourceMappingURL=removeUserFromGroup.js.map