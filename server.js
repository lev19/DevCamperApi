const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const fileUpload = require('express-fileupload');

dotenv.config({path:'./config/config.env'});

// Connect to DB
connectDB();
//Routes
const bootcamps = require('./routes/bootcamp');
const courses = require('./routes/courses');

const app = express();

app.use(express.json())
// Mount routers
if(process.env.NODE_ENV==='development'){
    app.use(morgan());
}
app.use(fileUpload({
    limits: { fileSize: process.env.MAX_FILE_UPLOAD }
}
));
app.use('/api/v1/bootcamps/',bootcamps);
app.use('/api/v1/courses/',courses);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT,
    console.log(`Server running in  ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`)
    server.close(()=>{
        return process.exit(1);
    })

})
