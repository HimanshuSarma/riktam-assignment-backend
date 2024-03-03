import { GetUserByNameType } from '../../../types/db/queries/User/getUserByName.js';
import { PromiseDocumentOrErrorStringified } from '../../../types/db/mongodb/queryTypes.js';
declare const getUserByName: (userPayload: GetUserByNameType) => PromiseDocumentOrErrorStringified;
export { getUserByName };
