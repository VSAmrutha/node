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
// statics is on schema not on instance ( as like for pre save method)
ReviewSchema.statics.calculateAverageRating=async function(productId){
    const result=await this.aggregate([
        {$match:{product:productId}},
        {$group:{
            _id:null,
            averageRating:{$avg:'$rating'},
            numOfReviews:{$sum:1}
        }}
    ]);
    try{
        await this.model('Product').findOneAndUpdate({_id:productId},
            {averageRating:Math.ceil(result[0]?.averageRating || 0),
            numOfReviews:result[0]?.numOfReviews || 0}
            )
    }catch(err){
        console.log(err)
    }
}
ReviewSchema.post('save',async function(){
    await this.constructor.calculateAverageRating(this.product);
    console.log('post save hook')
})
ReviewSchema.post('remove',async function(){
    await this.constructor.calculateAverageRating(this.product);
    console.log('post remove hook')
})
module.exports=mongoose.model('Review',ReviewSchema)