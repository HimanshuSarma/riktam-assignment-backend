import { Socket } from "socket.io"

const actionOnAllSocketConnectionsOfAUser = (userId: string, cb: (socket: Socket) => void) => {
    Object.entries(global?.connectedSockets?.[userId] || {})?.forEach?.((socketConnection) => {
        cb?.(socketConnection?.[1]);
    });
};

export { actionOnAllSocketConnectionsOfAUser };