const mongoose = require('mongoose')


//Schema for User Model
const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},//Unique User Name required
    password: { type: String, required: true }
},
    //To Store in the right collection
    { collection: 'users' }
)

const model = mongoose.model('UserSchema', UserSchema)

module.exports = model