var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getAllGroupsAuth } from '../../db/abstractedQueries/Group/getAllGroupsAuth.js';
import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: "json" };
import { mongoErrors } from '../../staticData/mongodbErrors.js';
const getAllGroupsAuthController = {
    handler: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userPayload = req === null || req === void 0 ? void 0 : req.user;
            const fetchedAllGroups = yield getAllGroupsAuth(userPayload === null || userPayload === void 0 ? void 0 : userPayload._id);
            if (typeof fetchedAllGroups === 'string') {
                const err = JSON.parse(fetchedAllGroups);
                res.status(500).json({
                    errorMessage: mongoErrors[err === null || err === void 0 ? void 0 : err.code] || (err === null || err === void 0 ? void 0 : err.errorMessage)
                });
                return;
            }
            res.status(200).json({
                payload: {
                    groups: fetchedAllGroups
                }
            });
        }
        catch (err) {
            return res.status(500).json({
                errorMessage: networkResponseErrors.GENERAL_ERROR
            });
        }
    })
};
export { getAllGroupsAuthController };
//# sourceMappingURL=getAllGroupsAuth.js.map