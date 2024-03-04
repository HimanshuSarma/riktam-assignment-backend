import { extractDataAndCallVerifyToken } from "../middlewareDataExtractorUtils.js";
import { actionOnAllSocketConnectionsOfAUser } from "./actionOnAllSocketConnectionsOfAUser.js";
const verifyJWTTokenAndSendAck = (token, cb) => {
    const user = extractDataAndCallVerifyToken(token);
    if (!(user === null || user === void 0 ? void 0 : user._id)) {
        // actionOnAllSocketConnectionsOfAUser(user?._id, (socket: Socket) => {
        //     global.socketIO?.to(socket?.id)?.emit(`addChatRoomAck`, {
        //         errorMessage: `Token is not valid!`
        //     })
        // });
        actionOnAllSocketConnectionsOfAUser(user === null || user === void 0 ? void 0 : user._id, cb);
        return null;
    }
    else {
        return user;
    }
};
export { verifyJWTTokenAndSendAck };
//# sourceMappingURL=verifyJWTTokenAndSendAck.js.map