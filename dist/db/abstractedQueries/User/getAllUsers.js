var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import networkResponseErrors from '../../../staticData/networkResponseErrors.json' assert { type: 'json' };
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsersInDb = yield global.DBModels.USER.find().lean();
        if (!allUsersInDb) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.RESOURCE_DOESNOT_EXIST
            });
        }
        return allUsersInDb;
    }
    catch (err) {
        // console.log(err, 'error')
        return JSON.stringify(err);
    }
});
export { getAllUsers };
//# sourceMappingURL=getAllUsers.js.map