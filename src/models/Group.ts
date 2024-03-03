import mongoose, { Model, ObjectId, mongo } from 'mongoose';

import { GroupSchemaType } from '../types/db/mongodb/models/Group.js';

const GroupModel = new mongoose.Schema<GroupSchemaType, Model<GroupSchemaType>>({
    name: { type: mongoose.SchemaTypes.String, unique: true, required: true },
    users: [
        { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true }
    ],
    isActive: { type: mongoose.SchemaTypes.Boolean, required: true, default: true },
    admin: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export { GroupModel };