const express = require('express');
const router = express.Router();

const {getCourse,updateCourse,deleteCourse,getCourses} = require('../controllers/courses')

router.route('/').get(getCourses);
router.route('/:id').put(updateCourse).delete(deleteCourse).get(getCourse);
module.exports = router;