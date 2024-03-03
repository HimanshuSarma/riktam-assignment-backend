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
import { getAllUsersInGivenChatRoom } from '../../db/abstractedQueries/User/getAllUsersInGivenChatroom.js';
import { mongoErrors } from '../../staticData/mongodbErrors.js';
import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: 'json' };
const getAllUsersInGivenChatRoomController = {
    validation: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const schema = z.object({
                roomId: z.string({
                    required_error: 'Room id is required!'
                })
            });
            yield schema.parseAsync({
                roomId: (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.roomId
            });
            next();
        }
        catch (err) {
            return res === null || res === void 0 ? void 0 : res.status(500).json({
                errorMessage: networkResponseErrors.INVALID_REQUEST
            });
        }
    }),
    handler: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            console.log('allUsersInGivenChatRoom');
            const roomId = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.roomId;
            const allUsersInGivenChatRoom = yield getAllUsersInGivenChatRoom(roomId);
            if (typeof allUsersInGivenChatRoom === 'string') {
                const err = JSON.parse(allUsersInGivenChatRoom);
                return res.status(500).json({
                    error: mongoErrors[err === null || err === void 0 ? void 0 : err.code] || (err === null || err === void 0 ? void 0 : err.errorMessage)
                });
            }
            res.status(200).json({
                payload: allUsersInGivenChatRoom
            });
        }
        catch (err) {
            return res === null || res === void 0 ? void 0 : res.status(500).json({
                errorMessage: networkResponseErrors.GENERAL_ERROR
            });
        }
    })
};
export { getAllUsersInGivenChatRoomController };
//# sourceMappingURL=getAllUsersInGivenChatroom.js.map