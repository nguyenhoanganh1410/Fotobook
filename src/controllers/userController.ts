import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../model/user';


// [POST] /user/
const createUser = (req: Request, res: Response, next: NextFunction) => {
    let { author, title } = req.body;

    const book = new User({
        _id: new mongoose.Types.ObjectId(),
        author,
        title
    });

    return book
        .save()
        .then((result) => {
            return res.status(201).json({
                book: result
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
        .then((books) => {
            return res.status(200).json({
                books: books,
                count: books.length
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