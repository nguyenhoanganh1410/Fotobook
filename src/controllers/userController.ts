import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../model/user';
import bcrypt from 'bcryptjs';
// [POST] /users/register
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    let { firstName, lastName, avatar, email, password, status, lastLogin, role } = req.body;
   
    // select user by email
    const u = await User.findOne({ email }).exec();
   
    if(u){
        return res.status(400).json({
            message: 'User already exists'
        });
    }else{       
        const passwordHash = bcrypt.hashSync(password, 10);
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            firstName,
            lastName,
            email,
            password: passwordHash,
            lastLogin: '',
            avatar : "",
            status : 1,
            role: "user"
        });
    
        return user
            .save()
            .then((result) => {
                res.redirect('/login')
            })
            .catch((error) => {
                return res.status(500).json({
                    message: error.message,
                    error
                });
            });
    }
};

// [GET] /users/
const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await User.find().exec(); 
        return res.status(200).json({
            users: list,
            count: list.length
        });
        
    } catch (error : any) {
        return res.status(500).json({
            message: "erro",
            //error
        });
    }
   
};
// [POST] /users/login
const login = async (req: Request, res: Response, next: NextFunction) => {
    return res.json(req.body)
    
    // let { email, password} = req.body;
    //     // select user by email
    //     const u = await User.findOne({ email }).exec();
   
    //     if(u){
           
    //         //check password
            // if(bcrypt.compareSync(password, u.password)){
        
            //     return res.json(u)
            // }else{
            //     return res.json({message:"email or password is not correct!"});
            // }

    //     }
     
    //     return res.json({message:"email or password is not correct!"});
    
    
}

export default { createUser, getAllUser, login };