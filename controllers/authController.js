const { StatusCodes } = require("http-status-codes")
const User=require("../models/User")
const CustomError=require('../errors/index')
const {attachCookiesToResponse}=require('../utils')


const register=async(req,res)=>{
    const {email,name,password}=req.body;
    const emailAlreadyExists=await User.findOne({email})
    if(emailAlreadyExists){
        throw new CustomError.BadRequestError('Email already exits')
    }
    const isFirstAccount=await User.countDocuments({})===0
    const role=isFirstAccount?'admin':'user'
    const user=await User.create({email,name,password,role})
    const tokenUser={name:user.name,userId:user._id,role:user.role}
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.CREATED).json({user:tokenUser})
}
const login=async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        throw new CustomError.BadRequestError('Email and Password are required') ;
    }
    const user=await User.findOne({email});
    if(!user){
        throw new CustomError.BadRequestError('Email not found') ;
    }
    const isMatch=await user.comparePassword(password)
    if(!isMatch){
        throw new CustomError.UnauthenticatedError('PLease check your credentials') ;
    }
    const tokenUser={name:user.name,userId:user._id,role:user.role}
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
}
const logout=async(req,res)=>{
    res.cookie('token','logout',{httpOnly:true,expires:new Date(Date.now())})
    res.status(StatusCodes.OK).json({msg:'logout successfully'})
}

module.exports={login,logout,register}