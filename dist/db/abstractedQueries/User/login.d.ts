import { NewUserSignup } from '../../../types/db/queries/User/signup.js';
import { PromiseDocumentOrErrorStringified } from '../../../types/db/mongodb/signup.js';
declare const getUserByName: (userPayload: NewUserSignup) => PromiseDocumentOrErrorStringified;
export { getUserByName };
