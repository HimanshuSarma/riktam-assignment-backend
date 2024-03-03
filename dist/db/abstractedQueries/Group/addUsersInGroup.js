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
const addUsersInGroup = (users, groupId, admin) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(users, 'users');
        const addedUsersInGroup = yield global.DBModels.GROUP.findOneAndUpdate({
            _id: new ObjectId(groupId),
            $and: [
                {
                    admin: new ObjectId(admin)
                },
                {
                    admin: {
                        $nin: users === null || users === void 0 ? void 0 : users.map((user) => {
                            return new ObjectId(user);
                        })
                    }
                }
            ]
        }, {
            $addToSet: {
                users
            }
        }, { new: true }).lean();
        console.log(addedUsersInGroup);
        return addedUsersInGroup;
    }
    catch (err) {
        // console.log(err, 'error')
        return JSON.stringify(err);
    }
});
export { addUsersInGroup };
//# sourceMappingURL=addUsersInGroup.js.map