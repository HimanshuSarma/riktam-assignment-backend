import { Document } from 'mongoose';

import { PromiseDocumentArrayOrErrorStringified } from '../../../types/db/mongodb/queryTypes.js';

import networkResponseErrors from '../../../staticData/networkResponseErrors.json' assert { type: 'json' };

const getAllUsers = async (): PromiseDocumentArrayOrErrorStringified => {
    try {
        const allUsersInDb: Array<Document<any>> = await global.DBModels.USER.find().lean();

        if (!allUsersInDb) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.RESOURCE_DOESNOT_EXIST
            });
        }

        return allUsersInDb;
    } catch (err: any) {
        // console.log(err, 'error')
        return JSON.stringify(err);
    }
};

export { getAllUsers };