var express = require("express"),
    route   = express.Router(),
    passport= require("passport");
    blogs   = require("../models/blogs"),
    comments= require("../models/comments"),
    users   = require("../models/users");

//For Sign in 
route.get("/signup",function(req,res){
    res.render("users/signup");
});
//for register
route.post("/signup",function(req,res){
    var newUser = {
        username:req.body.username,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email
    };
    if(req.body.adminCode==="secretcode123"){
        newUser.isAdmin = true
    }
    users.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            req.flash("error",err.message);
            res.redirect("/signup");
        }else{
            passport.authenticate("local")(req,res,function(){
               
                if(newUser.isAdmin){
                    //for checking if the first name exist or not
                    req.flash("success","Welcome "+ newUser.firstName);
                    req.flash("primary","You are now an admin!");
                    res.redirect("/");
                }else{
                    req.flash("success","Welcome "+req.body.username);
                    req.flash("warning","You are not an admin...");
                    res.redirect("/");
                } 
            });
        }
    });
});
//For viewing the profile
route.get("/user/:id",function(req,res){
    users.findById(req.params.id,function(err,foundUser){
        if(err){
            console.log(err);
            req.flash("error","Something went wrong...")
            res.redirect("back");
        }else{
            blogs.find().where('user.id').equals(foundUser._id).exec(function(err,blogs){
                if(err){
                    console.log(err);
                    res.redirect("back");
                }else{
                    res.render("users/show",{blogs:blogs,foundUser:foundUser});
                }
            })
        }
    })    
        
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