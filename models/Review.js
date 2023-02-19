const  mongoose=require('mongoose');

const ReviewSchema=mongoose.Schema({
    rating:{
        type:Number,
        required:[true,'Please provide ratimg'],
        min:1,
        max:5
    },
    title:{
        type:String,
        required:[true,'Please provide Title'],
        maxlength:100,
        trim:true
    },
    comment:{
        type:String,
        required:[true,'Please provide Comment']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref:'Product',
        required:true
    }
},{timestamps:true});
ReviewSchema.index({product:1,user:1},{unique:true})
module.exports=mongoose.model('Review',ReviewSchema)