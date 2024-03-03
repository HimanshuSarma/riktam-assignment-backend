import mongoose from 'mongoose';
const UserModel = new mongoose.Schema({
    _id: { type: mongoose.SchemaTypes.ObjectId, required: true },
    name: { type: mongoose.SchemaTypes.String, required: true, unique: true },
    password: { type: mongoose.SchemaTypes.String, required: true }
}, {
    timestamps: true
});
// UserModel.post('save', (err: Error, doc: Document, next: NextFunction) => {
//     console.log(err.message, 'saveError');
//     if (err.name) 
//         next(new Error(err.message));
//     else next(err);
// });
export { UserModel };
//# sourceMappingURL=User.js.map