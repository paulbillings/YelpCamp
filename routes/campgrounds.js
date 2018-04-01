var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");

// index of campground
router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        } else {
             res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
   
});

// create campground
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           console.log(newlyCreated);
           res.redirect("/campgrounds");
       }
    });
});

// new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new");
});

// show campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "Sorry, that campground does not exist!");
            res.redirect("back");
        } else {
            console.log(foundCampground);
             res.render("campgrounds/show", {campground: foundCampground});
        }
    });
   
});

// edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                req.flash("error", "Campground not found!");
                res.redirect("back");
            } else {
                res.render("campgrounds/edit", {campground: foundCampground});
            }
        });
});


// update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            req.flash("error", "Error, campground not updated");
            res.redirect("/campgrounds");
        } else {
            // redirect somewhere(show page)
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Error, campground not deleted");
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;