var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { newUserSignup } from '../../db/abstractedQueries/User/signup.js';
import errorMessages from '../../staticData/networkResponseErrors.json' assert { type: "json" };
import { mongoErrors } from '../../staticData/mongodbErrors.js';
const signupController = {
    validation: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.body, 'request');
        try {
            const schema = z.object({
                body: z.object({
                    name: z.string({
                        required_error: 'Name is required!'
                    }),
                    password: z.string({
                        required_error: 'Password is required!'
                    })
                })
            });
            yield schema.parseAsync({
                body: req.body
            });
            return next();
        }
        catch (err) {
            res.status(500).json({
                errorMessage: errorMessages.INVALID_REQUEST
            });
        }
    }),
    handler: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newUser = {
                name: req.body.name,
                password: yield bcrypt.hash(req.body.password, 10)
            };
            const createNewUser = yield newUserSignup(newUser);
            if (typeof createNewUser === 'string') {
                const err = JSON.parse(createNewUser);
                console.log(err, 'errorObj');
                res.status(500).json({
                    errorMessage: mongoErrors[err === null || err === void 0 ? void 0 : err.code] || (err === null || err === void 0 ? void 0 : err.errorMessage)
                });
                return;
            }
            if (createNewUser._id) {
                res.status(200).json({
                    payload: {
                        user: createNewUser
                    }
                });
            }
        }
        catch (err) {
            res.status(500).json({
                errorMessage: errorMessages.GENERAL_ERROR
            });
        }
    })
};
export { signupController };
//# sourceMappingURL=signup.js.map