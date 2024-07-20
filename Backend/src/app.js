require('dotenv').config();
const express = require('express');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
module.exports = app;