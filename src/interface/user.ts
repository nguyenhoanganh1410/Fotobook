import { Document } from 'mongoose';

export default interface IUser extends Document {
    title: string;
    author: string;
}