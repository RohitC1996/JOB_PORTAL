const { string } = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orgSchema = new Schema({
    // JobPost: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'JobPost'
    //   }],
    userName: {
        type: String,
        minlength: 3,
        required: true
    },
    // userType:{

    //     type:String,
    //     required: true,
    //     enum :["org"]
    // },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true,

    },
    Address: {
        type: String,

    },
    Phone_no: {
        type: Number,


    },
    Country: {
        type: String,
        required: true

    },
    JobPost: [{
        job_id: {
            type: String,
        }
    }],
    token:{
        type:String,
        
    },


})

module.exports = orgSchema