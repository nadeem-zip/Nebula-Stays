const mongoose=require('mongoose');
const {Schema,model}=mongoose;
const possportLocalMongoose=require('passport-local-mongoose');

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});
userSchema.plugin(possportLocalMongoose);
module.exports=model("User",userSchema);