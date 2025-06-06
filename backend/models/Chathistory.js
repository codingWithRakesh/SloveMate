const mongoose = require("mongoose")
const { Schema } = mongoose;
const chathistory = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    message:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    response:{
        type:String,
        require:true
    }
},{
    timestamps:true
})

module.exports=mongoose.model('Chathistory',chathistory);