import "express"; // Modifies global namespace, so include it!
import { Server } from 'socket.io';

import { DBModel } from './types/db/connectionTypes.js';
import { ConnectedSocketsType } from './types/socket/socketTypes.js';



declare global {
    namespace Express {
        interface Request {
            token: string,
            UserID: string,
            user: any
        }
    }

    /* Global variables follow. They *must* use var to work.
        and cannot be initialized here. */

    // eslint-disable-next-line no-var
    var DBModels: DBModel;
    var socketIO: Server;
    var connectedSockets: ConnectedSocketsType
}

export { };