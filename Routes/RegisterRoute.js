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
   const path = "/Users/AlexMacBook/Desktop/Uni/Semester 6/Cloud Computing/Aufgabe1/cloudcomputing/Frontend/index.html"
    try{
        const response = await User.create({
            username,
            password: passwordForDB
        })
        console.log('User created successfully: ', response)
    }catch(error){
        console.log(error)
        return res.json({ status: 'error'})
    }

    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile(path, null, function(error, data) {
        if(error){
            res.writeHead(404);
            res.write('File not found');
        }else {
            res.write(data);
        }
        res.end();
    })

})

module.exports = router;