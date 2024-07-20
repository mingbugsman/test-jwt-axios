require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');


app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));


app.use(require('./routers'));
// handling errors
app.use((req,res,next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
})

app.use((error,req,res,next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status : 'error',
        code : statusCode,
        message : error.message || "Internal server"
    })
})


module.exports = app;