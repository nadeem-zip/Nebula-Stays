const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const User=require("../models/user");
const { router } = require("../routes/users");


module.exports.registerPage=(req,res)=>{
    res.render("users/signup.ejs");
}

//to register
module.exports.register=async(req,res)=>{
    try{
        const {email,username,password}=req.body;
        const user=new User({email,username});
        const registeredUser=await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err) return next(err);
            req.flash("success","Welcome to NebulaStay");
            res.redirect("/listings");
        })
    
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

//login page
module.exports.loginPage=(req,res)=>{
    res.render("users/login");
}
//login post route
module.exports.login=(req,res)=>{
    req.flash("success","Welcome back");
    res.redirect(res.locals.redirectUrl || "/listings");
}
//logout
module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            req.flash("error","Something went wrong");
            res.redirect("/listings");
        }
        req.flash("success","Goodbye");
        res.redirect("/listings");
    })
}