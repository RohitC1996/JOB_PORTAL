        const { array } = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('../Services/Org.service')

const JobSchema = new Schema({

    Org_id: {
        type:mongoose.Schema.Types.ObjectId, 
        ref: "Organization" 
    },
    title:{
        type:String,
        minlength:3,
        required:true
    },
    description:{
        type:String,
        minlength:3,
     
    },
    requiredSkills:[String],
    salaryRange:{
        type:String,
      
    },
    location:{
        type:String,
       
        
    },
    applicant:[
        
           {
              type: String,   
              ref: "JobSeeker" 
            },
        ],
        
    Country:{
        type:String,
      
        
    }
    
   


})

module.exports = JobSchema