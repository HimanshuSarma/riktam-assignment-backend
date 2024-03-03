import { ObjectId } from 'mongodb';

import networkResponseErrors from '../../../staticData/networkResponseErrors.json' assert { type: 'json' };

const getAllGroupsAuth = async (userId: string) => {
    try {
        const allGroupsAuthInDb = await global.DBModels.GROUP.find({
            $or: [
                {
                    users: {
                        $in: new ObjectId(userId)
                    },
                },
                {
                    admin: new ObjectId(userId)
                }
            ]
            
        });

        if (!allGroupsAuthInDb) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.RESOURCE_DOESNOT_EXIST
            });
        }

        return allGroupsAuthInDb;
    } catch (err) {
        return JSON.stringify(err);
    }
    
};

export { getAllGroupsAuth };