const express= require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../util/wrapAsync')
const Listings=require('../models/listing');
const {listingSchema,reviewSchema}=require('../schemaValid');
const Review = require('../models/review.js');
const { isLoggedIn } = require('../middleware.js');
const ExpressError=require('../util/ExpressError.js')
//importing reviewController
const reviewController=require('../controller/reviewController');
//validating review using joi
let validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error.details.map(el=>el.message).join(","));
    }
    else{
        next();
    }
}
//reviews
//post request
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))
// delete review route
router.delete("/:reviewId",isLoggedIn,wrapAsync(reviewController.deleteReview));


module.exports=router;