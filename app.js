var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var Campground = require("./models/campgrounds");
var seedDB = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// Campground.create(
//     {
//       name: "Granite Hill", 
//       image:"https://images.unsplash.com/photo-1486082570281-d942af5c39b7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2d06322d7df8c19c1e648c8c3a101d2d&auto=format&fit=crop&w=700&q=60",
//       description: "This is a huge granite hill, no bathrooms, no water, beautiful granite"
        
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("New Campground created:");
//             console.log(campground);
//         }
//     });


app.get("/", function(req, res){
   res.render("landing"); 
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        } else {
             res.render("index", {campgrounds:campgrounds});
        }
    });
   
});

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

app.get("/campgrounds/new", function(req, res){
   res.render("new");
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
             res.render("show", {campground: foundCampground});
        }
    });
   
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("YelpCamp server has started!!"); 
});