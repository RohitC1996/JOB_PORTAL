const mongoose = require('mongoose')
require('dotenv')
module.exports = {
    dbconfig: mongoose.connect(process.env.DB_url)
    .then(()=>console.log('DataBase connection done'))
    .catch((err)=> console.log(err + " connection not done"))

   }  