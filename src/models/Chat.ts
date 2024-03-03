import mongoose from 'mongoose';

import { ChatSchemaType } from '../types/db/mongodb/models/Chat.js';

const ChatModel = new mongoose.Schema<ChatSchemaType>({
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