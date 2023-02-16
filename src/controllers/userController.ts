import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../model/user';


// [POST] /user/register
const createUser = (req: Request, res: Response, next: NextFunction) => {
    let { firstName, lastName, avatar, email, password, status, lastLogin } = req.body;

    

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        firstName,
        lastName,
        email,
        password,
        lastLogin,
        avatar,
        status
    });

    return user
        .save()
        .then((result) => {
            return res.status(201).json({
                user: result
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });

};

// [GET] /user/
const getAllUser = (req: Request, res: Response, next: NextFunction) => {
    User.find()
        .exec()
        .then((users) => {
            return res.status(200).json({
                users: users,
                count: users.length
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

export default { createUser, getAllUser };