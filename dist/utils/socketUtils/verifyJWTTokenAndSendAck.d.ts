import { Socket } from "socket.io";
import { UserModelType } from "../../types/db/mongodb/models/User.js";
declare const verifyJWTTokenAndSendAck: (token: string, cb: (socket: Socket) => void) => UserModelType;
export { verifyJWTTokenAndSendAck };
