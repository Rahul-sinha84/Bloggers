var express = require("express"),
    route   = express.Router(),
    passport= require("passport");
    blogs   = require("../models/blogs"),
    comments= require("../models/comments"),
    users   = require("../models/users");

//For Sign in 
route.get("/signin",function(req,res){
    res.render("users/signin");
});
//for register
route.post("/signin",function(req,res){
    users.register(new users({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            req.flash("error",err.message);
            res.redirect("/signin");
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/");
            });
        }
    });
});
//Login page
route.get("/login",function(req,res){
    res.render("users/login");
});
route.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login"
}),function(req,res){});
//for Logout
route.get("/logout",function(req,res){
    req.logOut();
    req.flash("success","Successfully logged you out!!!")
    res.redirect("/");
});

module.exports = route;