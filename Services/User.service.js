const mongoose = require('mongoose')
const { userSchema } = require('../Model/index');
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

userSchema.statics = {
    create : function(data, cb) {
        var user = new this(data);
        console.log(user);
        user.save(cb);
    },
    get: function(query,cb){
        this.find(query,cb)
    },
    getUserById: (query,cb)=>{
        this.find(query,cb)
    },
    updateOneUser : function(query, updatedata, cb){
        this.findOneAndUpdate(query, {$set: updatedata}, {new: true},cb)
    },
    updateeducation : function(query, updatedata, cb){                               
   User.updateOne({ _id: ObjectId(req.params.id) , "education._id": ObjectId(req.params.id2) },
    { $set: { "Education.$.tenth" : 201002, } } )
        
    },
    delete: function(query,cb){
        this.findByIdAndRemove(query,cb)
    },
        
      
    
}
var User = mongoose.model('JobSeeker', userSchema);
module.exports = User;
