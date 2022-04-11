const express = require('express')
const path = require('path')
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('../Models/user');
const fs = require('fs');
const jwt = require('jsonwebtoken');


const JWT_SECRET = 'ugzsdU789hdu@isjEgzhsu€$%&jds/&%$§'


router.post('/', async (req, res) => {
    const username = req.body.username
    const passwordFromClient = req.body.password
    const user = await User.findOne({ username }).lean()//.lean gibt nur json zurück
    if(!user){
        console.log("Invalid User");
        return res.sendStatus(401);
    }
    const passwordHashed = crypto.createHash("SHA512").update(passwordFromClient).digest();
    const password = passwordHashed.toString('hex');
    const passwordInDb = await User.findOne({ password }).lean()//.lean gibt nur json zurück
    if(!passwordInDb){
        console.log("Invalid Password");
        return res.sendStatus(401);
    }
    const token = jwt.sign({
         id: user._id,
         username: user.username
    }, JWT_SECRET);
    if(user && passwordInDb){
        res.sendStatus(200);
    }
    
})

module.exports = router;