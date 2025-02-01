if(process.env.NODE_ENV!=  "production"){
require('dotenv').config();
}
// console.log(process.env);
const express=require('express');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const Listings=require('./models/listing');
const ejsMate = require('ejs-mate');
const app=express();
const path=require('path');
const listingsRouter=require('./routes/listings');
const ExpressError=require('./util/ExpressError');
const reviewsRouter=require('./routes/reviews');
const session=require('express-session');
const MongoStore=require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const localStrategy=require('passport-local');
const User=require('./models/user');
const userRouter    = require('./routes/users');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,"public")));
app.engine('ejs',ejsMate);
app.listen(8080,()=>{
    console.log("Server is running on port 8080");
});

const dbUrl=process.env.ATLASDB_URL;
const store= MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.Secret,
    },
    touchAfter:24*60*60
});
let sessionConfig={
    store,
    secret:process.env.Secret,
    resave:false,
    saveUninitialized:true,    
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    } 
}

app.use(session(sessionConfig));

app.use(flash());

//passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
})
// routing to listings route
app.use("/listings",listingsRouter);
//routing to reviews route
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);



let main = async ()=>{
    await mongoose.connect(`${dbUrl}`);
}
app.all('*',(req,res,next)=>{
    next(new ExpressError(404,"Page not found!  "));
})  
main().then(()=>{
    console.log("Database connected");
}).catch((err)=>{   
    console.log(err);
});;

app.use((error,req,res,next)=>{
   const {statusCode=500,message="Something went wrong"}=error;
   res.status(statusCode).render("error",{message});
})