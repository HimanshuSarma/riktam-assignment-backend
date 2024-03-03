var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getAllUsers } from '../../db/abstractedQueries/User/getAllUsers.js';
import { mongoErrors } from '../../staticData/mongodbErrors.js';
import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: 'json' };
const getAllUsersController = {
    handler: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const fetchedAllUsers = yield getAllUsers();
        if (typeof fetchedAllUsers === 'string') {
            const err = JSON.parse(fetchedAllUsers);
            res.status(500).json({
                error: mongoErrors[err === null || err === void 0 ? void 0 : err.code] || networkResponseErrors.GENERAL_ERROR
            });
            return;
        }
        res.status(200).json({
            payload: {
                users: fetchedAllUsers
            }
        });
    })
};
export { getAllUsersController };
//# sourceMappingURL=getAllUsers.js.map