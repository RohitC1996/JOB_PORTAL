const { number } = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    firstName:{
        type:String,
        minlength:3,
        required: true
    },
    lastName:{
        type:String,
        minlength:3,
        required: true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true,
        
    },
    Address:{
        type:String,
        
    },
    Phone_no:{
        type:Number,
       
        
    },
    Country:{
        type:String,
        required: true
        
    },
    Gender:{
        type:String,
        required: true,
        enum : ["male", "female"]
        
    },
    description:{
        type:String,
        
        
    },
    education :[ 
        
         { 
             
            tenth: { type:Number},
         
            twelth: {type: Number},

            grad: {type: Number},
            Post_grad: {type: Number},


    }], 
//     education :[
        
//         {   tenth: { type:Number, name: "tenth"  },
        
//            twelth: {type: Number, name: "twelth"},

//            grad: {type: Number, name: "grad"},
//            Post_grad: {type: Number, name: "Post_grad"},


//    }], 

    skills :
        
    {   technicalSkills:{type:Array},
        TrainingAndInternshipe: {type: Array}
    }
        
    

})

module.exports = UserSchema