import mongoose, { Schema } from 'mongoose';
import logging from '../config/logging/logging';

import IUser from '../interface/user';

const UserSchema: Schema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        status: { type: Boolean, required: true },
        lastLogin: { type: Date },
        avatar: { type: String},
        role:{type: String, require:true}
    },
    {
        timestamps: true
    }
);

UserSchema.post<IUser>('save', function () {
    logging.info('Mongo', 'Checkout the user: ', this);
});

export default mongoose.model<IUser>('User', UserSchema);