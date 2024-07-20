const express = require('express');
const authenticateJWT = require('./Auth/Authentication');
const router = express.Router();


router.use('/v1/api',require('./Auth'));

router.get('/v1/api/data', authenticateJWT,(req,res,next) => {
    res.status(200).json({
        TuanMinh : "Trần Tuấn is a goat"
    })
})

module.exports = router;

