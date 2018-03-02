var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
seedDB();

app.get("/", function(req, res){
   res.render("landing"); 
});

// index of campground
app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        } else {
             res.render("campgrounds/index", {campgrounds:campgrounds});
        }
    });
   
});

// create campground
app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
    Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           res.redirect("/campgrounds");
       }
    });
});

// new campground
app.get("/campgrounds/new", function(req, res){
   res.render("campgrounds/new");
});

// show campground
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
             res.render("campgrounds/show", {campground: foundCampground});
        }
    });
   
});

// ===============
// COMMENTS ROUTES
// ===============

// new comment
app.get("/campgrounds/:id/comments/new", function(req, res){
        Campground.findById(req.params.id, function(err, campground){
           if(err){
                console.log(err);
           } else {
                res.render("comments/new", {campground: campground});
           }
        });
});

// create comment
app.post("/campgrounds/:id/comments", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("YelpCamp server has started!!"); 
});