import { verifyJWTToken } from '../jwt/verifyToken';
const extractDataAndCallVerifyToken = (reqObjOrTokenString, res, next) => {
    var _a, _b, _c;
    let userPayload;
    if (typeof reqObjOrTokenString === 'string') {
        userPayload = verifyJWTToken(reqObjOrTokenString);
        return userPayload;
    }
    else {
        userPayload = verifyJWTToken((_c = (_b = (_a = reqObjOrTokenString === null || reqObjOrTokenString === void 0 ? void 0 : reqObjOrTokenString.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')) === null || _c === void 0 ? void 0 : _c[1]);
        reqObjOrTokenString.user = userPayload;
    }
};
export { extractDataAndCallVerifyToken };
//# sourceMappingURL=middlewareDataExtractorUtils.js.map