import mongoose from "mongoose";
import { UserModel } from "../../models/User.js";
import { ChatModel } from "../../models/Chat.js";
import { GroupModel } from "../../models/Group.js";
const connectDB = () => {
    const dbConnection = mongoose.createConnection(process.env.mongodb_connection_uri);
    dbConnection.on('connected', () => {
        console.log('DB connected');
        // All models defined here starts...
        const dbModels = {
            USER: dbConnection.model('User', UserModel),
            CHAT: dbConnection.model('Chat', ChatModel),
            GROUP: dbConnection.model('Group', GroupModel)
        };
        // All models defined here ends...
        global.DBModels = dbModels;
    });
};
export { connectDB };
//# sourceMappingURL=createConnection.js.map