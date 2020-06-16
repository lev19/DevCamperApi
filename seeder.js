const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
dotenv.config({ path: './config/config.env' });


const Bootcamps = require('./models/Bootcamps');
const Course = require('./models/Course');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

const documents = JSON.parse(fs.readFileSync('./_data/bootcamps.json', 'utf8'));
const courses = JSON.parse(fs.readFileSync('./_data/courses.json', 'utf8'));



const createBootcamps = async () => {
    try {
       
        await Bootcamps.create(documents);
        await Course.create(courses);
        console.log(`Bootcamps created`.green.inverse)
        process.exit();
    } catch (error) {
        console.log(`Error in createBootcamps: ${error.message}`)
    }
}

const deleteBootcamps = async () => {
    try {
        await Bootcamps.deleteMany();
        await Course.deleteMany();
        console.log('Bootcamps deleted'.red.inverse)
        process.exit();
    } catch (error) {
        console.log(`Error in deleteBootcamps: ${error.message}`)
    }
}

var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);
if (Array.isArray(myArgs) && myArgs.length) {
    switch (myArgs[0]) {
        case 'd':
            deleteBootcamps();
            break;
        case 'c':
            createBootcamps();
            break;

        default:
            break;
    }
}


