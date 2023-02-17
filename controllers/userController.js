const {StatusCodes}=require('http-status-codes');
const CustomError=require('../errors');
const User = require('../models/User');
const {attachCookiesToResponse,createTokenUser}=require('../utils')

const  getAllUsers=async(req,res)=>{
    const users=await User.find({role:'user'}).select('-password')
   
    res.status(StatusCodes.OK).json({users})
}
const  getSingleUser=async(req,res)=>{
    const user=await User.findOne({_id:req.params.id}).select('-password')
    if(!user){
        throw new CustomError.NotFoundError(`User not found ${id}`)
    }
    res.status(StatusCodes.OK).json({user})
}
const  showCurrentUser=async(req,res)=>{
    res.status(StatusCodes.OK).json({user:req.user})
}
// user with findOneAndUpdate
//const  updateUser=async(req,res)=>{
//    const {email,name}=req.body;
//    if(!email || !name){
//        throw new CustomError.BadRequestError('Email and Name are required') ;
//    }
//    const user=await User.findOneAndUpdate({_id:req.user.userId},{email,name},{new:true,runValidators:true})
//    const tokenUser=createTokenUser(user)
//    attachCookiesToResponse({res,user:tokenUser})
//    res.status(StatusCodes.OK).json({user:tokenUser})
//}
// user with user.save
const  updateUser=async(req,res)=>{
    const {email,name}=req.body;
    if(!email || !name){
        throw new CustomError.BadRequestError('Email and Name are required') ;
    }
    const user=await User.findOne({_id:req.user.userId})
    user.email=email;
    user.name=name
    await user.save();
    const tokenUser=createTokenUser(user)
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
}
const  updateUserPassword=async(req,res)=>{
    const {oldPassword,newPassword}=req.body;
    if(!oldPassword && !newPassword){
        throw new CustomError.BadRequestError('Old and New Password are required')
    }
    const user=await User.findOne({_id:req.user.userId})
    const isMatchPassword=await user.comparePassword(oldPassword)
    if(!isMatchPassword){
        throw new CustomError.UnauthenticatedError('Password do not match')
    }
    user.password=newPassword;
    await user.save()
    res.status(StatusCodes.OK).json({msg:'Updated Password successfully'})
}

module.exports={getAllUsers,getSingleUser,showCurrentUser,updateUser,updateUserPassword}