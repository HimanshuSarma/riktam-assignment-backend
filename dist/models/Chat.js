import mongoose from 'mongoose';
const ChatModel = new mongoose.Schema({
    message: { type: mongoose.SchemaTypes.String, required: true },
    isEdited: { type: mongoose.SchemaTypes.Boolean, required: true, default: false },
    roomId: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'groups' },
    createdBy: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'users' },
    likes: [
        { type: mongoose.SchemaTypes.ObjectId, ref: 'users' }
    ],
    unlikes: [
        { type: mongoose.SchemaTypes.ObjectId, ref: 'users' }
    ]
}, { timestamps: true });
export { ChatModel };
//# sourceMappingURL=Chat.js.map