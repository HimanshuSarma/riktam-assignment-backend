import mongoose, { mongo } from "mongoose";

interface UserSchemaType {
    _id: mongoose.Types.ObjectId,
    name: string,
    password: string
};

interface UserModelType {
    _id?: string,
    name: string,
    password: string
};

export type { UserSchemaType, UserModelType };