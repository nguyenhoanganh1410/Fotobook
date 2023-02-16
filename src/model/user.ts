import mongoose, { Schema } from 'mongoose';
import logging from '../config/logging/logging';

import IUser from '../interface/user';

const UserSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        author: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

UserSchema.post<IUser>('save', function () {
    logging.info('Mongo', 'Checkout the book we just saved: ', this);
});

export default mongoose.model<IUser>('User', UserSchema);