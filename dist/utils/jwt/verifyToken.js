import jwt from 'jsonwebtoken';
const verifyJWTToken = (token) => {
    try {
        console.log(token);
        if (!token) {
            return null;
        }
        else {
            const userPayload = jwt.verify(token, process.env.jwt_signature);
            if (!userPayload) {
                return null;
            }
            else {
                return userPayload;
            }
        }
    }
    catch (err) {
        return null;
    }
};
export { verifyJWTToken };
//# sourceMappingURL=verifyToken.js.map