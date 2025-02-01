const mongoose=require('mongoose');
const{Schema,model}=mongoose;
const Review=require('./review');
const User = require('./user');
const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }, 
        image:{
          url:String,
            filename:String,
         }, 
         price:{
            type:Number,
            required:true,
            min:1,
         },
         location:{
            type:String,
            required:true
         },
         country:{
            type:String
         }, 
         owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
         },
         reviews:[{
            type:Schema.Types.ObjectId,
            ref:"Review",
         }],
        
        });
listingSchema.post('findOneAndDelete',async function(listing){
    if(listing){
        await Review.deleteMany({
            _id:{
                $in:listing.reviews
            }
        })
    }
})  

const Listing = model("listing",listingSchema);
module.exports=Listing;