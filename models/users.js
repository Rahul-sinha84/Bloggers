var mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");

var usersSchema = new mongoose.Schema({
    username:String,
    password:String
});

usersSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",usersSchema);