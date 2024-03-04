import { Socket } from "socket.io";

interface UserToSocketConnectionType {
    [key: string]: Socket
};

interface ConnectedSocketsType {
    [key: string]: UserToSocketConnectionType
};

export type { ConnectedSocketsType };