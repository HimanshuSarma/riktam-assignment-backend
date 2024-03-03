import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

import { PromiseDocumentOrErrorStringified } from '../../../types/db/mongodb/queryTypes.js';

const addUsersInGroup = async (users: Array<string>, groupId: string, admin: string): PromiseDocumentOrErrorStringified => {
    try {
        console.log(users, 'users');
        const addedUsersInGroup: Document<any> = await global.DBModels.GROUP.findOneAndUpdate(
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
                $addToSet: {
                    users
                }
            },
            { new: true }
        ).lean();
        console.log(addedUsersInGroup);
        return addedUsersInGroup;
    } catch (err: any) {
        // console.log(err, 'error')
        return JSON.stringify(err);
    }
};

export { addUsersInGroup };