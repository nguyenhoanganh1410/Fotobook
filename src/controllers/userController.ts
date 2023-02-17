import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../model/user';


// [POST] /user/signup
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    let { firstName, lastName, avatar, email, password, status, lastLogin } = req.body;
   
    // select only the adventures name and length
    const u = await User.findOne({ email }).exec();
   
    if(u){
        return res.status(400).json({
            message: 'User already exists'
        });
    }else{       
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            firstName,
            lastName,
            email,
            password,
            lastLogin: '',
            avatar : "",
            status : 1
        });
    
        return user
            .save()
            .then((result) => {
                res.redirect('pages/login')
            })
            .catch((error) => {
                return res.status(500).json({
                    message: error.message,
                    error
                });
            });
    }




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

const getUserByEmail = (req: Request, res: Response, next: NextFunction) => {
    
    const email = req.params.email
    User.findOne({email: email})
        .exec()
        .then((users) => {
            return res.status(200).json({
                users: users,
               
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
}

export default { createUser, getAllUser, getUserByEmail };