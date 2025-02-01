const mongoose = require('mongoose');
const Listing=require('../models/listing.js');
const intinialData=require('./data.js');

const main=async() =>{
    await mongoose.connect("mongodb://127.0.0.1:27017/nebulastay");

}
main().then(()=>{
    console.log("Database connected");
}).catch((err)=>{
    console.log(err);
}); 
const initData=()=>{
    Listing.deleteMany({});
    intinialData.data=intinialData.data.map((obj)=>({...obj,owner:"679b7927781544bdc4162629"}));
      Listing.insertMany(intinialData.data).then(()=>{    
        console.log("Data inserted");
    }).catch((err)=>{
        console.log(err);
        console.log("validation error:",err.message);
        console.log("error:",err.errors);
    }); 
}
initData();
    
