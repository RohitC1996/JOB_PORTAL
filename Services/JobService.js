const { application } = require('express');
const mongoose = require('mongoose');
const JobSchema = require('../Model/JobPost');

JobSchema.statics = {
    create: function (data, cb) {
        var user = new this(data);

        user.save(cb);
    },
    get : function(query,cb){
       
        this.find(query,cb)
        
    },
    update : function(query, updatedata, cb){
        this.findOneAndUpdate(query, {$set: updatedata}, {new: true},cb)
    },
    UpdateJOb : function(query, updatedata, cb){
        this.findOneAndUpdate(query, {$push: updatedata}, {new: true},cb)
    },
    
    DeleteandUpdateJOb : function(query, updatedata, cb){
        this.findOneAndUpdate(query, {$pull: {applicant: updatedata}}, {new: true},cb)
    },
    delete : function(query,cb){
        this.findOneAndRemove(query,cb)
    },
  
}
var JobPost = mongoose.model('JobPost', JobSchema);
module.exports = JobPost;
