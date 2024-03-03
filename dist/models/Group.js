import mongoose from 'mongoose';
const GroupModel = new mongoose.Schema({
    name: { type: mongoose.SchemaTypes.String, unique: true, required: true },
    users: [
        { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true }
    ],
    isActive: { type: mongoose.SchemaTypes.Boolean, required: true, default: true },
    admin: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
export { GroupModel };
//# sourceMappingURL=Group.js.map