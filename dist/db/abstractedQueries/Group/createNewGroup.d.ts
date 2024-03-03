import { GroupModelType } from '../../../types/db/mongodb/models/Group.js';
import { PromiseDocumentOrErrorStringified } from '../../../types/db/mongodb/queryTypes.js';
declare const createNewGroup: (group: GroupModelType) => PromiseDocumentOrErrorStringified;
export { createNewGroup };
