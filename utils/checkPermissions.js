const CustomError=require('../errors');
const checkPermissions=(requestUser,paramsUserId)=>{
    if(requestUser.role==='admin') return
    if(requestUser.userId===paramsUserId.toString()) return   
    throw new CustomError.UnauthorizedError(`You are not authorized to view $id{req.params.id}`)
}
module.exports=checkPermissions