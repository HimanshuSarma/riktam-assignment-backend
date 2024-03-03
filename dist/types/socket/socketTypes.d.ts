import { Socket } from "socket.io";
interface ConnectedSocketsType {
    [key: string]: Socket;
}
export type { ConnectedSocketsType };
