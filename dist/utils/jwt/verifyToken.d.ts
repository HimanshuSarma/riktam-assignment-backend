import jwt from 'jsonwebtoken';
declare const verifyJWTToken: (token: string) => string | jwt.JwtPayload;
export { verifyJWTToken };
