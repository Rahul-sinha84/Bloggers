var mongoose = require("mongoose");


var blogsSchema = new mongoose.Schema({
    title:String,
    image:String,
    description:String,
    user:{
        id:{
            type:mongoose.Schema.Types.ObjectId ,
            ref:"User"
        },
        username:String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId ,
            ref:"Comment"
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("Blog",blogsSchema);
