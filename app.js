var express                 = require("express"),
    mongoose                = require("mongoose"),
    bodyParser              = require("body-parser"),
    methodOverride          = require("method-override"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    flash                   = require("connect-flash"),
    passportLocalMongoose   = require("passport-local-mongoose");

//getting routes aand models from external files
var blogsRoutes     = require("./routes/blogs"),
    commentsRoutes  = require("./routes/comments"),
    usersRoutes     = require("./routes/users"),
    user            = require("./models/users");

mongoose.set('useUnifiedTopology',true);
mongoose.connect("mongodb+srv://rahulsinha84:rahulsinha84@yelpcamp-hyycr.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser:true});
var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
//for looking over the css files
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());
//using of routes

app.use(require("express-session")({
    secret:"I am Thor",
    resave:false,
    saveUninitialized: false
}));
//for setting up of passport
app.use(passport.initialize());
app.use(passport.session());
//for login
passport.use(new LocalStrategy(user.authenticate()));
//for encoding and coding the data
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser  = req.user;
    res.locals.moment       = require("moment");
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
    res.locals.warning      = req.flash("warning");
    next();
});
app.use("/blogs",blogsRoutes);
app.use("/blogs/:id/comments",commentsRoutes);
app.use("/",usersRoutes);
//for applying to all the templates



app.get("/",function(req,res){
    res.render("home");
});
//for the url other than the required url
app.get("*",function(req,res){
    res.send("There is no such URL....")
});
app.listen(process.env.PORT || 1200,function(){
    console.log("Server started...");
})