import { Socket } from "socket.io";
declare const actionOnAllSocketConnectionsOfAUser: (userId: string, cb: (socket: Socket) => void) => void;
export { actionOnAllSocketConnectionsOfAUser };
