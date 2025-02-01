const express= require('express');
const router=express.Router();
exports.router=router;

const Listings=require('../models/listing');
const {listingSchema,reviewSchema}=require('../schemaValid');
const wrapAsync=require('../util/wrapAsync')
const ExpressError=require('../util/ExpressError.js')
const passport=require('passport');
const { isLoggedIn } = require('../middleware.js');
//importhing controller
const listingController=require('../controller/listing');
const multer=require('multer');
const {storage}=require('../cloudConfig');
const upload = multer({ storage });  

//validating listings using joi
let validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error.details.map(el=>el.message).join(","));
    }
    else{
        next();
    }
}
router
    .route("/")
    .get(wrapAsync(listingController.index))
    // index route
    .post(isLoggedIn,upload.single("listings[image]"),validateListing,wrapAsync(listingController.createListing));//addnew route


//new Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//edit route
router.get("/:id/edit", isLoggedIn,wrapAsync(listingController.showEdit));

router
.route("/:id")
    .put(isLoggedIn,upload.single("listings[image]"),validateListing,wrapAsync(listingController.editListing))//update route
    .delete(isLoggedIn,wrapAsync(listingController.deleteListing))//delete route
    .get(wrapAsync(listingController.showListing));//show route

module.exports=router;