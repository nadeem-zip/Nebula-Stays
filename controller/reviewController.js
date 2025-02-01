const Listings = require('../models/listing');
const Review = require('../models/review');

module.exports.createReview=async(req,res)=>{
    const {id} = req.params;
    let listings= await Listings.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listings.reviews.push(newReview);
     await newReview.save();
  await  listings.save();
  req.flash("success","new Review added");
  res.redirect(`/listings/${id}`);
}
//deleting  a review
module.exports.deleteReview=async(req,res)=>{
    const {id,reviewId}=req.params;
    await Listings.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
}