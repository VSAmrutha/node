const CustomError=require('../errors');
const checkPermissions=(requestUser,resourceUserfromDb)=>{
    if(requestUser.role==='admin') return
    if(requestUser.userId===resourceUserfromDb.toString()) return   
    throw new CustomError.UnauthorizedError(`You are not authorized to view $id{req.params.id}`)
}
module.exports=checkPermissions