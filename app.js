const express=require('express');
//this dotenv helps to use .env file
require('dotenv').config()
//expres async errors will handle any error which comes in the route, and invoke errorhandler.js
require('express-async-errors')
const cookieParser=require('cookie-parser')
const fileUpload=require('express-fileupload')
const authRouter=require('./routes/authRoutes')
const userRouter=require('./routes/userRoutes')
const productRouter=require('./routes/productRoutes');
const reviewRouter=require('./routes/reviewRoutes')
const notFoundMiddleware=require("./middleware/not-found")
const errorHandlerMiddleware=require("./middleware/error-handler")
const app=express();
const morgan=require('morgan')
const connectDB=require("./db/connect")
// morgan will be the routes which were hit,its like a logger
app.use(morgan('tiny'))

//express.json will provide req.body
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
//app.use(cookieParser())
app.use(express.static('./public'))
app.use(fileUpload())
app.get('/',(req,res)=>{
    res.send('E-com API')
})
app.get('/api/v1',(req,res)=>{
    console.log(req)
    console.log("signedCookies*********=>",req.signedCookies)
    console.log("cookies*********=>",req.cookies)
    res.send('E-com API')
})
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter)
// not found should be coming before error handler as error handler will be only invoked from a valid route, like when we have an error
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port=process.env.port || 3000
const start=async()=>{
    try{
        await connectDB(process.env.MONGO_URI)
    app.listen(port,console.log(`Listening to the port ${port}`))
    }catch(err){
        console.log(err)
    }
    
}
start()
