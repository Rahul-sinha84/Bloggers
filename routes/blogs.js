var     express     = require("express"),
        route       = express.Router(),
        blogs       = require("../models/blogs"),
        comments    = require("../models/comments"),
        middleware  = require("../middleware/index"),
        methodOverride  = require("method-override");

route.use(methodOverride("_method"));
//for fuzzy-searching.....
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


//INDEX Template
route.get("/",function(req,res){    
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        blogs.find({title:regex},function(err,blogs){
            if(err){
                console.log(err);
                res.redirect("back");
            }else{
                if(blogs.length<1){
                    req.flash("error","Your search didn't match with our blogs!");
                    return res.redirect("back");
                }
                res.render("blogs/index",{blogs:blogs});
            }
        });
    }else{
        blogs.find({},function(err,blogs){
            if(err){
                console.log(err);
                res.redirect("back");
            }else{
                res.render("blogs/index",{blogs:blogs});
            }
        });
    }    
        
        
});
//NEW Template
route.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("blogs/new");
});
//CREATE 
route.post("/",middleware.isLoggedIn,function(req,res){
    blogs.create(req.body.blogs,function(err,blog){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            blog.user.username = req.user.username;
            blog.user.id = req.user._id;
            blog.save();
            req.flash("success","Successfully added your Blog!!!");
            res.redirect("/blogs");
        }
    });
});
//SHOW Template
route.get("/:id",function(req,res){
    blogs.findById(req.params.id).populate("comments").exec(function(err,blog){
        if(err){
            console.log(err);
            
        }else{
            res.render("blogs/show",{blog:blog});
        }
    })
});
//EDIT Template
route.get("/:id/edit",middleware.blogOwnership,function(req,res){
    blogs.findById(req.params.id,function(err,blog){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("blogs/edit",{blog:blog});
        }
    })
});
//UPDATE Template
route.put("/:id",middleware.blogOwnership,function(req,res){
 
    blogs.findByIdAndUpdate(req.params.id,req.body.blogs,function(err,blog){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("warning","Successfully edited!!!");
            res.redirect("/blogs/"+blog._id);
        }
    })
});
//DELETE Template
route.delete("/:id",middleware.blogOwnership,function(req,res){
    blogs.findOneAndRemove(req.params.id,function(err,blog){
        if(err){
            console.log(err);
            res.redirect("/blogs/"+req.params.id);
        }else{
            req.flash("warning","Deleted your blog!!!");
            res.redirect("/blogs");
        }
    })
});

module.exports = route;