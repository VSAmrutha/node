const { StatusCodes } = require("http-status-codes")
const User=require("../models/User")
const CustomError=require('../errors/index')
const jwt=require('jsonwebtoken')


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
    const token=jwt.sign(tokenUser,process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
    res.status(StatusCodes.CREATED).json({user:tokenUser,token})
}
const login=async(req,res)=>{
    res.status(StatusCodes.OK).json('da')
}
const logout=async(req,res)=>{
    res.status(StatusCodes.OK).json('data')
}

module.exports={login,logout,register}