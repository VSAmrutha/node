const {createReview, getAllReviews, getSingleReview, updateReview, deleteReview}=require('../controllers/reviewController');
const express=require('express');
const {authenticateUser}=require('../middleware/authentication')
const router=express.Router();

router.route('/').get(getAllReviews).post(authenticateUser,createReview);
router.route('/:id').get(getSingleReview).patch(authenticateUser,updateReview).delete(authenticateUser,deleteReview);

module.exports=router