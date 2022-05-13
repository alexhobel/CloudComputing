const express = require('express')
const path = require('path')
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('../Models/user');

/**
 * Takes post request on path /register
 *
 * Reads the attributes username and password from the Clients payload. Checks if the username and password is from type string.
 * Checks if the Password has at least 6 Characters. Creates a Hash Value from Plain Text Password by using SHA512 Algorithm.
 * By Using the mongoose create() Method, the Schema from the User Model will be created and stores a User Document in the MongoDB.
 * This only workds if the Username is Unique, in the user.js File, the Schema is created. There is an Attribute 'unique' wich is set to value 'true'
 * So if the User is created successfully the Server will return a Status Code of 200, if not 401.
 * 
 * @param {object}   req         The request Object from Client
 * @param {object}   res         The Response Object from Server
 *
 * @return {number} Status Code of 200 if the User created successfully
 * @return {number} Status Code of 401 if the Username already exists
 * @return {number} Status Code of 402 if the Username has the wrong type
 * @return {number} Status Code of 402 if the Password has the wrong type
 * @return {number} Status Code of 403 if the Password is too short
 */
router.post('/', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(req.body);
    //Check for Payloads Format
    if(typeof username !== 'string'){
        return res.sendStatus(402);
    }
    if(typeof password !== 'string'){
        return res.sendStatus(402);
    }
    if(password.length < 5){
        return res.sendStatus(403);
    }
    //Hashing Password by using SHA512
   const passwordHashed = crypto.createHash("SHA512").update(password).digest();
   const passwordForDB = passwordHashed.toString('hex');
    try{
        await User.create({
            username,
            password: passwordForDB
        })
        console.log("User created successfully");
        return res.sendStatus(200);
    }catch(error){
        console.log(error);
        return res.sendStatus(401);
    }
})

module.exports = router;