import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

interface ChatSchemaType {
    _id: mongoose.Types.ObjectId,
    message: string,
    isEdited: boolean,
    roomId: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    likes: mongoose.Types.Array<ObjectId>,
    unlikes: mongoose.Types.Array<ObjectId>,
};

interface ChatModelType {
    _id?: string,
    message: string,
    isEdited: boolean,
    roomId: string,
    createdBy: string,
    likes: Array<string>,
    unlikes: Array<string>
}

export type { ChatSchemaType, ChatModelType };