const express = require('express');
const router = express.Router();

const {getBootcamps,postBootcamps,putBootcamps,deleteBootcamps,getBootcampsByRadius,upload} = require('../controllers/bootcamps')
const {getCourses,addCourse,} = require('../controllers/courses');

router.route('/radius/:zipcode/:distance').get(getBootcampsByRadius);
router.route('/').get(getBootcamps).post(postBootcamps);
router.route('/:id').put(putBootcamps).delete(deleteBootcamps);
router.route('/:bootcampId/courses').get(getCourses).post(addCourse);
router.route('/:id/upload').put(upload);
module.exports = router;

