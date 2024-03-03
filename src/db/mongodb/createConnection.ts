import mongoose, { Connection, Model } from "mongoose";

import { UserModel } from "../../models/User.js";
import { ChatModel } from "../../models/Chat.js";
import { GroupModel } from "../../models/Group.js";

import { DBModel } from "../../types/db/connectionTypes.js";

const connectDB = () => {
    const dbConnection: Connection = mongoose.createConnection(process.env.mongodb_connection_uri as string);
    dbConnection.on('connected', () => {
        console.log('DB connected');
        // All models defined here starts...
        const dbModels: DBModel = {
            USER: dbConnection.model('User', UserModel),
            CHAT: dbConnection.model('Chat', ChatModel),
            GROUP: dbConnection.model('Group', GroupModel)
        };
        // All models defined here ends...
    
        global.DBModels = dbModels;
    });
};

export { connectDB };