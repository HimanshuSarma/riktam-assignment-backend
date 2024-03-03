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
const getUserByName = (userPayload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdUserInDb = yield global.DBModels.USER.findOne({
            name: userPayload.name,
        }).lean();
        if (!(createdUserInDb === null || createdUserInDb === void 0 ? void 0 : createdUserInDb._id)) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.USER_DOESNOT_EXIST
            });
        }
        else {
            return createdUserInDb;
        }
    }
    catch (err) {
        console.log(JSON.stringify(err), typeof err, err === null || err === void 0 ? void 0 : err.message, 'errorgetuserbyname');
        return JSON.stringify(err);
    }
});
export { getUserByName };
//# sourceMappingURL=getUserByName.js.map