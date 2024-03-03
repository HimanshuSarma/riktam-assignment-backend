import { NextFunction } from 'express';
import mongoose, { Error } from 'mongoose';

import { UserSchemaType } from '../types/db/mongodb/models/User.js';

const UserModel = new mongoose.Schema<UserSchemaType>({
    _id: { type: mongoose.SchemaTypes.ObjectId, required: true },
    name: { type: mongoose.SchemaTypes.String, required: true, unique: true },
    password: { type: mongoose.SchemaTypes.String, required: true }
}, 
{ 
    timestamps: true 
});

// UserModel.post('save', (err: Error, doc: Document, next: NextFunction) => {
//     console.log(err.message, 'saveError');
//     if (err.name) 
//         next(new Error(err.message));
//     else next(err);
// });

export { UserModel };