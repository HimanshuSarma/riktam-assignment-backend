import { NewUserSignup } from '../../types/db/queries/signup.js';
import { PromiseDocumentOrErrorStringified } from '../../types/db/mongodb/signup.js';
declare const newUserSignup: (userPayload: NewUserSignup) => PromiseDocumentOrErrorStringified;
export { newUserSignup };
