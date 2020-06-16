const path = require('path');
const Bootcamps = require('../models/Bootcamps');
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/ErrorHandler')
const asyncHandler = require('../middleware/asyncHandler')
const geocoder = require('../utils/GeoCoder');


exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamps.find().populate('courses');
    res.json({ success: true, count: bootcamps.length, data: bootcamps });
});

exports.postBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamps.create(req.body);
        if (!bootcamp) {
            return next(new ErrorResponse(`bootcamp not found ${req.params.id}`, 405))
        }
        res.status(201).json({
            success: true,
            data: bootcamp
        })
    } catch (error) {
        next(error)
    }

};

exports.putBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamps.findByIdAndUpdate(req.params.id, req.body);
        if (!bootcamp) {
            return next(new ErrorResponse(`bootcamp not found ${req.params.id}`, 405))
        }
        res.status(201).json({ success: true, data: bootcamp })
    } catch (error) {
        next(error)
    }

};

exports.deleteBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamps.findById(req.params.id);

        if (!bootcamp) {
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            );
        }

        // Make sure user is bootcamp owner
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(
                    `User ${req.params.id} is not authorized to delete this bootcamp`,
                    401
                )
            );
        }

        bootcamp.remove();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error)
    }

};

/// @route: api/v1/bootcamps/radius/:zipcode/:distance
exports.getBootcampsByRadius = asyncHandler(async (req, res, next) => {
    debugger;
    const loc = await geocoder.geocode(req.params.zipcode);
    const longitude = loc[0].longitude;
    const latitude = loc[0].latitude;
    const bootcamp = await Bootcamps.find({
        location: { $geoWithin: { $centerSphere: [[longitude, latitude], req.params.distance / 3963.2] } }
    })
    res.status(201).json({ success: true, data: bootcamp });
});


// @desc      Upload photo for bootcamp
// @route     PUT /api/v1/bootcamps/:id/upload
// @access    Private
exports.upload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamps.findById(req.params.id);
  
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
  
    // Make sure user is bootcamp owner
    /*if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.params.id} is not authorized to update this bootcamp`,
          401
        )
      );
    }*/
  
    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }
  
    const file = req.files.file;
  
    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }
  
    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }
  
    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }
  
      await Bootcamps.findByIdAndUpdate(req.params.id, { photo: file.name });
  
      res.status(200).json({
        success: true,
        data: file.name
      });
    });
  });
  