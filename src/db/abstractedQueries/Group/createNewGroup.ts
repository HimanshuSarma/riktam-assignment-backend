import { Document } from 'mongoose';

import { GroupModelType } from '../../../types/db/mongodb/models/Group.js';
import { PromiseDocumentOrErrorStringified } from '../../../types/db/mongodb/queryTypes.js';

const createNewGroup = async (group: GroupModelType): PromiseDocumentOrErrorStringified => {
    try {
        console.log(group, 'newGroup');
        const createdGroupInDb: Document<any> = await global.DBModels.GROUP.create(group);
        console.log(createdGroupInDb);
        return createdGroupInDb;
    } catch (err: any) {
        // console.log(err, 'error')
        return JSON.stringify(err);
    }
};

export { createNewGroup };