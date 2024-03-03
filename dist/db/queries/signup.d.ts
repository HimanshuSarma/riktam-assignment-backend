import { NewUserSignup } from '../../types/db/queries/signup.js';
declare const newUserSignup: (userPayload: NewUserSignup) => Promise<void>;
export { newUserSignup };
