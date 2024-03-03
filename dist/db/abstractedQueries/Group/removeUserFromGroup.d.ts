import { PromiseDocumentOrErrorStringified } from '../../../types/db/mongodb/queryTypes.js';
declare const removeUsersFromGroup: (users: Array<string>, groupId: string, admin: string) => PromiseDocumentOrErrorStringified;
export { removeUsersFromGroup };
