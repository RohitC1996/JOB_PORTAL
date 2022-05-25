const mongoose = require('mongoose')
const orgSchema = require('../Model/Organization.Model');

orgSchema.statics = {
    
    create: function (data, cb) {
        var user = new this(data);

        user.save(cb);
    },
    get : function(query,cb){
        this.find(query,cb)
    },
    getOrgById: (query,cb)=>{
        this.find(query,cb)
    },
    update : function(query, updatedata, cb){
        this.findOneAndUpdate(query, {$set: updatedata}, {new: true},cb)
    },
    delete : function(query,cb){
        this.findOneAndRemove(query,cb)
    },
    
    
}
var OrgUser = mongoose.model('Organization', orgSchema);
module.exports = OrgUser;
