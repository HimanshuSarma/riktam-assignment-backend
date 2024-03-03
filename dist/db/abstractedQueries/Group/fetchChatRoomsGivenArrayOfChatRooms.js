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
const fetchChatRoomsGivenArrayOfChatRooms = (chatRooms) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchedChatRooms = yield global.DBModels.GROUP.find({
            _id: {
                $in: chatRooms === null || chatRooms === void 0 ? void 0 : chatRooms.map((chatRoom) => {
                    return new ObjectId(chatRoom);
                })
            }
        }).lean();
        console.log(fetchedChatRooms, 'fetchedChatRooms');
        if (!fetchedChatRooms) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.RESOURCE_DOESNOT_EXIST
            });
        }
        return fetchedChatRooms;
    }
    catch (err) {
        // console.log(err, 'error')
        return JSON.stringify(err);
    }
});
export { fetchChatRoomsGivenArrayOfChatRooms };
//# sourceMappingURL=fetchChatRoomsGivenArrayOfChatRooms.js.map