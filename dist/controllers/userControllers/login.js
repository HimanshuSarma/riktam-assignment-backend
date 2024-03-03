var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import { z } from 'zod';
import { getUserByName } from '../../db/abstractedQueries/User/getUserByName.js';
import networkResponseErrors from '../../staticData/networkResponseErrors.json' assert { type: "json" };
import { mongoErrors } from '../../staticData/mongodbErrors.js';
const loginController = {
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
                errorMessage: networkResponseErrors.INVALID_REQUEST
            });
        }
    }),
    handler: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const fetchedNewUser = yield getUserByName({
                name: (_a = req.body) === null || _a === void 0 ? void 0 : _a.name
            });
            console.log(fetchedNewUser, 'fetchedNewUser');
            if (typeof fetchedNewUser === 'string') {
                const err = JSON.parse(fetchedNewUser);
                console.log(err, fetchedNewUser, 'errorObj');
                res.status(500).json({
                    errorMessage: mongoErrors[err === null || err === void 0 ? void 0 : err.code] || (err === null || err === void 0 ? void 0 : err.errorMessage)
                });
                return;
            }
            if (fetchedNewUser === null || fetchedNewUser === void 0 ? void 0 : fetchedNewUser._id) {
                const isPasswordMatched = yield bcrypt.compare((_b = req.body) === null || _b === void 0 ? void 0 : _b.password, fetchedNewUser === null || fetchedNewUser === void 0 ? void 0 : fetchedNewUser.password);
                if (isPasswordMatched) {
                    const { password } = fetchedNewUser, rest = __rest(fetchedNewUser, ["password"]);
                    res.status(200).json({
                        payload: {
                            user: rest,
                            token: JWT.sign(rest, process.env.jwt_signature, {
                                algorithm: 'HS256'
                            })
                        }
                    });
                }
                else {
                    res.status(500).json({
                        errorMessage: networkResponseErrors.INCORRECT_PASSWORD
                    });
                }
            }
            else {
                res.status(500).json({
                    errorMessage: networkResponseErrors.USER_DOESNOT_EXIST
                });
            }
        }
        catch (err) {
            console.log(err, 'loginError');
            res.status(500).json({
                errorMessage: networkResponseErrors.GENERAL_ERROR
            });
        }
    })
};
export { loginController };
//# sourceMappingURL=login.js.map