var comments = require("../models/comments"),
    blogs    = require("../models/blogs");

var middleware = {};
middleware.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You needed to be logged in to do that!!!");
    res.redirect("/login");
}
middleware.blogOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        blogs.findById(req.params.id,function(err,blog){
            if(err){
                res.redirect("back");
            }else{
                if(blog.user.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You needed to be logged in to do that!!!");
        res.redirect("back");
    }
}
middleware.commentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        comments.findById(req.params.comment_id,function(err,comment){
            if(err){
                res.redirect("back");
            }else{
                if(comment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }
                else{
                    res.redirect("back");
                }
            }
        })
    }else{
        req.flash("error","You needed to be logged in to do that!!!");
        res.redirect("back");
    }
}

module.exports = middleware;