import { Document } from 'mongoose';

import { GetUserByNameType } from '../../../types/db/queries/User/getUserByName.js';
import { PromiseDocumentOrErrorStringified } from '../../../types/db/mongodb/queryTypes.js';

import networkResponseErrors from '../../../staticData/networkResponseErrors.json' assert { type: 'json' };

const getUserByName = async (userPayload: GetUserByNameType): PromiseDocumentOrErrorStringified => {
    try {
        const createdUserInDb: Document<any> = await global.DBModels.USER.findOne({
            name: userPayload.name,
        }).lean();

        if (!createdUserInDb?._id) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.USER_DOESNOT_EXIST
            });
        } else {
            return createdUserInDb;
        }
    } catch (err: any) {
        console.log(JSON.stringify(err), typeof err, err?.message, 'errorgetuserbyname');
        return JSON.stringify(err);
    }
};

export { getUserByName };