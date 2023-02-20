const Review =require('../models/Review');
const Product =require('../models/Product');
const {StatusCodes}=require('http-status-codes');
const {checkPermissions}=require('../utils');
const CustomError=require('../errors');

const createReview=async(req,res)=>{
    const {product:productId}=req.body;
    const isValidProduct=await Product.findOne({_id:productId});
    if(!isValidProduct){
       throw new CustomError.NotFoundError(`No product with id: ${productId}`)
    }
    const alreadySubmitted=await Review.findOne({product:productId,user:req.user.userId});
    if(alreadySubmitted){
        throw new CustomError.BadRequestError(`Already submitted review for this product`)
     }
    req.body.user=req.user.userId;
    const review=await Review.create(req.body)
    res.status(StatusCodes.CREATED).json({review})
}
const getAllReviews=async(req,res)=>{
    // in case you want more details on user then chain .populate({path:'user',select:'name'})
    const reviews=await Review.find({}).populate({path:'product',select:'name company price'})
    res.status(StatusCodes.OK).json({reviews,count:reviews.length})
}
const getSingleReview=async(req,res)=>{
    const {id:reviewId}=req.params;
    const review=await Review.findOne({_id:reviewId})
    if(!review){
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
     }
    res.status(StatusCodes.OK).json({review})
}

const updateReview=async(req,res)=>{
    const {id:reviewId}=req.params;
    const {rating,title,comment}=req.body;
    const review=await Review.findOne({_id:reviewId})
    if(!review){
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
     }
     checkPermissions(req.user,review.user)
     review.rating=rating;
     review.title=title;
     review.comment=comment;

     await review.save()
    res.status(StatusCodes.OK).json({review})
}

const deleteReview=async(req,res)=>{
    const {id:reviewId}=req.params;
    const review=await Review.findOne({_id:reviewId})
    if(!review){
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
     }
     checkPermissions(req.user,review.user)
     // using .remove() is very very important as it can be triggered by deleteMany method which is used when product is deleted so that reviews associated with that (deleted)product will also be deleted.
     await review.remove()
    res.status(StatusCodes.OK).json({msg:'Deleted successfully'})
}
const getSingleProductReviews=async(req,res)=>{
    const {id:productId}=req.params;
    const reviews=await Review.find({product:productId});
    res.status(StatusCodes.OK).json({reviews,count:reviews.length})
}

module.exports={createReview, getAllReviews, getSingleReview, updateReview, deleteReview,getSingleProductReviews}