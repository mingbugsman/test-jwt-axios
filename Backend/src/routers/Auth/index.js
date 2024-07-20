const express = require('express');
const router = express.Router();
const JWT = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const users = [];
const accessTokenSecret = process.env.accessTokenSecret
const refreshTokenSecret =process.env.refreshTokenSecret

let refreshTokens = [];


router.post('/register', (req,res) => {
    const {username,password} = req.body;
    const hashedPassword = bcrypt.hashSync(password,8);
    const user = {username,password : hashedPassword};
    users.push(user);
    console.log(users);
    res.status(200).json({
        message : "User registered",
        user : user
    });
})


router.post('/login', async (req,res) => {
    const {username,password} = req.body;
    const user = users.find( u => u.username === username );

    if (user && bcrypt.compareSync(password,user.password)) {
        const accessToken = await JWT.sign({ username: user.username }, accessTokenSecret, { expiresIn: '20m' });
        const refreshToken = await JWT.sign({ username: user.username }, refreshTokenSecret, { expiresIn: '7d' });
        refreshTokens.push(refreshToken);
        res.json({accessToken, refreshToken });
    }
    else {
        res.json({
            message : "username or password incorrect"
        })
    }
    
})

router.post("/token", (req,res) => {
    const {token} = req.body;
    if (!token) {
        return res.sendStatus(401);
    }
    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }
    JWT.verify(token, refreshTokenSecret, async (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        const accessToken = await JWT.sign({ username: decoded.username }, accessTokenSecret, { expiresIn: '20m' });
        res.json({accessToken});
    });
});

module.exports =  router;