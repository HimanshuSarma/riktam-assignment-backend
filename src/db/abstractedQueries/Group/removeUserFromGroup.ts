import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

import { PromiseDocumentOrErrorStringified } from '../../../types/db/mongodb/queryTypes.js';

import networkResponseErrors from '../../../staticData/networkResponseErrors.json' assert { type: 'json' };

const removeUsersFromGroup = async (users: Array<string>, groupId: string, admin: string): PromiseDocumentOrErrorStringified => {
    try {
        console.log(users, 'removeUsersFromGroup');
        const removedUserFromGroupInDb: Document<any> = await global.DBModels.GROUP.findOneAndUpdate(
            { 
                _id: new ObjectId(groupId),
                $and: [
                    {
                        admin: new ObjectId(admin)
                    },
                    {
                        admin: {
                            $nin: users?.map((user: string) => {
                                return new ObjectId(user);
                            })
                        }
                    }
                ]
            },
            {
                $pull: {
                    users: {
                        $in: users?.map((user: string) => {
                            return new ObjectId(user);
                        })
                    } 
                }
            },
            { new: true }
        ).lean();

        if (!removedUserFromGroupInDb?._id) {
            return JSON.stringify({
                errorMessage: networkResponseErrors.GENERAL_ERROR
            });
        } else {
            return removedUserFromGroupInDb;
        }
    } catch (err: any) {
        // console.log(err, 'error')
        return JSON.stringify(err);
    }
};

export { removeUsersFromGroup };