import { Document } from 'mongoose';

import { UserModelType } from '../../../types/db/mongodb/models/User.js';
import { PromiseDocumentOrErrorStringified } from '../../../types/db/mongodb/queryTypes.js';

import networkResponseErrors from '../../../staticData/networkResponseErrors.json' assert { type: 'json' };

const newUserSignup = async (userPayload: UserModelType): PromiseDocumentOrErrorStringified => {
    try {
        const createdUserInDb: Document<any> = await global.DBModels.USER.create(userPayload);

        if (!createdUserInDb?._id) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.RESOURCE_COULDNOT_BE_CREATED
            });
        }

        return createdUserInDb;
    } catch (err: any) {
        console.log(err, 'catcherror')
        return JSON.stringify(err);
    }
};

export { newUserSignup };