const {StatusCodes}=require('http-status-codes');
const {checkPermissions}=require('../utils');
const CustomError=require('../errors');
const Poduct=require('../models/Product')
const Orders=require('../models/Order');
const Product = require('../models/Product');
const Order = require('../models/Order');

const fackeStripeAPI=async({amount,currency})=>{
    const clinet_secret='secret';
    return {clinet_secret,amount}
}
const createOrder=async(req,res)=>{
    const {items:cartItems,tax,shippingFee}=req.body;
    if(!cartItems || cartItems.length<1){
        throw new CustomError.BadRequestError(`No cart items found`)
    }
    if(!tax || !shippingFee){
        throw new CustomError.BadRequestError(`Please provide tax an shipping Fee`)
    }
    let orderItems=[],subtotal=0;
    //since its async we can use map or foreach to going through the array
    for(const item of cartItems){
        const dbProduct=await Product.findOne({_id:item.product});
        if(!dbProduct){
            throw new CustomError.NotFoundError(`No product with id ${item.product}`)
        } 
        const {name,price,image,_id}=dbProduct;
        const singleOrderItem={
            amount:item.amount,
            name,price,image,product:_id
        }
        // add item to order
        orderItems=[...orderItems,singleOrderItem];
        //calculate subtotal
        subtotal += item.amount *price
    }
    //calculate the total
    const total=tax+shippingFee+subtotal
    // get client secret
    const paymentIntent=await fackeStripeAPI({
        amount:total,
        currency:'usd'
    })
    const order=await Order.create({
        orderItems,total,subtotal,tax,shippingFee,clientSecret:paymentIntent.clinet_secret,user:req.user.userId
    })
    res.status(StatusCodes.CREATED).json({order,clientSecret:order.clientSecret})
}
const getAllOrders=async(req,res)=>{
    const orders=await Order.find({})
    res.status(StatusCodes.OK).json({orders,count:orders.length})
}
const getSingleOrder=async(req,res)=>{
    const order=await Order.findOne({_id:req.params.id})
    if(!order){
        throw new CustomError.NotFoundError(`No order with id ${req.params.id}`)
    }
    checkPermissions(req.user,order.user) 
    res.status(StatusCodes.OK).json({order})
}
const getCurrentUserOrders=async(req,res)=>{
    const orders=await Order.find({user:req.user.userId})
    res.status(StatusCodes.OK).json({orders,count:orders.length})
}

const updateOrder=async(req,res)=>{
    const {paymentIntentId}=req.body;
    const order=await Order.findOne({_id:req.params.id})
    if(!order){
        throw new CustomError.NotFoundError(`Order not found with id ${req.params.id}`)
    }
    checkPermissions(req.user,order.user) 
    order.paymentIntentId=paymentIntentId;
    order.status='paid';
    await order.save()
    res.status(StatusCodes.OK).json({order})
}



module.exports={getAllOrders, getSingleOrder, getCurrentUserOrders,
    createOrder, updateOrder}