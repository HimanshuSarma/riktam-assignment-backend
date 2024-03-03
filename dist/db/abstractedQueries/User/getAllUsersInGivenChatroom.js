var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ObjectId } from 'mongodb';
import networkResponseErrors from '../../../staticData/networkResponseErrors.json' assert { type: 'json' };
const getAllUsersInGivenChatRoom = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('allUsersInGivenChatRoomInDb');
        const allUsersInGivenChatRoomInDb = yield global.DBModels.GROUP.findOne({ _id: new ObjectId(roomId) }).lean().populate(['users', 'admin']).select({ 'users': 1, 'admin': 1 });
        console.log('allUsersInGivenChatRoomInDbErrorOrData', allUsersInGivenChatRoomInDb);
        if (!allUsersInGivenChatRoomInDb) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.RESOURCE_DOESNOT_EXIST
            });
        }
        return allUsersInGivenChatRoomInDb;
    }
    catch (err) {
        console.log(err, 'error');
        return JSON.stringify(err);
    }
});
export { getAllUsersInGivenChatRoom };
//# sourceMappingURL=getAllUsersInGivenChatroom.js.map