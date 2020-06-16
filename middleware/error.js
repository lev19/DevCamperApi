// it's MIDLE WARE OBJECT
const ErrorResponse = require('../utils/ErrorHandler');

errorHandler =(err,req,res,next)=>{

let error = {...err};
error.message = err.message;

debugger;
// Overrride error
if(err.name ==='CastError'){
  error = new ErrorResponse(`bootcamp not found ${error.value}`,404);
}
if(err.name ==='ValidationError'){
  const message = Object.values(err.errors).map(v=>v.message);
  error = new ErrorResponse(message,404);
}
debugger;
// Overrride error
if(err.code ===11000){
  error = new ErrorResponse(`Duplicate value entered`,400);
}


  res.status(error.code || 500).json({
      success:false,
      error:error.message
  })
}

module.exports = errorHandler;