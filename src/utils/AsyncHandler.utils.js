const AsyncHandler = (HandlerFunction)=>{
    return (req, res, next)=>{
        Promise.resolve(HandlerFunction(req,res,next)).catch(err=>next(err))
    }
}
export default AsyncHandler