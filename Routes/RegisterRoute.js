const express = require('express')
const path = require('path')
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('../Models/user');
const fs = require('fs');


//app.use('/', express.static(path.join(__dirname, 'static')))


router.post('/', async (req, res) => {
    //Read Values from Clients Payload
    const username = req.body.username;
    const password = req.body.password;
    //Check for Payloads Format
    if(typeof username !== 'string'){
        return res.json({ status: 'error', error: 'Invalid Username'})
    }
    if(typeof password !== 'string'){
        return res.json({ status: 'error', error: 'Invalid Password'})
    }
    if(password.length < 5){
        return res.json({ status: 'error', error: 'Password too Small. At least 6 Characters'});
    }
    //Hashing Password by using SHA512
   const passwordHashed = crypto.createHash("SHA512").update(password).digest();
   const passwordForDB = passwordHashed.toString('hex');
    try{
        const response = await User.create({
            username,
            password: passwordForDB
        })
        console.log("User created successfully");
        res.sendStatus(200);
    }catch(error){
        console.log(error)
        return res.json({ status: 'error'})
    }
})

module.exports = router;