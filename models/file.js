//file database object
const mongoose = require('mongoose')
const fileSc = new mongoose.Schema({
    path:{
        type:String,
        required:true
    },
    orignalName:{
        type:String,
        require:true
    },
    password:String,
    downloadCount:{
        type:Number,
        required:true,
        default:0
    }
})

//telling mongoose to create in database
module.exports = mongoose.model("file",fileSc) //name of table, schema name