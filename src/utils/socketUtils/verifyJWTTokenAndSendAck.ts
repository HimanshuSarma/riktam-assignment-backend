import { Socket } from "socket.io";

import { UserModelType } from "../../types/db/mongodb/models/User.js";

import { extractDataAndCallVerifyToken } from "../middlewareDataExtractorUtils.js";
import { actionOnAllSocketConnectionsOfAUser } from "./actionOnAllSocketConnectionsOfAUser.js";

const verifyJWTTokenAndSendAck = (token: string, cb: (socket: Socket) => void) => {
    const user: UserModelType = extractDataAndCallVerifyToken(token);

    if (!user?._id) {
        // actionOnAllSocketConnectionsOfAUser(user?._id, (socket: Socket) => {
        //     global.socketIO?.to(socket?.id)?.emit(`addChatRoomAck`, {
        //         errorMessage: `Token is not valid!`
        //     })
        // });

        actionOnAllSocketConnectionsOfAUser(user?._id, cb);

        return null;
    } else {
        return user;
    }
};

export { verifyJWTTokenAndSendAck };