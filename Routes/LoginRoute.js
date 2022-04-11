const express = require('express')
const path = require('path')
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('../Models/user');
const fs = require('fs');
const jwt = require('jsonwebtoken');

/**
 * Takes post request on path /logIn
 *
 * Reads the attributes username and password from the Client. Than search for the User in local DB by using MongoDB's findOne() Method.
 * If the username provided by Client can't be found in DB, it will return a 401 Status Code to the Client.
 * If the username was found the given Password from Client will be hashed by SHA512 algorithm so it's no plain Text anymore. Thats how Passwords are Stored in DB.
 * Also, by using the findOne() Method, the function is looking for the same Hash Value. If the User can't be found it will send a 401 StatusCode.
 * If the Clients password and username is in DB, the function returns a 200 Status Code to Client.
 * 
 * @param {object}   req         The request Object from Client
 * @param {object}   res         The Response Object from Server
 *
 * @return {number} Status Code of 401 by invalid User or Password
 * @return {number} Status Code of 200 by valid User and Password
 */
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
    if(user && passwordInDb){
        return res.sendStatus(200);
    }
    
})

module.exports = router;