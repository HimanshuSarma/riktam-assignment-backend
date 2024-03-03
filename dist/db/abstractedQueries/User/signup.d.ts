import { UserModelType } from '../../../types/db/mongodb/models/User.js';
import { PromiseDocumentOrErrorStringified } from '../../../types/db/mongodb/queryTypes.js';
declare const newUserSignup: (userPayload: UserModelType) => PromiseDocumentOrErrorStringified;
export { newUserSignup };
