const { isLoggedIn } = require('../middleware');
const { router } = require('../routes/listings');
const Listings= require('../models/listing');
const {listingSchema}=require('../schemaValid');
const ExpressError=require('../util/ExpressError');
//index route 
module.exports.index=async(req,res)=>{
    const allListings= await Listings.find({});
    res.render("listings/index",{allListings});

}
//to render new form
module.exports.renderNewForm=(req,res)=>{
    
    res.render("listings/new");
}
//to create a new listing
module.exports.createListing=async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const data=listingSchema.validate(req.body);
    if(data.error!=null){
        console.log(data.error)
        throw new ExpressError(400,data.error.details.map(el=>el.message).join(","));
    }
    const newListing= new Listings(req.body.listings);
    newListing.image.url=url;
    newListing.image.filename=filename;
    newListing.owner=req.user._id;
    console.log(newListing);
    await newListing.save();
    req.flash("success","Successfully added a new listing");
    res.redirect("/listings/");
}

//to show edit form
module.exports.showEdit=async(req,res)=>{
    const {id}=req.params;
    const listing= await Listings.findById(id);
    if(!listing){
        req.flash("error","listing does not exist");
        return res.redirect("/listings");
   }
    res.render("listings/edit",{listing});
}
//to edit a listing
module.exports.editListing=async(req,res)=>{
    const {id}=req.params;
    const listing= await Listings.findByIdAndUpdate(id,{...req.body.listings})
    if( typeof req.file!="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image.url=url;
    listing.image.filename=filename;
    await listing.save();
    }
    req.flash("success","Successfully Updated a  listing");
    res.redirect("/listings");
}
//to delete a listing
module.exports.deleteListing=async(req,res)=>{
    const {id}=req.params;
    await Listings.findByIdAndDelete(id);
    req.flash("success","Successfully deleted a  listing");
    res.redirect("/listings");
}

//to show a listing
module.exports.showListing=async(req,res)=>{
    let {id}= req.params;
   const listing= await Listings.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
         req.flash("error","listing does not exist");
         return res.redirect("/listings");
    }
    res.render("listings/show",{listing});

}