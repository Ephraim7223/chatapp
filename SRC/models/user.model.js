import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },        
    password: {
        type: String,
        required: true,
    },
    bio : {
        type: String,
        default: ' '
    },
    DOB: {
        type: String,
        required: true
    },
    followers: {
        type: [String],
        required: true,
    },        
    following: {
        type: [String],
        required: true,
    },        
    profilePic: {
        type: String,
        default: ' '
    },        
    coverPhoto: {
        type: String,
        default: ' '
    },        
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },    
    status: {
        type: Boolean,
        default: false
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    loginId: {
        type: String,
        default: null
    },
    gender: {
        type: String,
        enum: ["Male", "male", "Female", "female", "FEMALE", "MALE"],
        required: true
    }

})

const User = mongoose.model('User', userSchema)
export default User