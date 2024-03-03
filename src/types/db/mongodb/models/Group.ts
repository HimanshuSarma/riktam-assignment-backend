import mongoose, { ObjectId, Types, mongo } from 'mongoose';

interface GroupSchemaType {
    name: string,
    users: Array<mongoose.Types.ObjectId>,
    isActive: boolean,
    admin: mongoose.Types.ObjectId,
};

interface GroupModelType {
    name: string,
    users: Array<string>,
    isActive: boolean,
    admin: string,
}

export type { GroupSchemaType, GroupModelType };