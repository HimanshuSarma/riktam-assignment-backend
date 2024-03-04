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
import { createNewGroup } from '../../db/abstractedQueries/Group/createNewGroup.js';
import { mongoErrors } from '../../staticData/mongodbErrors.js';
const validation = ({ name, users }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = z.object({
            name: z.string({
                required_error: 'Name is required!'
            }),
            users: z.array(z.string({
                required_error: 'Please check the users array!'
            }))
        });
        yield schema.parseAsync({
            name,
            users,
        });
        return {
            success: true
        };
    }
    catch (err) {
        console.log(err, 'validationError');
        return {
            success: false,
            errorMessage: err === null || err === void 0 ? void 0 : err.message
        };
    }
});
const createGroupController = ({ name, users, user }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isRequestValid = yield validation({ name, users });
        if (!(isRequestValid === null || isRequestValid === void 0 ? void 0 : isRequestValid.success)) {
            return isRequestValid;
        }
        ;
        const newGroup = {
            name,
            users: users,
            isActive: true,
            admin: user === null || user === void 0 ? void 0 : user._id
        };
        const createdNewGroup = yield createNewGroup(newGroup);
        if (typeof createdNewGroup === 'string') {
            const err = JSON.parse(createdNewGroup);
            console.log(err, createdNewGroup, 'errorObj');
            return {
                success: false,
                errorMessage: mongoErrors[err === null || err === void 0 ? void 0 : err.code] || (err === null || err === void 0 ? void 0 : err.errorMessage)
            };
        }
        if (createdNewGroup === null || createdNewGroup === void 0 ? void 0 : createdNewGroup._id) {
            return {
                success: true,
                payload: createdNewGroup
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
export { createGroupController };
//# sourceMappingURL=createGroup.js.map