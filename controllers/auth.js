const path = require('path');
const User = require('../models/Users');
const ErrorResponse = require('../utils/ErrorHandler')
const asyncHandler = require('../middleware/asyncHandler')

exports.register = asyncHandler(async (req, res, next) => {
    debugger;
   const {name,email,password,role} = req.body;
   const user = await User.create({
       name,
       email,password,role
   })

   res.status(200).json({success:true})
});